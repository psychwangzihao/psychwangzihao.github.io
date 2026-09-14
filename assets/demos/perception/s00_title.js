/* ============================================================
 * 场景 0：标题  (id: title · 1 个状态)
 * 学生入场时显示，建立氛围。
 * ============================================================ */
PERCEPTION.css('scene-title', `
#halo{
  width:20vw;height:20vw;min-width:170px;min-height:170px;border-radius:50%;
  background:radial-gradient(circle at 38% 34%,
    rgba(74,144,217,.55) 0%,
    rgba(139,126,200,.42) 45%,
    rgba(139,126,200,0) 72%);
  filter:blur(6px);
  animation:breathe 4s var(--ease-in-out) infinite;
  margin-bottom:var(--space-md);
}
#titleCard h1{margin-bottom:.6vw;}
.title-sub{margin-top:.8vw;letter-spacing:.12em;}
.title-hint{
  position:absolute;bottom:10vh;left:0;right:0;text-align:center;
  font-size:var(--fs-tiny);color:var(--text-tertiary);letter-spacing:.2em;
  animation:softPulse 3.5s var(--ease-in-out) infinite;
}
.title-date{font-size:var(--fs-tiny);color:var(--text-tertiary);letter-spacing:.24em;margin-top:.6vw;}
`);

PERCEPTION.scene({
  id: 'title',
  label: '标题',
  states: [

    /* ---- 0.0 标题页 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack" id="titleCard" style="position:relative">
          <div id="halo" class="anim pop" style="--d:0s"></div>
          <h1 class="hero center anim" style="--d:.5s">感觉在哪里？</h1>
          <div class="title-date anim" style="--d:.7s">WHERE&nbsp;DO&nbsp;SENSES&nbsp;LIVE</div>
          <div class="small faint title-sub anim" style="--d:.8s">浙江大学心理与行为科学系 · 王梓豪</div>
        </div>
        <div class="title-hint">按 <b>→</b> 开始 · 空格 / 点击任意处也可以</div>
      `);
    },

  ],
});
