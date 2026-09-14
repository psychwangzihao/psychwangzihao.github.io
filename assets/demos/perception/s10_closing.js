/* ============================================================
 * 场景 10：收束  (id: closing · 3 个状态)
 * 目的：哲学收束。原来第 4 态「求索卡」要印卡片 + 两个二维码，
 *       已经去掉（收尾那句「有问题，来教室外面找我」挪到了第 12 幕）。
 *
 * 注：core.js 的 dark 是「场景级」的，而 10.0–10.2 要暗底、10.3 要亮底，
 *     所以本场景不开 dark，由前三个状态自己铺一层 .cl-dark 暗色底；
 *     10.3 不铺任何底色，直接落在 body 的 --bg-primary 暖白上。
 * ============================================================ */
PERCEPTION.css('scene-closing', `
/* 10.0–10.2 的暗色底（绝对定位铺满 .scene 的 padding box = 整个视口） */
.cl-dark{
  position:absolute;inset:0;
  background:var(--bg-dark);color:var(--text-inverse);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:var(--space-lg) var(--space-xl);
}
.cl-rows{max-width:70vw;text-align:center;}

`);

PERCEPTION.scene({
  id: 'closing',
  label: '收束',
  states: [

    /* ---- 10.0 回归：四个场景的回声，一次全出 ---- */
    function (ctx) {
      ctx.set(`
        <div class="cl-dark" data-dark>
          <div class="stack gap-sm cl-rows">
            <div class="subtitle anim fade" style="--d:0s">声波在森林里，响在大脑里。</div>
            <div class="subtitle anim fade" style="--d:.4s">波长在宇宙里，红在大脑里。</div>
            <div class="subtitle anim fade" style="--d:.8s">分子在杯子里，甜在大脑里。</div>
            <div class="subtitle anim fade" style="--d:1.2s">损伤在身体上，痛在大脑里。</div>
          </div>
        </div>
      `);
    },

    /* ---- 10.1 核心：一句话收束 ---- */
    function (ctx) {
      ctx.set(`
        <div class="cl-dark" data-dark>
          <div class="stack gap-md cl-rows">
            <div class="title bold center anim fade" style="--d:0s">
              感觉不在眼睛、耳朵、皮肤里，而在大脑里。
            </div>
            <div class="subtitle anim fade" style="--d:.4s">
              大脑可以构建、可以缺失、可以换通道、可以被写入。
            </div>
            <div class="subtitle c-blue anim fade" style="--d:.8s">
              而科学方法，是我们知道这一切的唯一可靠路径。
            </div>
          </div>
        </div>
      `);
    },

    /* ---- 10.2 不是虚幻：先破可能的误解 ---- */
    function (ctx) {
      ctx.set(`
        <div class="cl-dark" data-dark>
          <div class="stack gap-sm cl-rows">
            <div class="subtitle">这不是说世界是假的。</div>
            <div class="step subtitle">而是说，我们接触世界，必须通过大脑的翻译。</div>
            <div class="step subtitle">科学就是研究翻译规则，以及它什么时候会出错。</div>

            <div class="step quote" style="max-width:56vw;margin-top:var(--space-md)">
              “If the human brain were so simple that we could understand it,<br>
              we would be so simple that we couldn’t.”
              <span class="attr">Emerson M. Pugh</span>
            </div>
          </div>
        </div>
      `);
    },

  ],
});
