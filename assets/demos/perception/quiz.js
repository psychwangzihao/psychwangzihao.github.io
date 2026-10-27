/* ============================================================
 * quiz.js — 「先猜一猜」组件（在 core.js 之后加载）
 *
 * 讲科普最有效的一招：揭晓之前先让观众押一个答案。
 * 押过之后，同一个结果会记得牢得多 —— 因为他在等自己的答案对不对。
 *
 * 用法：
 *   ctx.set(QUIZ.html({
 *     q: '戴上把世界上下颠倒的眼镜，戴到第八天，你会看到什么？',
 *     options: ['还是颠倒的', '正过来了', '知道是颠倒的，但不再难受'],
 *     answer: 1,                       // 哪一个是「结果」（会打勾）
 *     note: '1897 年，斯特拉顿自己做了这个实验。'
 *   }));
 *   QUIZ.mount(ctx, { answer: 1, onReveal: (picked, correct) => {…} });
 *   onReveal 可选：用来在揭晓后做别的事（比如押对了就直接跳到下一节）。
 *
 * 交互有两层保险：点选项会揭晓；如果讲者直接按 →（不点），
 * 第一次 → 也只会揭晓、不会翻页（靠 ctx.holdNext），再按才走。
 * ============================================================ */
PERCEPTION.css('quiz', `
.qz{display:flex;flex-direction:column;align-items:center;gap:var(--space-lg);}

.qz-q{
  font-size:var(--fs-title);font-weight:var(--fw-bold);line-height:1.35;
  text-align:center;max-width:66vw;
}

.qz-opt{display:flex;gap:var(--space-md);flex-wrap:wrap;justify-content:center;}
.qz-card{
  background:var(--bg-card);border:2px solid var(--border-subtle);
  border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);
  padding:var(--space-sm) var(--space-lg);
  font-size:var(--fs-subtitle);line-height:1.4;
  max-width:26vw;min-width:12vw;text-align:center;cursor:pointer;
  transition:transform var(--dur-fast) var(--ease-out),
             box-shadow var(--dur-fast) var(--ease-out),
             border-color var(--dur-fast) var(--ease-out),
             background var(--dur-fast) var(--ease-out),
             color var(--dur-fast) var(--ease-out),
             opacity var(--dur-normal) var(--ease-out);
}
.qz-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-md);
  border-color:var(--accent-blue);}
.qz-card.picked{border-color:var(--accent-blue);background:var(--accent-blue-light);
  color:var(--accent-blue);font-weight:var(--fw-bold);}
.qz-card.answer{border-color:var(--accent-green);background:var(--accent-green-light);
  color:var(--accent-green);font-weight:var(--fw-bold);}
.qz-card.answer::after{content:' ✓';}
.qz-card.dim{opacity:.4;}

.qz-note{
  font-size:var(--fs-body);color:var(--text-secondary);text-align:center;
  max-width:58vw;line-height:1.6;
  opacity:0;transition:opacity var(--dur-slower) var(--ease-out);
}
.qz-note.on{opacity:1;}
.qz-hint{font-size:var(--fs-small);color:var(--text-tertiary);letter-spacing:.16em;}
`);

window.QUIZ = {

  html: function (o) {
    return '<div class="qz">' +
      '<div class="qz-q anim" style="--d:0s">' + o.q + '</div>' +
      '<div class="qz-opt">' +
        o.options.map(function (t, i) {
          return '<div class="qz-card anim" data-i="' + i + '" style="--d:' +
                 (0.3 + i * 0.12).toFixed(2) + 's">' + t + '</div>';
        }).join('') +
      '</div>' +
      '<div class="qz-note" id="qzNote">' + (o.note || '') + '</div>' +
      '<div class="qz-hint" id="qzHint"></div>' +
    '</div>';
  },

  mount: function (ctx, o) {
    var done = false;

    var picked = -1;
    function reveal() {
      if (done) return;
      done = true;
      var ans = ctx.q('.qz-card[data-i="' + o.answer + '"]');
      if (ans) ans.classList.add('answer');
      ctx.each('.qz-card', function (c) {
        if (c !== ans) c.classList.add('dim');
      });
      var n = ctx.q('#qzNote');
      if (n) ctx.soon(function () { n.classList.add('on'); }, 220);
      var h = ctx.q('#qzHint');
      if (h) h.textContent = '';
      if (o.onReveal) o.onReveal(picked, picked === o.answer);
    }

    ctx.each('.qz-card', function (card) {
      ctx.on(card, 'click', function () {
        if (done) return;
        picked = parseInt(card.dataset.i, 10);
        card.classList.add('picked');
        /* 让「picked」先画出来，再揭晓答案，两拍看得清 */
        ctx.after(320, reveal);
      });
    });

    /* 讲者没点、直接按 → ：第一次只揭晓，不翻页 */
    ctx.holdNext(reveal);
  },
};
