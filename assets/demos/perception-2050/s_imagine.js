/* ============================================================
 * 场景：知生成感  (id: imagine · 3 个状态)
 *
 * 0 和 1 用同一个组件，只把箭头的方向反过来 ——
 * 不是换一句话说同一件事，是同一张图上方向变了。
 *
 * 2 是全场唯一必须用浏览器的一屏：现场报数。
 * ⚠️ 这一屏会接管键盘（1–5 计数 / 0 撤销 / R 清空），
 *    离开时必须把 PERCEPTION.keyHook 放掉，否则后面每一屏的数字键都还在计数。
 * ============================================================ */
PERCEPTION.css('scene-imagine', `
#siArrow{display:flex;align-items:center;gap:var(--space-lg);}
#siArrow .n{
  font-size:var(--fs-title);font-weight:var(--fw-bold);
  padding:var(--space-xs) var(--space-md);
  border:1px solid var(--border-subtle);border-radius:var(--radius-md);
}
#siArrow .n.hi{border-color:var(--accent-orange);color:var(--accent-orange);}
#siArrow .a{font-family:var(--font-mono);font-size:var(--fs-title);color:var(--accent-blue);}
#siArrow .a.rev{color:var(--accent-orange);}
#siPoll{width:52vw;}
#siPoll .bar-name{width:8em;}
`);

PERCEPTION.scene({
  id: 'imagine',
  label: '知生成感',
  part: '想象',
  dark: false,
  states: [

    /* ---- 通常的方向 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-xl">
          <div id="siArrow">
            <span class="n anim" style="--d:0s">感</span>
            <span class="a anim" style="--d:.15s">→</span>
            <span class="n anim" style="--d:.3s">知</span>
          </div>
        </div>
      `);
    },

    /* ---- 方向反过来 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-xl">
          <div id="siArrow">
            <span class="n anim" style="--d:0s">知</span>
            <span class="a rev anim" style="--d:.15s">→</span>
            <span class="n hi anim" style="--d:.3s">感</span>
          </div>
          <div class="subtitle anim" style="--d:.6s">这就是想象</div>
        </div>
      `);
    },

    /* ---- 同一台机器 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg">
          <div class="row gap-lg wrap">
            <div class="card tight anim" style="--d:0s">想象中的亮光 · 瞳孔缩小</div>
            <div class="card tight anim" style="--d:.15s">想象中的跑动 · 心率上去</div>
            <div class="card tight anim" style="--d:.3s">想象中的一条边 · 视觉皮层亮</div>
          </div>
        </div>
      `);
    },

    /* ---- 想象的谱：现场报数 ---- */
    function (ctx) {
      var POLL = [0, 0, 0, 0, 0];
      var last = 0;
      var NAMES = ['什么都没有', '很模糊', '有一点', '比较清楚', '像照片一样'];

      ctx.set(`
        <div class="stack gap-md">
          <div class="title anim" style="--d:0s">一个苹果</div>
          <div class="bars anim" id="siPoll" style="--d:.2s"></div>
          <div class="small faint anim" style="--d:.4s">
            <b>1–5</b> 计数 · <b>0</b> 撤销 · <b>R</b> 清空
          </div>
        </div>
      `);

      var barsEl = ctx.q('#siPoll');
      barsEl.innerHTML = NAMES.map(function (nm, i) {
        return '<div class="bar-row">' +
          '<span class="bar-name">' + (i + 1) + ' ' + nm + '</span>' +
          '<span class="bar-track"><span class="bar' + (i === 0 ? ' alt' : '') +
          '" id="siB' + i + '"></span></span>' +
          '<span class="bar-num" id="siN' + i + '">0</span></div>';
      }).join('');

      function redraw() {
        var max = Math.max(1, Math.max.apply(null, POLL));
        POLL.forEach(function (v, i) {
          ctx.q('#siB' + i).style.width = (v ? Math.max((v / max) * 100, 4) : 0) + '%';
          ctx.q('#siN' + i).textContent = v;
        });
      }

      PERCEPTION.keyHook = function (k) {
        if (k >= '1' && k <= '5') { POLL[+k - 1]++; last = +k - 1; redraw(); return true; }
        if (k === '0' || k === 'Backspace') {
          if (POLL[last]) { POLL[last]--; redraw(); }
          return true;
        }
        if (k === 'r' || k === 'R') {
          POLL = [0, 0, 0, 0, 0]; last = 0; redraw(); return true;
        }
        return false;
      };

      redraw();
      /* ⚠️ 必须放掉，否则后面每一屏的数字键都还在计数 */
      return function () { PERCEPTION.keyHook = null; };
    },

  ],
});
