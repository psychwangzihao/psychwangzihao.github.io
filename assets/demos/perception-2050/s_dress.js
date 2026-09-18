/* ============================================================
 * 场景：同一张照片，两种颜色  (id: dress · 2 个状态)
 *
 * 那条裙子（2015）。**不引用原照片**（版权），
 * 改用两块色卡把两种报出来的颜色并排放在一起 ——
 * 要说的本来也不是那张图，是"两边都言之凿凿"这件事。
 *
 * 关键：两个人的锥细胞是一样的。差别在对光源的假设上。
 * 所以这一屏放在「知 → 感」这一节，不放在色觉那一节。
 * ============================================================ */
PERCEPTION.css('scene-dress', `
#pdPair{display:flex;gap:var(--space-2xl);align-items:flex-start;}
#pdPair .side{display:flex;flex-direction:column;align-items:center;gap:var(--space-sm);}
#pdPair .sw{display:flex;box-shadow:var(--shadow-md);border-radius:var(--radius-sm);overflow:hidden;}
#pdPair .sw i{display:block;width:9vw;height:12vw;min-width:90px;min-height:120px;}
#pdPair .side u{
  text-decoration:none;font-size:var(--fs-body);font-weight:var(--fw-bold);
}
#pdPair .side em{font-style:normal;font-size:var(--fs-small);color:var(--text-tertiary);}
`);

PERCEPTION.scene({
  id: 'dress',
  label: '同一张照片，两种颜色',
  part: '想象',
  dark: false,
  states: [

    /* ---- 两种所见并排 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-xl">
          <div id="pdPair">
            <div class="side anim" style="--d:0s">
              <span class="sw"><i style="background:#E8E4DC"></i><i style="background:#C9A227"></i></span>
              <u>白金</u><em>光源偏冷</em>
            </div>
            <div class="side anim" style="--d:.2s">
              <span class="sw"><i style="background:#7C90C0"></i><i style="background:#2B2B33"></i></span>
              <u>蓝黑</u><em>光源偏暖</em>
            </div>
          </div>
          <div class="body muted anim" style="--d:.5s">同一张照片，同一套锥细胞。</div>
        </div>
      `);
    },

    /* ---- 差在哪 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg">
          <div class="card anim" style="--d:0s;max-width:58vw;text-align:center">
            <p class="body step">差的是各自对光源的假设</p>
            <p class="subtitle step" style="margin-top:var(--space-sm)">知生成感</p>
          </div>
        </div>
      `);
      ctx.steps();
    },

  ],
});
