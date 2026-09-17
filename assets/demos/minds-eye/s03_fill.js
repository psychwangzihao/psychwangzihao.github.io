/* ============================================================
   场景 3：缺的部分从哪来  (id: fill · 5 个状态)

   规矩同 s01。这一幕保留两处"句子"，因为它们是**现场动作**、不是解释：
     3.0「你看见了什么？」—— 问全场
     3.1「三角形的边，我没画。」—— 揭晓
   其余全压成词条。
   ============================================================ */
PERCEPTION.css('scene-fill', `
#fillCanvas{height:44vh;width:auto;}
@media (max-width:860px){ #fillCanvas{height:auto;width:80vw;} }
#fillRead{
  font-size:var(--fs-title);line-height:1.8;letter-spacing:.06em;text-align:center;
}
#fillRead b{
  color:var(--mx-yellow);border-bottom:.22vw solid var(--mx-yellow);padding:0 .1em;
}
`);

PERCEPTION._kz = null;

PERCEPTION.scene({
  id: 'fill',
  label: '脑补',
  dark: true,
  states: [

    /* ---- 3.0 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-sm mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">03 / 脑补</div>
          <canvas id="fillCanvas" class="mx-pix" width="820" height="700"></canvas>
          <div class="doc-lead anim" style="--d:.2s">你看见了什么？</div>
        </div>
      `);
      var cv = ctx.q('#fillCanvas');
      var src = MX.kanizsa(820, 700);
      MX.paint(cv, src, 26);
      PERCEPTION._kz = src;
    },

    /* ---- 3.1 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-sm mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">03 / 脑补</div>
          <canvas id="fillCanvas" class="mx-pix" width="820" height="700"></canvas>
          <div class="step doc-lead" style="color:var(--mx-yellow)">三角形的边，我没画。</div>
        </div>
      `);
      var cv = ctx.q('#fillCanvas');
      var src = PERCEPTION._kz || MX.kanizsa(820, 700);
      var cancel = MX.resolve(cv, src, 26, cv.width, 1100);
      ctx.steps();
      return function () { cancel(); };
    },

    /* ---- 3.2 阅读：现场读得到 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">03 / 脑补</div>
          <div id="fillRead" class="anim" style="--d:.15s">
            研<b>□</b>表明，汉<b>□</b>阅读者并不<b>□</b>要逐字辨<b>□</b>。
          </div>
          <p class="step doc-body">研究　语　需　认</p>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 3.3 通道之间 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">03 / 脑补</div>
          <div class="doc-terms" style="width:52vw">
            <div class="anim" style="--d:.12s">McGurk 效应</div>
            <div class="anim" style="--d:.24s">腹语效应</div>
            <div class="anim" style="--d:.36s">橡胶手错觉</div>
          </div>
        </div>
      `);
    },

    /* ---- 3.4 身体 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">03 / 脑补</div>
          <div class="doc-terms" style="width:52vw">
            <div class="anim" style="--d:.12s">本体感觉</div>
            <div class="anim" style="--d:.24s">前庭觉</div>
            <div class="anim" style="--d:.36s">内感受</div>
          </div>
        </div>
      `);
    },

  ],
});
