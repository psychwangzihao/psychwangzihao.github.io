/* ============================================================
   场景 0：开场  (id: open · 2 个状态)

   不用幕布。第一件事就是那个论点本身：
   2050 的字号本来就是用方块搭的，那就让它从**不够多的方块**开始，
   当着全场解析出来。观众会发现自己早就认出了它 —— 而屏幕上的方块
   在头几百毫秒里根本不足以构成那四个数字。

   这一幕要观众记住一件事：你以为你在「看」，其实你在「解」。
   ============================================================ */
PERCEPTION.css('scene-open', `
#openCanvas{
  width:56vw;max-width:1000px;height:auto;
  margin:var(--space-md) 0 var(--space-sm);
}
#openKicker{
  display:flex;align-items:center;gap:1.2vw;
  color:var(--text-tertiary);
}
#openKicker i{display:block;width:2.4vw;height:1px;background:var(--rule);}
.mx-title{
  font-size:var(--fs-hero);font-weight:var(--fw-bold);
  letter-spacing:.12em;line-height:1.15;
}
.mx-sub{
  font-family:var(--font-mono);letter-spacing:.42em;
  font-size:var(--fs-small);color:var(--text-tertiary);
  text-transform:uppercase;
}
`);

PERCEPTION.scene({
  id: 'open',
  label: '开场 · 2050',
  dark: true,
  states: [

    /* ---- 0.0 字号从方块里长出来 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-md mx-grid" style="width:100%;align-items:center">
          <div id="openKicker" class="mx-tag anim" style="--d:0s">
            <i></i>2050 · 未来感知的形质<i></i>
          </div>
          <canvas id="openCanvas" class="mx-pix" width="1206" height="619"></canvas>
        </div>
      `);

      /* 大字号在场上时，把角落里那个常驻记号藏起来，别重复 */
      var mark = document.getElementById('mx-mark');
      if (mark) mark.classList.add('off');

      var canvas = ctx.q('#openCanvas');
      var cancel = null;
      MX.load('./media/2050-logo.png', function (img) {
        /* 先给一版最粗的，让观众先「认出」它 */
        MX.paint(canvas, img, 9);
        cancel = MX.resolve(canvas, img, 9, canvas.width, 2000);
      });

      return function () { if (cancel) cancel(); };
    },

    /* ---- 0.1 标题 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-md mx-grid" style="width:100%;align-items:center">
          <img src="./media/2050-logo.png" alt="2050"
               class="anim fade" style="--d:0s;width:13vw;max-width:220px;opacity:.85">
          <div class="mx-rule" style="width:22vw;margin:var(--space-sm) 0"></div>
          <h1 class="mx-title anim" style="--d:.15s">心的眼睛</h1>
          <div class="mx-sub anim" style="--d:.35s">The Mind&rsquo;s Eye</div>
        </div>
      `);

      var mark = document.getElementById('mx-mark');
      if (mark) mark.classList.remove('off');
    },

  ],
});
