/* ============================================================
 * 场景 10：收束与求索卡  (id: closing · 4 个状态)
 * 目的：哲学收束，留下问题，建立连接。
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

/* 10.3 求索卡 */
.cl-card{width:50vw;min-width:320px;}
/* 填空线：inline-block + 虚线下边框，坐在文字基线上；空的也看得见 */
.cl-blank{
  display:inline-block;vertical-align:baseline;
  width:14vw;min-width:110px;min-height:1.1em;
  border-bottom:2px dashed var(--border-subtle);
}

/* 二维码位：图还没到位时就是一个虚线占位框 */
.qr-slot{
  width:8vw;height:8vw;min-width:96px;min-height:96px;
  background:var(--bg-secondary);border-radius:var(--radius-md);
  border:1px dashed var(--border-subtle);
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;
}
.qr-slot img{display:block;width:100%;height:100%;object-fit:contain;}
.cl-qr-item{display:flex;flex-direction:column;align-items:center;gap:var(--space-xs);}
`);

PERCEPTION.scene({
  id: 'closing',
  label: '收束',
  states: [

    /* ---- 10.0 回归：四个场景的回声，一次全出 ---- */
    function (ctx) {
      ctx.set(`
        <div class="cl-dark">
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
        <div class="cl-dark">
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
        <div class="cl-dark">
          <div class="stack gap-sm cl-rows">
            <div class="subtitle anim fade" style="--d:0s">这不是说世界是假的。</div>
            <div class="subtitle anim fade" style="--d:.4s">而是说，我们接触世界，必须通过大脑的翻译。</div>
            <div class="subtitle anim fade" style="--d:.8s">科学就是研究翻译规则，以及它什么时候会出错。</div>
          </div>
        </div>
      `);
    },

    /* ---- 10.3 求索卡：学生写在纸上，带走一个问题 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-md">
          <div class="card cl-card anim" style="--d:0s">
            <div class="body">我最想问大脑的一个问题：<span class="cl-blank"></span></div>
          </div>

          <div class="card cl-card anim" style="--d:.2s">
            <div class="body">如果我要验证它，我会怎么设计一个小实验：<span class="cl-blank"></span></div>
          </div>

          <div class="row anim fade" style="--d:.4s">
            <div class="cl-qr-item">
              <div class="qr-slot">
                <img src="./media/qr-ask.png" alt="" onerror="this.style.display='none'">
              </div>
              <div class="small muted">匿名提问</div>
            </div>

            <div class="cl-qr-item">
              <div class="qr-slot">
                <img src="./media/qr-learn.png" alt="" onerror="this.style.display='none'">
              </div>
              <div class="small muted">想继续学习</div>
            </div>
          </div>

          <div class="subtitle anim fade" style="--d:.6s">有问题，来教室外面找我。</div>
        </div>
      `);
    },

  ],
});
