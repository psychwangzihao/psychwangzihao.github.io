/* ============================================================
 * 场景：开场  (id: title · 1 个状态)
 *
 * 一屏，一句话，没有动画。台下的注意力在开场是最贵的，
 * 不要花在一个门开的动作上。
 * ============================================================ */
PERCEPTION.css('scene-title', `
#ttWrap{display:flex;flex-direction:column;align-items:center;gap:var(--space-lg);}
#ttName{
  font-size:var(--fs-hero);font-weight:var(--fw-bold);
  letter-spacing:.3em;text-indent:.3em;line-height:1.1;
}
#ttSub{
  font-family:var(--font-mono);font-size:var(--fs-small);
  letter-spacing:.4em;text-indent:.4em;color:var(--text-tertiary);
  text-transform:uppercase;
}
#ttLine{width:18vw;height:1px;background:var(--border-subtle);}
#ttWhere{font-size:var(--fs-body);color:var(--text-secondary);}
`);

PERCEPTION.scene({
  id: 'title',
  label: '开场',
  part: '开场',
  dark: false,
  states: [
    function (ctx) {
      ctx.set(`
        <div id="ttWrap">
          <div id="ttName" class="anim" style="--d:0s">感知</div>
          <div id="ttLine" class="anim fade" style="--d:.3s"></div>
          <div id="ttSub" class="anim" style="--d:.45s">Perception</div>
          <div id="ttWhere" class="anim" style="--d:.7s">2050 · 未来感知的形质</div>
        </div>
      `);
    },
  ],
});
