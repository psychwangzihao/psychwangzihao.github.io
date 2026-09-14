/* ============================================================
 * 场景：闪烁网格（错觉冷开场）  (id: illusion · 2 个状态)
 *
 * 位置：紧接着开幕，在「树倒悖论」之前。
 *
 * 为什么放在最前面：一场讲座的头 60 秒决定后面 40 分钟。
 * 与其先讲道理，不如先让全场亲眼看到自己的眼睛在骗自己 ——
 * 不用一句话解释，学生自己就「啊」出来了。等他有了这个体验，
 * 后面那句「声波在森林里、响在大脑里」才不是一句空话。
 *
 * 用的现象是闪烁网格（scintillating grid，Lingelbach 1994）：
 * 黑底白线，每个交点上有一个白点包着黑心。盯住任意一个交点不动，
 * 视野边缘的交点上会冒出闪烁的黑点 —— 而黑点根本不存在。
 *
 * 补充：为什么这一屏不怕「有人没看到」——
 * 见的人多、没见的人少，这个差异本身就是下一句台词。
 * ============================================================ */
PERCEPTION.css('scene-illusion', `
/* 宽度同时受屏高约束：网格是 16:9，只按 vw 给宽会在矮屏上把下面的字挤出去 */
#scinWrap{
  width:min(58vw, 84vh);max-width:1400px;
  border-radius:var(--radius-lg);overflow:hidden;
  box-shadow:var(--shadow-xl);
  line-height:0;
}
#scinWrap svg{display:block;width:100%;height:auto;}

.il-q{
  font-size:var(--fs-subtitle);font-weight:var(--fw-medium);
  color:var(--text-inverse);text-align:center;line-height:1.5;
}
.il-reveal{
  font-size:var(--fs-title);font-weight:var(--fw-bold);
  color:var(--text-inverse);text-align:center;line-height:1.35;
}
`);

/* 闪烁网格：13 × 7 个交点，用 16:9 的比例铺满屏宽 */
function scinGridSVG() {
  var COLS = 13, ROWS = 7, GAP = 80, M = 60;
  var W = M * 2 + (COLS - 1) * GAP;
  var H = M * 2 + (ROWS - 1) * GAP;
  var cI = (COLS - 1) / 2, rI = (ROWS - 1) / 2;   /* 正中间那个交点 */
  var s = '', i, j, x, y;

  s += '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="#0A0A0A"/>';

  for (i = 0; i < COLS; i++) {
    x = M + i * GAP;
    s += '<line x1="' + x + '" y1="' + M + '" x2="' + x + '" y2="' + (H - M) +
         '" stroke="#ffffff" stroke-width="2.5"/>';
  }
  for (j = 0; j < ROWS; j++) {
    y = M + j * GAP;
    s += '<line x1="' + M + '" y1="' + y + '" x2="' + (W - M) + '" y2="' + y +
         '" stroke="#ffffff" stroke-width="2.5"/>';
  }

  /* 交点上的白点 + 黑心。正中间那颗心换成橙色，用来标「盯这里」。
     圆点直径约为格子的 1/4 —— 太大会把闪烁效应压掉。 */
  for (i = 0; i < COLS; i++) {
    for (j = 0; j < ROWS; j++) {
      x = M + i * GAP;
      y = M + j * GAP;
      s += '<circle cx="' + x + '" cy="' + y + '" r="11" fill="#ffffff"/>';
      s += '<circle cx="' + x + '" cy="' + y + '" r="4.5" fill="' +
           (i === cI && j === rI ? 'var(--accent-orange)' : '#0A0A0A') + '"/>';
    }
  }

  return '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" ' +
         'aria-hidden="true">' + s + '</svg>';
}

PERCEPTION.scene({
  id: 'illusion',
  label: '闪烁网格',
  dark: true,
  states: [

    /* ---- 0：盯住中间那一点，数黑点 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-md">
          <div class="il-q anim" style="--d:0s">
            盯住中间那颗<b class="c-orange">橙色的点</b>，不要移开眼睛。
          </div>

          <div id="scinWrap" class="anim fade" style="--d:.35s">
            ${scinGridSVG()}
          </div>

          <div class="il-q anim" style="--d:.8s">
            数一数：你看到了几个<b class="c-orange">黑点</b>？
          </div>
        </div>
      `);
      /* 第一张就让人盯着看，误点一下会打断视线 —— 留个提示 */
      ctx.toast('按 → 揭晓');
    },

    /* ---- 1：一个都没有 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg">
          <div class="il-reveal anim" style="--d:0s">
            一个都没有。
          </div>

          <p class="body anim fade" style="--d:.6s;color:#C8C8C8;max-width:62vw;text-align:center">
            那些闪烁的黑点根本不存在 —— 它们只出现在你视野的边缘。<br>
            你的眼睛和大脑在<b class="c-blue">实时加工</b>，不是在拍照。
          </p>

          <p class="body anim fade" style="--d:1.3s;color:#C8C8C8;max-width:62vw;text-align:center">
            刚才有人看到了，有人没看到。<br>
            同一个图案，不同的眼睛给出不同的答案 —— <b class="c-orange">记住这句话</b>。
          </p>
        </div>
      `);
    },

  ],
});
