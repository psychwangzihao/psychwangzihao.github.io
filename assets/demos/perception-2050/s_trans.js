/* ============================================================
 * 场景：感 = 转译  (id: trans · 1 个状态)
 *
 * 脑图上这一节只有两行：
 *   「感 = 转译」
 *   「刺激 → 感受器 → 电信号 → 感受」
 * 所以屏幕上就只有那条链子。不加例子、不加比喻 ——
 * 例子是讲者嘴里的，不是屏幕上的。
 * ============================================================ */
PERCEPTION.css('scene-trans', `
#stChain{display:flex;align-items:center;gap:var(--space-md);}
#stChain .n{
  font-size:var(--fs-subtitle);font-weight:var(--fw-bold);
  padding:var(--space-xs) var(--space-md);
  border:1px solid var(--border-subtle);border-radius:var(--radius-md);
  white-space:nowrap;
}
#stChain .n.hi{border-color:var(--accent-orange);color:var(--accent-orange);}
#stChain .a{font-family:var(--font-mono);font-size:var(--fs-subtitle);color:var(--accent-blue);}
`);

PERCEPTION.scene({
  id: 'trans',
  label: '感 = 转译',
  part: '人如何感',
  dark: false,
  states: [
    function (ctx) {
      ctx.set(`
        <div class="stack gap-xl">
          <div id="stChain">
            <span class="n anim" style="--d:0s">刺激</span>
            <span class="a anim" style="--d:.1s">→</span>
            <span class="n anim" style="--d:.2s">感受器</span>
            <span class="a anim" style="--d:.3s">→</span>
            <span class="n anim" style="--d:.4s">电信号</span>
            <span class="a anim" style="--d:.5s">→</span>
            <span class="n hi anim" style="--d:.6s">感受</span>
          </div>
          <div class="title anim" style="--d:.9s">转译</div>
        </div>
      `);
    },
  ],
});
