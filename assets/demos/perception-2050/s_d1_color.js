/* ============================================================
 * 场景：色的三种机器  (id: color · 3 个状态)
 *
 * 感知的多样性整节压成一幕三屏。第一屏是**三种色觉并排**，
 * 形象展示，不做分析对照。
 *
 * ⚠️ 四色视那一格是**形象化写法**：四维色觉没法在 RGB 屏幕上还原。
 *    外圈那层更细的色相带读起来是「多一维」，不是真的还原。
 *    台上要把这一点说清楚 —— 说不清就成了假演示。
 * ============================================================ */
PERCEPTION.css('scene-color', `
#pzTri{display:flex;gap:var(--space-2xl);justify-content:center;align-items:flex-start;}
#pzTri .c{display:flex;flex-direction:column;align-items:center;gap:var(--space-xs);}
#pzTri canvas{
  /* ⚠️ width/height 必须写在标签上；只给 CSS 高度的话 canvas 默认 300×150，
     宽高比会被拉开，圆变成椭圆。 */
  height:34vh;width:auto;display:block;
  border-radius:var(--radius-full);box-shadow:var(--shadow-md);
}
#pzTri b{font-size:var(--fs-body);font-weight:var(--fw-bold);}
#pzTri span{font-size:var(--fs-small);color:var(--text-tertiary);text-align:center;max-width:20vw;}
`);

PERCEPTION.scene({
  id: 'color',
  label: '色的三种机器',
  part: '感知的多样性',
  dark: false,
  states: [

    /* ---- 一：二色视 / 三色视 / 四色视 并排 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg">
          <div id="pzTri">
            <div class="c anim" style="--d:0s">
              <canvas id="pzD" width="420" height="420"></canvas>
              <b class="c-blue">二色视</b><span>红绿色盲 · 约 8% 男性 · 丢掉一个维度</span>
            </div>
            <div class="c anim" style="--d:.2s">
              <canvas id="pzT" width="420" height="420"></canvas>
              <b>三色视</b><span>大多数人</span>
            </div>
            <div class="c anim" style="--d:.4s">
              <canvas id="pzQ" width="420" height="420"></canvas>
              <b class="c-purple">四色视</b><span>12% 女性携带 · 极少真用得上</span>
            </div>
          </div>
        </div>
      `);
      var src = PZ.hueWheel(420);
      var t = ctx.q('#pzT');
      t.width = 420; t.height = 420;
      t.getContext('2d').drawImage(src, 0, 0);
      PZ.simulate(ctx.q('#pzD'), src, 'deutan');
      var q = ctx.q('#pzQ');
      q.width = 420; q.height = 420;
      q.getContext('2d').drawImage(PZ.tetraWheel(420), 0, 0);
    },

    /* ---- 二：色盲的画家 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg">
          <div class="card anim" style="--d:0s;max-width:56vw;text-align:center">
            <p class="subtitle" style="margin:0 0 var(--space-xs)">梅里翁 · 米尔顿</p>
            <p class="body muted step">两个人都是色觉缺陷，两个人都从油画转向了黑白版画</p>
            <p class="body step">「我宁可要那些漂亮的黑。」</p>
          </div>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 三：盲人 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg">
          <div class="card anim" style="--d:0s;max-width:56vw;text-align:center">
            <p class="body step" style="margin:0 0 var(--space-xs)">听力阈值不变</p>
            <p class="body step" style="margin:0 0 var(--space-xs)">有些任务更好，有些更差</p>
            <p class="body step">视觉皮层接了别的活</p>
          </div>
        </div>
      `);
      ctx.steps();
    },

  ],
});
