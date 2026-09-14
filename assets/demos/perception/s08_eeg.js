/* ============================================================
 * 场景 8：脑电波演示  (id: eeg · 6 个状态 · 暗色)
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
#sciClose{margin-top:var(--space-lg);color:var(--accent-blue);}
`);

  PERCEPTION.scene({
    id: 'eeg',
    label: '脑电波',
    dark: true,
    states: [

      /* ---- 8.0 波形展示：基线信号 ---- */
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

      /* ---- 8.1 放松：切到 α ---- */
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

      /* ---- 8.2 心算：切到 β ---- */
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

      /* ---- 8.3 对比：两条波形同时跑 ---- */
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

      /* ---- 8.4 科学方法：四行，再收一句 ---- */
      function (ctx) {
        ctx.set(`
          <!-- 先把开场那个闪烁网格接回来：你自己看到的黑点，旁边的人可能
               一个都没看到 —— 所以「我看到」不能当证据。这一句是整场的枢纽。 -->
          <div class="body center anim fade" style="--d:0s;color:var(--accent-orange);max-width:62vw;margin-bottom:var(--space-md)">
            开场那个闪烁的网格 —— 你看到的黑点，你同桌可能一个都没看到。
          </div>

          <div id="sciLines" class="stack" style="gap:var(--space-sm)">
            <div class="subtitle center anim fade" style="--d:.35s;color:var(--text-inverse)">脑电不是读心术。</div>
            <div class="subtitle center anim fade" style="--d:.6s;color:var(--text-inverse)">它有伪迹：眨眼、肌肉活动、电源干扰。</div>
            <div class="subtitle center anim fade" style="--d:.9s;color:var(--text-inverse)">要基线、要控制、要重复、要统计。</div>
            <div class="subtitle center anim fade" style="--d:1.2s;color:var(--text-inverse)">一个人不算，要很多人、很多试次。</div>
          </div>

          <div id="sciClose" class="title bold center anim fade" style="--d:2.7s">
            科学不是猜，是测量。
          </div>
        `);
      },

      /* ---- 8.5 过渡：把问题抛给下一场 ---- */
      function (ctx) {
        ctx.set(`
          <h2 class="title bold center anim fade" style="--d:.4s;color:var(--text-inverse);max-width:70vw">
            能测量，能不能解码？能解码，能不能写入？
          </h2>
        `);
      },

    ],
  });

})();
