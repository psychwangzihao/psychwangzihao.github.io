/* ============================================================
   场景 5：想象的谱  (id: ispectrum · 6 个状态)

   **全场唯一必须用浏览器的地方**：现场报数 → 分布当场长出来。

   ⚠️ 现场没有鼠标：1–5 记数 · 0 撤回 · R 清零。不放 ± 按钮。

   5.3 的核心那一句用「知道，但看不见」—— 用户提的 "Know but cannot feel"。
   它比原来那句「这不是想象力弱，是另一种拥有心灵的方式」好在：
   它不说教、不下判断、而且它是**从当事人内部**说出来的描述。
   ============================================================ */
PERCEPTION.css('scene-ispectrum', `
#ispBoard{
  display:flex;align-items:flex-end;justify-content:center;
  gap:2.4vw;width:100%;margin-top:var(--space-md);
}
.isp-col{display:flex;flex-direction:column;align-items:center;gap:.7vw;width:11.5vw;}
.isp-num{
  font-family:var(--font-mono);font-size:var(--fs-subtitle);
  font-weight:var(--fw-bold);line-height:1;
  transition:color var(--dur-fast) var(--ease-out);
}
.isp-bar-wrap{
  width:100%;height:28vh;display:flex;align-items:flex-end;
  border-bottom:1px solid var(--rule);
}
.isp-bar{
  width:100%;background:var(--mx-blue);
  transition:height var(--dur-slow) var(--ease-out);min-height:2px;
}
.isp-col.zero .isp-bar{background:var(--mx-yellow);}
.isp-col.last .isp-num{color:var(--mx-yellow);}
.isp-label{
  font-size:var(--fs-tiny);color:var(--text-tertiary);
  text-align:center;line-height:1.35;height:3.2em;
}
.isp-keys{
  font-family:var(--font-mono);font-size:var(--fs-tiny);
  letter-spacing:.18em;color:var(--text-tertiary);opacity:.55;text-align:center;
}
`);

var ISP_LABELS = ['什么都没有', '很模糊', '有一些', '比较清楚', '像照片一样'];
var ISP = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

PERCEPTION.scene({
  id: 'ispectrum',
  label: '想象的谱',
  dark: true,
  states: [

    /* ---- 5.0 先把输入拿掉 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">05 / 想象的谱</div>
          <h2 class="doc-lead anim" style="--d:.15s">闭上眼睛。<br>想象一个苹果。</h2>
          <p class="step doc-body">花瓣是绿色的，叶子是红色的。</p>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 5.1 报数 ---- */
    function (ctx) {
      var cols = [1, 2, 3, 4, 5].map(function (n) {
        return `
          <div class="isp-col${n === 1 ? ' zero' : ''}" data-n="${n}">
            <div class="isp-num" data-count="${n}">0</div>
            <div class="isp-bar-wrap"><div class="isp-bar" data-bar="${n}" style="height:0"></div></div>
            <div class="isp-label">${n} &nbsp;${ISP_LABELS[n - 1]}</div>
          </div>`;
      }).join('');

      ctx.set(`
        <div class="stack gap-sm mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">05 / 想象的谱</div>
          <h2 class="doc-lead anim" style="--d:.1s;font-size:var(--fs-subtitle)">
            睁开眼睛。刚才那个画面，有多清楚？
          </h2>
          <div id="ispBoard">${cols}</div>
          <p class="isp-keys anim fade" style="--d:.9s">1–5 记数 · 0 撤回 · R 清零</p>
        </div>
      `);

      var board = ctx.q('#ispBoard');
      var last = 0;

      function redraw() {
        var max = Math.max(1, ISP[1], ISP[2], ISP[3], ISP[4], ISP[5]);
        [1, 2, 3, 4, 5].forEach(function (n) {
          board.querySelector('[data-count="' + n + '"]').textContent = ISP[n];
          board.querySelector('[data-bar="' + n + '"]').style.height = (ISP[n] / max * 100) + '%';
          board.querySelector('[data-n="' + n + '"]').classList.toggle('last', n === last);
        });
      }

      PERCEPTION.keyHook = function (k) {
        if (k >= '1' && k <= '5') { ISP[+k]++; last = +k; redraw(); return true; }
        if (k === '0' || k === 'Backspace') {
          if (last) { ISP[last] = Math.max(0, ISP[last] - 1); redraw(); }
          return true;
        }
        if (k === 'r' || k === 'R') {
          ISP = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }; last = 0; redraw(); return true;
        }
        return false;
      };

      redraw();
      return function () { PERCEPTION.keyHook = null; };
    },

    /* ---- 5.2 结果 ---- */
    function (ctx) {
      var zero = ISP[1];
      var total = ISP[1] + ISP[2] + ISP[3] + ISP[4] + ISP[5];

      var line = (total >= 5 && zero > 0)
        ? '这个房间里有 <b style="color:var(--mx-yellow)">' + zero + '</b> 个人，刚才什么也没有看见。'
        : '这条谱上，有人落在最左边。';

      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">05 / 想象的谱</div>
          <h2 class="doc-lead anim" style="--d:.1s">${line}</h2>
          <p class="step doc-body">他们知道苹果长什么样，一眼认得出，也画得出来。</p>
          <p class="step doc-body hi">心盲症（aphantasia）。大约 2–4%。</p>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 5.3 我属于那里 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">05 / 想象的谱</div>
          <h2 class="doc-lead anim" style="--d:.15s">我属于那里。</h2>
          <p class="step doc-body">我知道苹果长什么样。我一眼认得出，也画得出来。</p>
          <p class="step doc-lead" style="color:var(--mx-yellow);font-size:var(--fs-subtitle)">
            知道，但看不见。
          </p>
          <p class="step doc-body">做梦的时候，能看到画面。</p>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 5.4 另一端 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">05 / 想象的谱</div>
          <h2 class="doc-lead anim" style="--d:.1s">超幻症</h2>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 5.5 四个模态分开 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">05 / 想象的谱</div>
          <div class="doc-terms" style="width:56vw;gap:1.3vw">
            <div class="anim" style="--d:.12s">没有画面 · 有内语</div>
            <div class="anim" style="--d:.26s">有画面 · 没有内语</div>
          </div>
        </div>
      `);
      ctx.steps();
    },

  ],
});
