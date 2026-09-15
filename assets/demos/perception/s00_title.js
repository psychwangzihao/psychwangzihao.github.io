/* ============================================================
 * 场景 0：开场  (id: title · 2 个状态)
 * 标题：眼见为实吗？ / Is Seeing Believing?
 *   0.0  两扇门合拢，门缝上是浙大校徽 + 「点击校徽，开始上课」
 *   0.1  门向两侧滑开，露出标题
 * 学生入场时停在第 0 态，人到齐了点校徽（或按 →）开始。
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
.title-date{font-size:var(--fs-tiny);color:var(--text-tertiary);letter-spacing:.24em;margin-top:.6vw;}

/* 开场那一屏的标题卡：门拉开时它已经在后面了，
   所以让内容比自己进场稍晚一点浮现 */
#titleCard{opacity:0;transform:translateY(18px);
  transition:opacity .9s var(--ease-out) .35s, transform .9s var(--ease-out) .35s;}
#titleCard.on{opacity:1;transform:none;}

/* 院系标识，压在标题下方，做个小落款 */
.title-dept{
  width:22vw;min-width:190px;max-width:330px;height:auto;
  margin-top:var(--space-lg);opacity:.65;
}
`);

PERCEPTION.scene({
  id: 'title',
  label: '开场',
  states: [

    /* ---- 0.0 门关着：校徽 + 开始提示 ---- */
    function (ctx) {
      ctx.set(DOOR.html({}));
    },

    /* ---- 0.1 门拉开，露出标题 ---- */
    function (ctx) {
      /* 门和标题在同一个状态里，这样开门动画不会和场景切换打架。
         标题卡先藏 350ms，等门走开一半再浮现。 */
      ctx.set(
        `<div class="stack" id="titleCard">
           <div id="halo" class="anim pop" style="--d:0s"></div>
           <h1 class="hero center anim" style="--d:.5s">眼见为实吗？</h1>
           <div class="title-date anim" style="--d:.7s">IS&nbsp;SEEING&nbsp;BELIEVING&nbsp;?</div>
           <div class="small faint title-sub anim" style="--d:.8s">浙江大学心理与行为科学系 · 王梓豪</div>
           <picture class="anim fade" style="--d:1s">
             <source srcset="./media/dept-logo.webp" type="image/webp">
             <img class="title-dept" src="./media/dept-logo.png"
                  alt="浙江大学心理与行为科学系">
           </picture>
         </div>` +
        DOOR.html({ open: false, hint: '' })
      );

      /* 开门动画期间点屏幕不该翻页 —— 门一被移除（1.2s 后）就恢复 */
      var door = ctx.q('#door');
      if (door) door.setAttribute('data-noclick', '');

      ctx.soon(function () { ctx.q('#titleCard').classList.add('on'); }, 60);
      DOOR.open(ctx, 260);

    },

  ],
});
