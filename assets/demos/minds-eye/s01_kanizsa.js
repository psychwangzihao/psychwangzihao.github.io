/* ============================================================
   场景 1：不存在的边  (id: kanizsa · 3 个状态)

   一个 Kanizsa 三角，先用不够多的方块给出来。
   观众照样一眼看出「有个三角形」——**而那块白色的三角形，
   四条边一条都没画。**

   这一幕把两件事压成一次：
     ① 分辨率不够，你还是看见了   → 你补的
     ② 你补的不只是分辨率，还补了一条**根本不存在的边**

   所以它不是「错觉」。错觉这个词暗示你被骗了一次；
   这里要讲的是你**每时每刻**都在做这件事。
   ============================================================ */
PERCEPTION.css('scene-kanizsa', `
/* 画布按**视口高度**定尺寸，不要按宽度。
   按宽度（44vw）时在 1600x900 上整屏会溢出 28px —— 宽屏下方块图会太高。
   高度定死、宽度由 820:700 的比例自己算，任何投影比例都不会顶出去。 */
#kzCanvas{
  height:48vh;width:auto;
  margin:var(--space-sm) 0 var(--space-md);
}
@media (max-width:860px){ #kzCanvas{height:auto;width:84vw;} }
.kz-q{
  font-size:var(--fs-title);font-weight:var(--fw-bold);
  line-height:1.35;letter-spacing:.02em;text-align:center;
}
.kz-line{
  font-size:var(--fs-subtitle);line-height:1.6;
  color:var(--text-secondary);max-width:64vw;
}
`);

PERCEPTION.scene({
  id: 'kanizsa',
  label: '不存在的边',
  dark: true,
  states: [

    /* ---- 1.0 给一版很粗的 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-sm mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">01 / 分辨率</div>
          <canvas id="kzCanvas" class="mx-pix" width="820" height="700"></canvas>
          <div class="kz-q anim" style="--d:.2s">你看见了什么？</div>
        </div>
      `);

      var canvas = ctx.q('#kzCanvas');
      var src = MX.kanizsa(820, 700);
      MX.paint(canvas, src, 26);
      PERCEPTION._kz = src;              /* 下一屏要用同一张，跨状态传一下 */
    },

    /* ---- 1.1 解析出来：边不存在 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-sm mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">01 / 分辨率</div>
          <canvas id="kzCanvas" class="mx-pix" width="820" height="700"></canvas>
          <div class="kz-q step" style="color:var(--mx-yellow)">三角形的边，我一笔没画。</div>
          <p class="step kz-line">
            三个圆盘各缺了一角，方向刚好对得上 —— 你的视觉系统就替你补出了
            一块白色的三角形，连它的边都画好了。
          </p>
        </div>
      `);

      var canvas = ctx.q('#kzCanvas');
      var src = (PERCEPTION._kz) || MX.kanizsa(820, 700);
      var cancel = MX.resolve(canvas, src, 26, canvas.width, 1100);
      ctx.steps();
      return function () { cancel(); };
    },

    /* ---- 1.2 落点：这不是错觉，是常态 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">01 / 分辨率</div>
          <h2 class="kz-q anim" style="--d:.1s;max-width:66vw">
            这不是「错觉」。
          </h2>
          <p class="step kz-line">
            错觉这个词暗示你偶尔被骗一次。<br>
            但刚才那一下，你**每一次眨眼**都在做。
          </p>
          <p class="step kz-line" style="color:var(--text-primary)">
            眼睛交上去的信息，从来就不够。<br>
            够用的那一部分，是你补的。
          </p>
        </div>
      `);
      ctx.steps();
    },

  ],
});
