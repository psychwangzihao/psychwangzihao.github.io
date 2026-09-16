/* ============================================================
   场景 4：作品在哪  (id: artwork · 3 个状态)

   **这一幕是整场分享存在的理由。**

   它就是「和国美一起做事」这句话的论据：先用他们已经亲眼看到的东西
   （那条不存在的边），推到一个关于作品本身的说法上 ——
   **作品不携带体验，作品只提供条件。** 然后把这个说法推到底，
   交给全场一个我回答不了的问题。

   注意分寸：不是「心理学来告诉你们什么是艺术」，
   而是"我从你们做的东西里看到一件我说不清的事，你们可能说得清"。
   结尾必须是一个问题，不能是一个结论。
   ============================================================ */
PERCEPTION.css('scene-artwork', `
#awCanvas{height:44vh;width:auto;}   /* 同上：按高度定，避免宽屏溢出 */
@media (max-width:860px){ #awCanvas{height:auto;width:78vw;} }
.aw-big{
  font-size:var(--fs-title);font-weight:var(--fw-bold);
  line-height:1.5;text-align:center;max-width:74vw;
}
.aw-line{
  font-size:var(--fs-subtitle);line-height:1.7;
  text-align:center;max-width:62vw;color:var(--text-secondary);
}
.aw-line.hi{color:var(--text-primary);font-weight:var(--fw-medium);}
.aw-q{
  font-size:calc(var(--fs-title) * 1.05);font-weight:var(--fw-bold);
  line-height:1.55;text-align:center;max-width:74vw;color:var(--mx-yellow);
}
`);

PERCEPTION.scene({
  id: 'artwork',
  label: '作品在哪',
  dark: true,
  states: [

    /* ---- 4.0 把那条边标出来 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-md mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">04 / 作品</div>
          <canvas id="awCanvas" class="mx-pix anim fade" style="--d:.1s"
                  width="820" height="700"></canvas>
          <p class="aw-line hi anim" style="--d:.35s">
            黄色虚线那道边，不在图上。<br>
            它在你这儿。
          </p>
        </div>
      `);
      var cv = ctx.q('#awCanvas');
      MX.paint(cv, MX.kanizsa(820, 700, true), 820);
    },

    /* ---- 4.1 那么，一件作品里有多少是作品里的 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">04 / 作品</div>
          <h2 class="aw-big anim" style="--d:.1s">
            那么，一件作品里，<br>有多少是作品里的？
          </h2>
          <p class="step aw-line hi">你控制的是条件。</p>
          <p class="step aw-line hi">
            条件落在不同的机器上，长出不同的东西。
          </p>
          <p class="step aw-line">
            而在座每一位身后的观众里，会有一部分人 —— 那台机器不产出画面。
          </p>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 4.2 把问题交出去 ----
       收在一个问题上，不收回一个结论。这是这场分享对国美的姿态：
       我带来的是我看不清的地方，不是我要教的东西。 */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-xl mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">04 / 作品</div>
          <p class="aw-line anim" style="--d:.1s">
            所以我有一个我回答不了的问题。
          </p>
          <div class="mx-rule anim fade" style="--d:.35s;width:12vw"></div>
          <h2 class="aw-q step">
            如果一件作品，对一部分人根本不存在，<br>它还成立吗？成立在谁那里？
          </h2>
        </div>
      `);
      ctx.steps();
    },

  ],
});
