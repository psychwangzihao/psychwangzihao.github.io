/* ============================================================
 * 场景 11：回响  (id: awe · 4 个状态)
 * 目的：回到开场那棵树，把「不知道」说出来，最后落在敬畏上。
 *
 * 这一幕的收束逻辑：
 *   前面十幕证明了「响」是体验、体验在大脑里 —— 但那是在人类身上。
 *   于是最后一步反问：我们凭什么说只有大脑能做这件事？
 *   答案是：我们不知道。我们判断别的东西有没有心灵，靠的只是
 *   「它像不像我」。这就是整场讲座真正的结尾。
 *
 * 注：文案里的最后两句（树会痛吗 / 小鸟也有意识吗）是讲座的落点，
 *     作者可以按自己的语气改写，改这里就行。
 * ============================================================ */
PERCEPTION.css('scene-awe', `
/* 暗色满屏（这一幕 11.1–11.3 都是暗的；11.0 是亮的，呼应开场） */
.aw-dark{
  position:absolute;inset:0;background:var(--bg-dark);color:var(--text-inverse);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:var(--space-lg) var(--space-xl);text-align:center;
}
.aw-dark .muted{color:#A6A6A6;}
.aw-dark .faint{color:#7C7C7C;}

.aw-kicker{letter-spacing:.42em;font-size:var(--fs-small);color:var(--text-tertiary);}
.aw-dark .aw-kicker{color:#7C7C7C;}

/* 11.0：把开场那句话原样搬回来，所以字号、宽度都和场景 1.0 对齐 */
.aw-q{max-width:74vw;}
.aw-tally{display:flex;align-items:center;gap:var(--space-sm);justify-content:center;flex-wrap:wrap;}
.aw-tally .pill{font-size:var(--fs-body);padding:.5vw 1.4vw;}

/* 11.1：那个「不知道」要够大 */
.aw-unknown{
  font-size:calc(var(--fs-hero) * 1.2);
  font-weight:var(--fw-bold);line-height:1.1;letter-spacing:.06em;
  color:var(--accent-blue);
}

/* 11.2：三步推断 */
.aw-steps{display:flex;flex-direction:column;gap:var(--space-md);align-items:flex-start;}
.aw-step{display:flex;align-items:center;gap:var(--space-sm);
         font-size:var(--fs-subtitle);line-height:1.4;text-align:left;}

/* 11.3：最后两个问句 */
.aw-ask{
  font-size:var(--fs-title);font-weight:var(--fw-bold);line-height:1.4;
  display:flex;align-items:center;gap:var(--space-sm);
}
`);

PERCEPTION.scene({
  id: 'awe',
  label: '回响',
  states: [

    /* ---- 11.0 回到那棵树 ---- */
    function (ctx) {
      var v = PERCEPTION.votes || { yes: 0, no: 0 };
      var voted = (v.yes + v.no) > 0;

      /* 开场投过票就回放票数，没投过就换成一句话 —— 不要显示「0 票」 */
      var tally = voted
        ? '<span class="pill">会 · ' + v.yes + '</span>' +
          '<span class="pill orange">不会 · ' + v.no + '</span>' +
          '<span class="small faint">开场时我们班投出来的</span>'
        : '<span class="small faint">开场时我们举过手。</span>';

      ctx.set(`
        <div class="stack gap-md">
          <div class="aw-kicker anim fade" style="--d:0s">回到开头</div>

          <h1 class="hero center aw-q anim" style="--d:.3s">
            如果森林里一棵树倒下了，<br>周围没有人，它会响吗？
          </h1>

          <div class="rule short anim fade" style="--d:.6s"></div>

          <div class="aw-tally anim fade" style="--d:.8s">${tally}</div>
        </div>
      `);
    },

    /* ---- 11.1 答案是「不知道」 ----
       开场投过两次票，这里要回扣。但**只有当「不会响」占多数时**
       才能说「我们当时说：不会响」—— 不然就是把自己的话塞给全场。 */
    function (ctx) {
      var v = PERCEPTION.votesFinal();
      var OPENING;
      if (v.yes === v.no) {
        OPENING = '当时认为「会响」和「不会响」的同学，一样多。';
      } else if (v.no > v.yes) {
        OPENING = '我们当时说：不会响。';
      } else {
        OPENING = '我们当时说：会响。';
      }
      ctx.set(`
        <div class="aw-dark" data-dark>
          <div class="stack gap-lg" style="max-width:72vw">
            <p class="body muted anim fade" style="--d:0s">${OPENING}</p>
            <p class="step body muted">因为「响」不是声波，是体验 —— 而体验在大脑里。</p>

            <p class="small faint anim fade" style="--d:.9s;margin-top:var(--space-md)">
              但那道题真正的答案，其实是 ——
            </p>

            <div class="aw-unknown anim pop" style="--d:1.2s">不知道。</div>

            <p class="body muted anim fade" style="--d:1.8s;margin-top:var(--space-md);max-width:56vw">
              树没有耳朵，也没有大脑。<br>
              可「必须有大脑才算数」这件事，是我们从自己身上推出来的。
            </p>
          </div>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 11.2 我们只能从自己推断 ---- */
    function (ctx) {
      ctx.set(`
        <div class="aw-dark" data-dark>
          <div class="stack gap-xl" style="max-width:64vw">
            <div class="aw-steps">
              <div class="aw-step anim" style="--d:0s">
                ${ICON.person('ico lg c-blue')}<span>我知道我有感受。</span>
              </div>
              <div class="aw-step step">
                ${ICON.users('ico lg c-green')}<span>我猜你也有 —— 因为你和我一样。</span>
              </div>
              <div class="aw-step step">
                ${ICON.question('ico lg c-purple')}<span>那它呢？一棵树、一只鸟、一台机器。</span>
              </div>
            </div>

            <div class="step rule short"></div>

            <p class="step takeaway" style="max-width:58vw">
              我们判断一个东西有没有心灵，靠的只是「它像不像我」。
            </p>
          </div>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 11.3 保持敬畏（全场结束） ---- */
    function (ctx) {
      ctx.set(`
        <div class="aw-dark" data-dark>
          <div class="stack gap-lg" style="max-width:76vw">
            <div class="aw-kicker">所以</div>

            <h2 class="title center">
              对心灵，对生命，保持敬畏。
            </h2>

            <div class="step aw-ask" style="margin-top:var(--space-md)">
              ${ICON.tree('ico lg c-green')}<span>砍树的时候，树会痛吗？</span>
            </div>
          </div>
        </div>
      `);
      ctx.steps();
    },

  ],
});
