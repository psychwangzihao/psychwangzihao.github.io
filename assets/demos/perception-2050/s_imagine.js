/* ============================================================
 * 场景：知生成感  (id: imagine · 3 个状态)
 *
 * 0 和 1 用同一个组件，只把箭头的方向反过来 ——
 * 不是换一句话说同一件事，是同一张图上方向变了。
 *
 * 三屏，全是静态的 —— 这一节不需要交互。
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

  ],
});
