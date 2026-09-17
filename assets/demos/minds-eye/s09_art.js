/* ============================================================
   场景 9：回到艺术  (id: art · 3 个状态)

   规矩同 s01：只有词条，加上两句话。

   全场只有两处"句子"必须留在屏幕上，因为它们是**要问出去的问题**、
   不是解释：
     9.1「一件作品里，有多少是图里没有的？」
     9.2「一件需要想象才成立的作品，遇上不会产生画面的观众，还剩下什么？」
   其余全压成词条。
   ============================================================ */
PERCEPTION.css('scene-art', `
#artCanvas{height:42vh;width:auto;}
@media (max-width:860px){ #artCanvas{height:auto;width:78vw;} }
`);

PERCEPTION.scene({
  id: 'art',
  label: '回到艺术',
  dark: true,
  states: [

    /* ---- 9.0 感官不止视听 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">09 / 回到艺术</div>
          <div class="doc-terms art" style="width:52vw">
            <div class="anim" style="--d:.12s">嗅觉</div>
            <div class="anim" style="--d:.24s">味觉</div>
            <div class="anim" style="--d:.36s">触觉</div>
            <div class="anim" style="--d:.48s">身体</div>
          </div>
        </div>
      `);
    },

    /* ---- 9.1 那条边（回到第三幕那张图） ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-md mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">09 / 回到艺术</div>
          <canvas id="artCanvas" class="mx-pix anim fade" style="--d:.1s"
                  width="820" height="700"></canvas>
          <p class="step doc-lead" style="font-size:var(--fs-subtitle)">
            一件作品里，有多少是图里没有的？
          </p>
        </div>
      `);
      MX.paint(ctx.q('#artCanvas'), MX.kanizsa(820, 700, true), 820);
      ctx.steps();
    },

    /* ---- 9.2 三件讲过的事 + 一个问题 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">09 / 回到艺术</div>
          <div class="doc-terms art" style="width:52vw;gap:1.2vw">
            <div class="anim" style="--d:.12s">感官可以被替换</div>
            <div class="anim" style="--d:.22s">感官可以被训练</div>
            <div class="anim" style="--d:.32s">感官的参数，人和人不同</div>
          </div>
          <div class="mx-rule anim fade" style="--d:.5s;width:12vw"></div>
          <h2 class="step doc-lead" style="color:var(--mx-yellow);font-size:var(--fs-subtitle)">
            一件需要想象才成立的作品，<br>遇上不会产生画面的观众，还剩下什么？
          </h2>
        </div>
      `);
      ctx.steps();
    },

  ],
});
