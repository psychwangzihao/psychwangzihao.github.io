/* ============================================================
 * 场景 8：脑电波演示  (id: eeg · 11 个状态 · 暗色)
 * 目的：展示科学测量，强调脑电不是读心术。
 * 现场会请一位志愿者戴上脑电头环，本场景是他的视觉伴奏，
 * 8.1 就是直接说给志愿者听的指令。
 *
 * 共用绘图：makeWave() —— 单个波形（8.0–8.2）与左右对比（8.3）
 * 都调它，画法只有一份。
 * ============================================================ */
(function () {
  'use strict';

  var TAU = Math.PI * 2;

  /* 跨状态续相位：换状态时波形不跳，只是「参数」过渡过去 */
  var CARRY = {};

  /* 三种状态的外观参数
     amp   幅度（占画布高度）
     freq  主节律频率 Hz
     comp  第二条不可通约的频率 Hz —— 免得波形太「干净」
     hf    高频噪声强度；ncell 噪声相关长度（秒）
     prob  瞬变出现概率；sw 瞬变宽度（秒） */
  var MODES = {
    noisy: { amp: .45, freq: 10.6, comp: 4.7,  hf: .16, ncell: .10,  prob: .06, sw: .09  },
    alpha: { amp: .75, freq: 10.0, comp: 3.1,  hf: .05, ncell: .34,  prob: .01, sw: .14  },
    beta:  { amp: .30, freq: 22.0, comp: 17.3, hf: .36, ncell: .022, prob: .22, sw: .075 },
  };

  /* ---------------- 信号合成的小零件 ---------------- */

  /* 确定性伪随机：同样的输入永远得到同样的输出，
     噪声才能像信号一样跟着波形往左滚，而不是每帧乱闪 */
  function hash(i) {
    var x = Math.sin(i * 12.9898) * 43758.5453;
    return (x - Math.floor(x)) * 2 - 1;
  }

  /* 平滑值噪声：相关长度 cell 秒，读起来像 1/f 抖动 */
  function vnoise(t, cell) {
    var x = t / cell, i = Math.floor(x), f = x - i;
    var u = f * f * (3 - 2 * f);            /* smoothstep 插值，别出现折线 */
    var a = hash(i), b = hash(i + 1);
    return a + (b - a) * u;
  }

  /* 稀疏瞬变：眨眼 / 肌肉 / 电极接触不好那种窄尖刺 */
  function spikeAt(t, prob, width) {
    var x = t / width, i = Math.floor(x), f = x - i;
    if (hash(i + 1013) < 1 - prob) return 0;
    var env = 1 - Math.abs(2 * f - 1);      /* 窄三角包络，两端归零 */
    return hash(i + 7919) * env * env;
  }

  /* ---------------- 共用绘图：合成脑电波形 ----------------
   * canvas 由调用方先插进 DOM；ctx 用来跑 rAF（切状态自动清理）。
   * 返回 { setMode(mode), dispose() }。
   *
   * 采样值由「内部相位累加器 + 位置哈希噪声」实时算出来，
   * 不存样本数组，所以可以一直跑下去，不需要数据文件。
   * setMode() 用 1 秒线性插值把参数挪过去，是「变」不是「切」。
   * opts.carry 让新状态接上旧状态的相位。
   * ------------------------------------------------------ */
  function makeWave(canvas, opts) {
    opts = opts || {};
    var ctx = opts.ctx;
    var carry = opts.carry || {};

    /* 颜色只从设计系统的变量里取，不自己编色值 */
    var css = getComputedStyle(document.documentElement);
    var color = (css.getPropertyValue('--accent-blue') || '').trim();
    if (!color) color = (css.getPropertyValue('--text-inverse') || '').trim();

    var g = canvas.getContext('2d');
    var target = MODES[opts.mode] || MODES.noisy;
    var from = carry.p || target;             /* 第一次 = 目标，不闪 */
    var cur = {
      amp: from.amp, freq: from.freq, comp: from.comp,
      hf: from.hf, ncell: from.ncell, prob: from.prob, sw: from.sw,
    };
    var ph = carry.ph || 0;                   /* 主节律相位（弧度） */
    var ph2 = carry.ph2 || 0;                 /* 第二成分相位 */
    var pt = carry.pt || 0;                   /* 信号时间（秒），噪声/瞬变用 */
    var t0 = 0, last = 0, alive = true, w = 0, h = 0;

    var KEYS = ['amp', 'freq', 'comp', 'hf', 'ncell', 'prob', 'sw'];

    /* 换模式：记下起点，接下来 1 秒线性插到新参数 */
    function setMode(mode) {
      var m = MODES[mode];
      if (!m) return;
      from = {
        amp: cur.amp, freq: cur.freq, comp: cur.comp,
        hf: cur.hf, ncell: cur.ncell, prob: cur.prob, sw: cur.sw,
      };
      target = m;
      t0 = performance.now();
    }

    function frame(ts) {
      if (!alive) return;
      if (!last) { last = ts; t0 = ts; }

      /* 帧率上限 ≈30fps：省 CPU，投影仪上也不掉帧 */
      if (ts - last < 33) return;
      var dt = Math.min(.12, (ts - last) / 1000);
      last = ts;

      /* ---- 尺寸 / DPR ---- */
      var cw = canvas.clientWidth, chh = canvas.clientHeight;
      if (!cw || !chh) return;                /* 还没布局好，下一帧再说 */
      var dpr = window.devicePixelRatio || 1;
      var pw = Math.round(cw * dpr), phx = Math.round(chh * dpr);
      if (canvas.width !== pw || canvas.height !== phx) {
        canvas.width = pw; canvas.height = phx;
        g.setTransform(dpr, 0, 0, dpr, 0, 0); /* 之后一律用 CSS 像素坐标画 */
      }
      w = cw; h = chh;

      /* ---- 1 秒线性过渡到目标形态 ---- */
      var k = Math.min(1, (ts - t0) / 1000);
      for (var q = 0; q < KEYS.length; q++) {
        var kk = KEYS[q];
        cur[kk] = from[kk] + (target[kk] - from[kk]) * k;
      }

      /* ---- 推进相位：新样本从右边进来 ---- */
      ph = (ph + TAU * cur.freq * dt) % TAU;
      ph2 = (ph2 + TAU * cur.comp * dt) % TAU;
      pt += dt;

      /* ---- 背景 + 1/8 等分网格 ---- */
      g.fillStyle = '#0A0A0A';
      g.fillRect(0, 0, w, h);
      g.strokeStyle = 'rgba(255,255,255,.05)';
      g.lineWidth = 1;
      g.beginPath();
      var i, gx, gy;
      for (i = 1; i < 8; i++) { gx = w * i / 8; g.moveTo(gx, 0); g.lineTo(gx, h); }
      for (i = 1; i < 8; i++) { gy = h * i / 8; g.moveTo(0, gy); g.lineTo(w, gy); }
      g.stroke();

      /* ---- 波形：逐列算采样值，往左滚 ---- */
      var scroll = w / 3;                     /* 屏上正好铺 3 秒信号 */
      var cy = h / 2, half = h / 2;
      g.beginPath();
      for (var x = 0; x <= w; x++) {
        var age = (w - x) / scroll;           /* 这一列是「多久以前」的信号 */
        var t = pt - age;
        var v = Math.sin(ph - TAU * cur.freq * age) * .78
              + Math.sin(ph2 - TAU * cur.comp * age) * .22
              + vnoise(t, cur.ncell) * cur.hf * 1.6
              + spikeAt(t, cur.prob, cur.sw);
        if (v > 1) v = 1; else if (v < -1) v = -1;
        var y = cy - v * cur.amp * half * .98;
        if (x) g.lineTo(x, y); else g.moveTo(x, y);
      }

      /* ---- 三遍描边做辉光：宽→窄、淡→实 ---- */
      g.lineJoin = 'round';
      g.lineCap = 'round';
      g.strokeStyle = color;
      g.globalAlpha = .10; g.lineWidth = 7;   g.stroke();
      g.globalAlpha = .22; g.lineWidth = 3.5; g.stroke();
      g.globalAlpha = 1;   g.lineWidth = 2;   g.stroke();

      /* ---- 相位与参数留给下一个状态 ---- */
      carry.ph = ph; carry.ph2 = ph2; carry.pt = pt; carry.p = cur;
    }

    if (ctx) ctx.raf(frame);

    return {
      setMode: setMode,
      dispose: function () { alive = false; },
    };
  }

  /* ---------------- 场景样式 ---------------- */

  PERCEPTION.css('scene-eeg', `
.eeg-wave{display:block;background:#0A0A0A;border-radius:var(--radius-lg);}
#eegWave{width:70vw;height:25vw;}
#eegBox{position:relative;}
#eegTag{position:absolute;top:var(--space-sm);right:var(--space-md);}
#eegCapt{margin-top:var(--space-md);}

#eegSplit{display:flex;align-items:flex-end;justify-content:space-between;width:100%;}
.eeg-col{width:45%;}
.eeg-col .eeg-wave{width:100%;height:16vw;}
.eeg-col .subtitle{margin-bottom:var(--space-sm);}

#sciLines{width:100%;}

/* 留言气泡：这些是「别人说的话」，所以做成对话框的样子。
   字号用 --fs-subtitle 而不是 body：这一屏只有四句话，没有别的信息，
   要让最后一排的人也看清 —— 而且这几句话本身就是「要被攻破的靶子」，
   大一点才有被点名的感觉。 */
.bubble{
  position:relative;
  background:#262626;color:var(--text-inverse);
  border:1px solid #3A3A3A;border-radius:20px 20px 20px 6px;
  padding:var(--space-sm) var(--space-md);
  font-size:var(--fs-subtitle);font-weight:var(--fw-medium);line-height:1.45;
}
.bubble::before{
  content:'';position:absolute;left:-7px;bottom:0;
  width:14px;height:14px;background:#262626;
  border-left:1px solid #3A3A3A;border-bottom:1px solid #3A3A3A;
  border-radius:0 0 0 14px;transform:skewX(-18deg);
}
.bubble:nth-of-type(even){margin-left:8vw;}
.bubble:nth-of-type(odd){margin-left:2vw;}
#sciClose{margin-top:var(--space-lg);color:var(--accent-blue);}
`);

  PERCEPTION.scene({
    id: 'eeg',
    label: '如何研究脑 · 客观测量',
    dark: true,
    states: [

      /* ---- 8.0 先问他们：你会怎么测？----
         先把问题打在屏幕上，再拿出仪器。顺序反了就变成「展示设备」，
         正过来才是「你想不到，所以我们才需要它」。 */
      function (ctx) {
        ctx.set(`
          <div class="stack gap-lg" style="max-width:74vw">
            <h1 class="title center anim" style="--d:0s;color:var(--text-inverse)">
              到这里，我们已经说了很多遍「在大脑里」。
            </h1>

            <h1 class="hero center anim" style="--d:1s;color:var(--accent-blue)">
              可你怎么知道？
            </h1>

            <p class="step body center" style="color:var(--text-inverse);max-width:62vw">
              如果让你来证明这件事 —— 你会怎么<b>测量</b>一个人的大脑在做什么？
            </p>
          </div>
        `);
        ctx.steps();
      },

      /* ---- 8.1 波形展示：基线信号 ---- */
      function (ctx) {
        ctx.set(`
          <div id="eegBox" class="anim" style="--d:0s">
            <canvas id="eegWave" class="eeg-wave"></canvas>
          </div>

          <div id="eegCapt" class="body center anim fade" style="--d:.6s;color:var(--text-inverse)">
            这是大脑在活动时发出的电信号。
          </div>
        `);

        var wv = makeWave(ctx.q('#eegWave'), { ctx: ctx, mode: 'noisy', carry: CARRY });
        return function () { wv.dispose(); };
      },

      /* ---- 8.2 放松：切到 α ---- */
      function (ctx) {
        ctx.set(`
          <div id="eegBox" class="anim" style="--d:0s">
            <canvas id="eegWave" class="eeg-wave"></canvas>
            <div id="eegTag" class="body c-green anim fade" style="--d:.2s">α 波：放松状态</div>
          </div>

          <div id="eegCapt" class="subtitle center anim fade" style="--d:.5s;color:var(--text-inverse)">
            请志愿者闭眼，放松，关注呼吸。
          </div>
        `);

        var wv = makeWave(ctx.q('#eegWave'), { ctx: ctx, mode: 'alpha', carry: CARRY });
        return function () { wv.dispose(); };
      },

      /* ---- 8.3 心算：切到 β ---- */
      function (ctx) {
        ctx.set(`
          <div id="eegBox" class="anim" style="--d:0s">
            <canvas id="eegWave" class="eeg-wave"></canvas>
            <div id="eegTag" class="body c-orange anim fade" style="--d:.2s">β 波：活跃思考</div>
          </div>

          <div id="eegCapt" class="subtitle center anim fade" style="--d:.5s;color:var(--text-inverse)">
            请睁眼，心算 37 × 48。
          </div>
        `);

        var wv = makeWave(ctx.q('#eegWave'), { ctx: ctx, mode: 'beta', carry: CARRY });
        return function () { wv.dispose(); };
      },

      /* ---- 8.4 对比：两条波形同时跑 ---- */
      function (ctx) {
        ctx.set(`
          <div id="eegSplit" class="anim" style="--d:0s">
            <div class="eeg-col">
              <div class="subtitle c-green center">放松</div>
              <canvas id="wvA" class="eeg-wave"></canvas>
            </div>
            <div class="eeg-col">
              <div class="subtitle c-orange center">心算</div>
              <canvas id="wvB" class="eeg-wave"></canvas>
            </div>
          </div>

          <div id="eegCapt" class="subtitle center anim fade" style="--d:.4s;color:var(--text-inverse)">
            同一个大脑，不同状态，波形完全不同。
          </div>
        `);

        /* 两条各自独立（不共用 carry，否则会互相改参数） */
        var a = makeWave(ctx.q('#wvA'), { ctx: ctx, mode: 'alpha' });
        var b = makeWave(ctx.q('#wvB'), { ctx: ctx, mode: 'beta' });
        return function () { a.dispose(); b.dispose(); };
      },

      /* ---- 8.5 四句流传很广的话（气泡的形式）----
         用对话框而不是 ①②③④ 的清单：这些是「别人说的话」，
         一条一条冒出来，更像现场听到，也让讲者一条一条去破。
         上面原来有一句「下面这几句话，你可能都听过。」，删掉了 ——
         四句话自己就说明了自己是什么，加一句反而把力气泄了；
         第一句改成直接出现，进场就是完整一屏。 */
      function (ctx) {
        ctx.set(`
          <div class="stack gap-md" style="width:100%;align-items:flex-start;max-width:74vw;margin:0 auto">
            <div class="bubble anim fade" style="--d:0s">人类只用了大脑的 10%。</div>
            <div class="bubble step">你是「左脑型」还是「右脑型」？</div>
            <div class="bubble step">心理学？不就是算命那一类吗。</div>
            <div class="bubble step">你学心理的？那你猜猜我现在在想什么。</div>

            <div class="step subtitle" style="color:var(--accent-orange);align-self:center;margin-top:var(--space-md)">
              这四句，一句一句来回答。
            </div>
          </div>
        `);
        ctx.steps();
      },

      /* ---- 8.6 一句一句回答：每条都给具体、可查的东西 ---- */
      function (ctx) {
        ctx.set(`
          <div class="stack gap-md" style="max-width:80vw">
            <div class="card tight" style="background:#242424;text-align:left">
              <div class="body" style="color:var(--text-inverse)">
                <b class="c-orange">「只用了 10%」</b>
                —— 如果真有九成闲着，那切掉它应该没事。可临床上恰恰相反：
                任何一块脑区受损，几乎都会带来对应的功能丧失。脑成像也显示，
                <b>哪怕只是躺着发呆，全脑都在持续耗能</b>。
              </div>
            </div>

            <div class="step card tight" style="background:#242424;text-align:left">
              <div class="body" style="color:var(--text-inverse)">
                <b class="c-orange">「左脑理性、右脑感性」</b>
                —— 两侧之间有<b>胼胝体</b>，几亿根神经纤维来回通信，
                任何一件稍复杂的事两边都同时参与。这个说法来自上世纪六十年代
                对<b>切断胼胝体的病人</b>的研究，被简化成了完全走样的版本。
              </div>
            </div>

            <div class="step card tight" style="background:#242424;text-align:left">
              <div class="body" style="color:var(--text-inverse)">
                <b class="c-orange">「心理学就是算命」</b>
                —— 占卜的结论没法被证伪，这是它和科学的分界线。
                举一个具体的：<b>MBTI</b> 那类人格测试，同一个人隔五周重测，
                <b>约有一半的人会换掉至少一个字母</b>。
                一个会变的「类型」，测的就不是稳定的性格。
              </div>
            </div>

            <div class="step card tight" style="background:#242424;text-align:left">
              <div class="body" style="color:var(--text-inverse)">
                <b class="c-orange">「那你说说我在想什么」</b>
                —— 靠表情和身体语言判断说谎，206 项研究、两万四千人的汇总结果
                是 <b>54%</b>，比抛硬币只好一点点；而且<b>受过训练的警察和法官，
                并不比普通人更准</b>。
              </div>
            </div>

            <div class="step subtitle center" style="color:var(--accent-blue);margin-top:var(--space-sm)">
              每一条错的，都不是「想错了」，而是「没测过」。
            </div>
          </div>
        `);
        ctx.steps();
      },

      /* ---- 8.7 落到测量上，并回应那句「学心理的是不是都有病」 ---- */
      function (ctx) {
        ctx.set(`
          <div class="stack gap-lg" style="max-width:72vw">
            <div class="title bold center anim fade" style="--d:0s;color:var(--accent-blue)">
              科学不是猜，是测量。
            </div>

            <div class="step body center" style="color:var(--text-inverse)">
              顺带说一句：心理学的对象是<b>人自己</b>，所以每个人都觉得
              自己有资格评论它 —— <b>物理学就没有这个待遇</b>。
            </div>

            <div class="step body center" style="color:var(--text-inverse)">
              这不是它不科学的原因，恰恰是它难的地方。
            </div>
          </div>
        `);
        ctx.steps();
      },

      /* ---- 8.8 爱因斯坦的大脑：一个样本能证明什么 ----
         材料取自作者杭二中的讲稿：「把脑子拿出来看」那一段。
         这个故事的价值在于 —— 它用一次真实的研究事故说明
         「先射箭再画靶」是什么样子，比讲十条原则都管用。 */
      function (ctx) {
        ctx.set(`
          <div class="stack gap-md" style="max-width:76vw">
            <div class="body center anim fade" style="--d:0s;color:var(--text-inverse)">
              那我们把大脑拿出来看，能看到什么？
            </div>

            <div class="step body center" style="color:var(--text-inverse)">
              1955 年，爱因斯坦在普林斯顿去世。做尸检的医生<b>没有把大脑放回去</b>，
              而是把它切成了两百多块，泡在福尔马林里，私藏了四十多年。
              这件事当时引起了巨大争议。
            </div>

            <div class="step body center" style="color:var(--text-inverse)">
              1985 年，有人把这些切片和 11 个普通人的大脑做了对比，
              报告说：爱因斯坦<b>左侧顶叶</b>的神经胶质细胞比例更高，
              并推论这可能与他的思考能力有关。
            </div>

            <div class="step card tight" style="background:#242424;text-align:left;max-width:70vw">
              <div class="body" style="color:var(--text-inverse)">
                可这个结论经不起推敲：那 11 位对照者平均只活了 64 岁，
                而爱因斯坦去世时 76 岁 —— <b>胶质细胞是会随年龄继续分裂的</b>，
                比例偏高，也可能只是因为神经元老死得更多。
                戴蒙德本人后来也承认这项研究有局限。
              </div>
            </div>

            <div class="step subtitle center" style="color:var(--accent-orange)">
              先射箭，再画靶 —— 只有一个样本，又在事后反复找，找到什么都不奇怪。
            </div>
          </div>
        `);
        ctx.steps();
      },

      /* ---- 8.9 人脑库：所以要很多很多个 ---- */
      function (ctx) {
        ctx.set(`
          <div class="stack gap-md" style="max-width:74vw">
            <div class="body center anim fade" style="--d:0s;color:var(--text-inverse)">
              所以，研究大脑要用的脑子，从哪里来？
            </div>

            <div class="step body center" style="color:var(--text-inverse)">
              小鼠的大脑 <b>0.4 克</b>、七千万个神经元；人脑 <b>1500 克</b>、<b>860 亿</b>个。
              用小鼠研究抑郁症，就像<b class="c-orange">用鱼缸模拟太平洋</b>。
            </div>

            <div class="step body center" style="color:var(--text-inverse)">
              2012 年，浙江大学医学院建立了中国第一座<b>人脑库</b>。
              志愿者生前签署同意，去世后 24 小时内完成取材保存。
              到今天，它已经收到<b>七百多例</b>全脑捐赠，
              为全国八十多个课题组提供了近万份样本。
            </div>

            <div class="step body center" style="color:var(--text-inverse)">
              每一位捐赠者的名字，都刻在浙大医学院门口的
              <b class="c-blue">「无语良师碑」</b>上。
            </div>

            <div class="step body center" style="color:var(--accent-orange);margin-top:var(--space-sm)">
              他们不言不语，却教给了我们关于大脑最要紧的知识。
            </div>

            <!-- 顺着「人脑库」说到器官捐献，再落回 Laureys ——
                 顺便解释为什么判定标准是脑死亡而不是心跳停止。 -->
            <div class="step body center" style="color:var(--text-inverse)">
              说到捐赠，有一个标准值得知道：今天判定一个人是否死亡，
              看的是<b class="c-blue">大脑是否停止工作</b>，而不是心跳 ——
              因为心跳可以靠机器维持，而意识不能。
            </div>

            <div class="step quote">
              “If there is a life after death, it is organ donation.”
              <span class="attr">Steven Laureys</span>
            </div>
          </div>
        `);
        ctx.steps();
      },

      /* ---- 8.10 过渡：把问题抛给下一场 ---- */
      function (ctx) {
        ctx.set(`
          <h2 class="title bold center anim fade" style="--d:.4s;color:var(--text-inverse);max-width:70vw">
            我们能读到大脑在做什么了。<br>那么 —— 能不能<b class="c-orange">改变</b>它？
          </h2>
        `);
      },

    ],
  });

})();
