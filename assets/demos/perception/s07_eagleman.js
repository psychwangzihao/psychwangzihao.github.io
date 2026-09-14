/* ============================================================
 * 场景 7：Eagleman 背心  (id: eagleman · 7 个状态)
 * 目的：展示通道可替换 —— 大脑只关心信息结构，不关心信号从哪来。
 * 装置：David Eagleman 的 32 马达感官替代背心（VEST）。
 *
 * 美术只有一份源码：vestSVG()，所有状态共用，改这里就全改。
 * ============================================================ */

/* ---------------- 共用美术：32 马达背心 ----------------
 * 返回一段内联 SVG 字符串。
 *   viewBox 200×240；轮廓 = 肩带 + 浅 V 领 + 两片前襟 + 下摆。
 *   32 个马达按行优先编号：index = row*4 + col
 *     id       motor-0 … motor-31
 *     data-row 0 = 肩膀（最上排） … 7 = 腰（最下排）
 *   下排的整体宽度略窄（s 逐行收缩），让网格跟着背心收腰。
 * 参数 opt.w：宽度（vw 数值），高度按 viewBox 比例 1.2 倍自动给。
 * ------------------------------------------------------------ */
var VEST_ROWS = 8, VEST_COLS = 4;
function vestSVG(opt) {
  opt = opt || {};
  var w = opt.w || 30, h = +(w * 1.2).toFixed(2);

  var circles = '';
  for (var r = 0; r < VEST_ROWS; r++) {
    var y = 90 + r * (204 - 90) / (VEST_ROWS - 1);
    var s = 1 - r * 0.036;                       /* 越往下越窄 */
    for (var c = 0; c < VEST_COLS; c++) {
      var x = 100 + (c - 1.5) * 21 * s;          /* 4 列等距，绕中线对称 */
      var i = r * VEST_COLS + c;
      circles += '<circle class="motor" id="motor-' + i + '" data-row="' + r + '"' +
                 ' cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3"' +
                 ' style="animation-delay:-' + (Math.random() * 1).toFixed(2) + 's"></circle>';
    }
  }

  return (
    '<svg class="vest" viewBox="0 0 200 240" aria-hidden="true"' +
    ' style="width:' + w + 'vw;height:' + h + 'vw">' +
      /* 两片前襟（很浅的底色）—— 复用轮廓的左/右/下摆边 */
      '<path class="panel" d="M70 36 C80 58 92 78 100 82 L100 220 L44 220 Q32 220 32 210' +
        ' C32 200 36 180 36 140 C36 100 32 70 30 34 Z"></path>' +
      '<path class="panel" d="M130 36 C120 58 108 78 100 82 L100 220 L156 220 Q168 220 168 210' +
        ' C168 200 164 180 164 140 C164 100 168 70 170 34 Z"></path>' +
      /* 背心轮廓：肩带 → 浅 V 领 → 两侧收腰 → 下摆 */
      '<path class="outline" d="M50 22 C64 31 80 35 100 35 C120 35 136 31 150 22 L170 34' +
        ' C168 70 164 100 164 140 C164 180 168 200 168 210 Q168 220 156 220 L44 220' +
        ' Q32 220 32 210 C32 200 36 180 36 140 C36 100 32 70 30 34 Z"></path>' +
      /* 敞开的前襟：V 领 + 中缝 */
      '<path class="seam" d="M70 36 C80 58 92 78 100 82 C108 78 120 58 130 36"></path>' +
      '<path class="seam" d="M100 82 L100 220"></path>' +
      circles +
    '</svg>'
  );
}

/* ---------------- 波形与「音高」共用同一套参数 ----------------
 * pitchAt(t) 是全场唯一的「音高」来源：波形用它决定疏密，
 * 马达用它决定点亮哪一行。两者因此天然同步。
 * ------------------------------------------------------------ */
var TAU = Math.PI * 2;

/** 音高 0..1，约 10 秒一个来回 */
function pitchAt(t) { return 0.5 + 0.5 * Math.sin(t * 0.62); }

/** 缓慢起伏的包络，让波形有语音感（不是一条纯正弦） */
function envAt(u, t) {
  var a = 0.5 + 0.5 * Math.sin(t * 0.9 - u * 3.1);
  var b = 0.5 + 0.5 * Math.sin(t * 2.3 - u * 7.7 + 1.4);
  return 0.28 + 0.46 * a + 0.26 * b;
}

/** 采样点：基频 + 两个谐波，整体随 u、t 从右往左滚动（看起来从左往右流） */
function waveAt(u, t) {
  var f = 2.0 + pitchAt(t) * 4.2;               /* 音高越高，波越密 */
  var ph = (u * f - t * 1.15) * TAU;
  return (Math.sin(ph) * 0.60 + Math.sin(ph * 2.6) * 0.26 + Math.sin(ph * 5.1) * 0.14) * envAt(u, t);
}

/** 从 :root 的 token 取字面色值（canvas 用不了 var()，但不自己发明颜色） */
function tokenColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/* ============================================================ */

PERCEPTION.css('scene-eagleman', `
/* ---- 背心 SVG（源码见 vestSVG()） ---- */
.vest{display:block;}
.vest .outline{fill:none;stroke:var(--text-tertiary);stroke-width:2;stroke-linejoin:round;}
.vest .panel{fill:var(--bg-secondary);stroke:none;}
.vest .seam{fill:none;stroke:var(--border-subtle);stroke-width:1.5;stroke-linecap:round;}

/* 32 个马达各自呼吸：2s 一轮，相位靠行内 animation-delay 错开，不用 rAF 驱动 */
.motor{fill:var(--accent-blue);animation:motorBreathe 2s var(--ease-in-out) infinite;}
.motor.hot{fill:var(--accent-orange);}
@keyframes motorBreathe{0%,100%{opacity:.5;}50%{opacity:1;}}

/* ---- 7.2 工作原理：左波形 + 右背心 ---- */
#egTop{margin-bottom:var(--space-lg);}
#egWaveCol{flex:none;}
#egWave{width:26vw;height:10vw;min-width:200px;min-height:80px;display:block;}

/* ---- 7.3 学习曲线 ---- */
#egTl{position:relative;width:60vw;max-width:1000px;height:13vw;min-height:150px;margin-top:var(--space-md);}
#egTlLine{
  position:absolute;left:0;right:0;top:0;height:2px;background:var(--border-subtle);
  transform:scaleX(0);transform-origin:left center;
  transition:transform var(--dur-slower) var(--ease-out);
}
#egTlLine.on{transform:scaleX(1);}
.eg-node{position:absolute;top:0;width:24vw;max-width:420px;transform:translateX(-50%);text-align:center;}
.eg-dot{
  display:block;width:1vw;height:1vw;min-width:12px;min-height:12px;border-radius:50%;
  background:var(--accent-blue);box-shadow:0 0 0 4px var(--bg-card);
  margin:0 auto;transform:translateY(-50%) scale(0);
  transition:transform var(--dur-normal) var(--ease-spring);
}
.eg-node.on .eg-dot{transform:translateY(-50%) scale(1);}
.eg-node .eg-h{margin-top:1.2vw;opacity:0;transition:opacity var(--dur-slow) var(--ease-out);}
.eg-node .eg-d{margin-top:.3vw;opacity:0;transition:opacity var(--dur-slower) var(--ease-out);}
.eg-node.on .eg-h,.eg-node.on .eg-d{opacity:1;}

/* ---- 7.4 感官替代 vs 感官新增 ---- */
#egCards{gap:4vw;flex-wrap:wrap;}
#egCards .card{
  width:35vw;min-width:260px;text-align:center;
  transition:transform var(--dur-slow) var(--ease-out),opacity var(--dur-slow) var(--ease-out);
}
#egCards .from-l{transform:translateX(-3vw);opacity:0;}
#egCards .from-r{transform:translateX(3vw);opacity:0;}
#egCards.on .from-l,#egCards.on .from-r{transform:none;opacity:1;}
.eg-card .body{margin-top:var(--space-sm);}

@media (max-width:860px){
  #egTl{width:82vw;}
  .eg-node{width:30vw;}
  #egCards .card{width:82vw;}
}
`);

PERCEPTION.scene({
  id: 'eagleman',
  label: 'Eagleman 背心',
  dark: false,
  states: [

    /* ---- 7.0 先猜一猜 ---- */
    function (ctx) {
      ctx.set(QUIZ.html({
        q: '麦克风把声音变成背上一片一片的振动。<br>穿了三个月之后，会怎么样？',
        options: ['只觉得痒和麻', '能分辨出不同的词', '能「听懂」，不用想'],
        answer: 2,
        note: '这三种都发生过 —— 它们是同一个人身上，第 1 天、第 4 天、第 3 个月的样子。'
      }));
      QUIZ.mount(ctx, { answer: 2 });
    },

    /* ---- 7.1 背心展示 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-md">
          <div class="anim pop" style="--d:0s">${vestSVG({ w: 30 })}</div>
          <div class="subtitle center anim fade" style="--d:.4s">
            David Eagleman 发明了一件背心，用来「听」。
          </div>
        </div>
      `);
    },

    /* ---- 7.2 工作原理：声音 → 振动位置 ---- */
    function (ctx) {
      ctx.set(`
        <div class="row gap-xl" id="egTop">
          <div class="stack gap-xs" id="egWaveCol">
            <canvas id="egWave"></canvas>
            <div class="small faint">声音波形</div>
          </div>
          <div class="anim fade" style="--d:.1s">${vestSVG({ w: 22 })}</div>
        </div>

        <div class="stack gap-xs" id="egMap">
          <div class="body anim fade" style="--d:.2s">麦克风捕捉声音</div>
          <div class="body anim fade" style="--d:.4s">频率 → 振动位置</div>
          <div class="body anim fade" style="--d:.6s">高音在肩膀，低音在腰部</div>
        </div>
      `);

      var cv = ctx.q('#egWave'), g = cv.getContext('2d');
      var ORANGE = tokenColor('--accent-orange');
      var motors = ctx.qa('.motor');       /* 缓存一次，之后不再查询 */
      var hot = [];                        /* 上一帧点亮的马达 */
      var W = 0, H = 0, last = 0;
      var dpr = Math.min(2, window.devicePixelRatio || 1);

      /* 画布尺寸：等一帧拿到真实布局 */
      ctx.frame(function () {
        W = cv.clientWidth || 320;
        H = cv.clientHeight || 120;
        cv.width = Math.round(W * dpr);
        cv.height = Math.round(H * dpr);
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.raf(tick);
      });

      function tick(ts) {
        if (ts - last < 33) return;        /* 节流到 ~30fps */
        last = ts;
        var t = ts / 1000;
        drawWave(t);
        mapMotors(t);
      }

      /* 流动的语音波形 + 淡网格 */
      function drawWave(t) {
        if (!W) return;
        g.clearRect(0, 0, W, H);

        g.strokeStyle = 'rgba(0,0,0,.05)';
        g.lineWidth = 1;
        g.beginPath();
        for (var i = 1; i < 4; i++) { var gy = Math.round(H * i / 4) + .5; g.moveTo(0, gy); g.lineTo(W, gy); }
        for (var j = 1; j < 8; j++) { var gx = Math.round(W * j / 8) + .5; g.moveTo(gx, 0); g.lineTo(gx, H); }
        g.stroke();

        g.beginPath();
        var mid = H / 2, amp = H * 0.36;
        for (var px = 0; px <= W; px += 2) {
          var y = mid - waveAt(px / W, t) * amp;
          if (px === 0) g.moveTo(0, y); else g.lineTo(px, y);
        }
        g.strokeStyle = ORANGE;
        g.lineWidth = 2;
        g.lineJoin = 'round';
        g.lineCap = 'round';
        g.stroke();
      }

      /* 音高 → 行带：同一个 pitchAt(t)，所以波形的疏密和点亮的行永远一致 */
      function mapMotors(t) {
        var p = pitchAt(t);                              /* 0..1 */
        var row = Math.round((1 - p) * (VEST_ROWS - 1)); /* 音高最高 → 第 0 行（肩膀） */

        for (var k = 0; k < hot.length; k++) {
          hot[k].classList.remove('hot');
          hot[k].setAttribute('r', '3');
        }
        hot.length = 0;

        var n = 2 + Math.floor(Math.abs(Math.sin(t * 1.1)) * 3);           /* 2–4 个 */
        var start = Math.floor(Math.abs(Math.cos(t * 0.63)) * VEST_COLS) % VEST_COLS;
        for (var i = 0; i < n; i++) {
          var col = (start + i) % VEST_COLS;
          var el = motors[row * VEST_COLS + col];
          if (!el) continue;
          el.classList.add('hot');
          el.setAttribute('r', '4.4');
          hot.push(el);
        }
      }
    },

    /* ---- 7.3 学习曲线 ---- */
    function (ctx) {
      var node = function (left, day, desc) {
        return '<div class="eg-node" style="left:' + left + '%">' +
                 '<span class="eg-dot"></span>' +
                 '<div class="eg-h body bold c-blue">' + day + '</div>' +
                 '<div class="eg-d body muted">' + desc + '</div>' +
               '</div>';
      };

      ctx.set(`
        <div class="stack">
          <div id="egTl">
            <div id="egTlLine"></div>
            ${node(0, '第 1 天', '只觉得痒、麻')}
            ${node(50, '第 4 天', '开始分辨不同单词')}
            ${node(100, '第 3 个月', '直接「听懂」，不需要思考')}
          </div>

          <div class="subtitle center anim fade" style="--d:1.7s;margin-top:3vw">
            就像盲人摸盲文，不需要想「这个凸起代表什么字母」。
          </div>
        </div>
      `);

      /* 线先长出来，再一个个点亮节点 */
      ctx.soon(function () { ctx.q('#egTlLine').classList.add('on'); }, 60);
      ctx.each('.eg-node', function (el, i) {
        ctx.after(700 + i * 200, function () { el.classList.add('on'); });
      });
    },

    /* ---- 7.4 感官替代 vs 感官新增 ---- */
    function (ctx) {
      ctx.set(`
        <div class="row" id="egCards">
          <div class="card eg-card from-l" style="background:var(--accent-blue-light)">
            <div class="subtitle bold c-blue">感官替代</div>
            <div class="row gap-sm">
              ${ICON.ear('ico lg c-blue')}${ICON.hand('ico lg c-blue')}
            </div>
            <div class="body">用皮肤「听」</div>
          </div>

          <div class="card eg-card from-r" style="background:var(--accent-purple-light)">
            <div class="subtitle bold c-purple">感官新增</div>
            <div class="row gap-sm">
              ${ICON.chart('ico lg c-purple')}${ICON.hand('ico lg c-purple')}
            </div>
            <div class="body">用皮肤「感觉」股票市场、无人机姿态</div>
          </div>
        </div>
      `);

      ctx.soon(function () { ctx.q('#egCards').classList.add('on'); }, 60);
    },

    /* ---- 7.5 收束 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-md">
          <div class="title center bold anim fade" style="--d:0s">
            大脑不在乎信号从哪里来，只在乎有没有规律。
          </div>
          <div class="subtitle center c-blue anim fade" style="--d:.3s">
            感觉器官只是换能器。
          </div>
        </div>
      `);
    },

    /* ---- 7.6 过渡 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-md">
          <div class="title center bold anim fade" style="--d:0s">既然能换，能不能直接写？</div>
          <div class="title center bold anim fade" style="--d:.3s">但首先，我们怎么知道大脑在做什么？</div>
        </div>
      `);
    },

  ],
});
