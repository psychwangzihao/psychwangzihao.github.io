/* ============================================================
   场景 2：想象光谱  (id: spectrum · 3 个状态)

   全场的高点。前面讲的是"有输入时大脑在补"，这里第一次把输入拿掉。

   关键设计：**不问"能不能看见"，问"有多清楚，报个数"。**
   - 二分的问题只会得到"大部分人都举手"，然后场面僵住
   - 五点量表会得到一条**分布**，而分布里必然有一些人落在最左端
   - 于是"心盲症 2–4%"从一个统计数字，变成这个房间里的一件事实

   讲者在台上点计数（沿用现场举手那套），屏幕上实时长出柱状图。
   不用手机扫码投票：现场网络、扫码率、投影延迟都是风险，
   而举手计数三十秒就完了。

   按 R 清零重投。
   ============================================================ */
PERCEPTION.css('scene-spectrum', `
#spBoard{
  display:flex;align-items:flex-end;justify-content:center;
  gap:2.2vw;width:100%;margin-top:var(--space-md);
}
.sp-col{display:flex;flex-direction:column;align-items:center;gap:.6vw;width:11vw;}
.sp-num{
  font-family:var(--font-mono);font-size:var(--fs-subtitle);
  font-weight:var(--fw-bold);line-height:1;
}
.sp-bar{
  width:100%;background:var(--mx-blue);
  transition:height var(--dur-slow) var(--ease-out);
  min-height:2px;
}
/* 最左那一格是这一屏真正要说的话，单独给颜色 */
.sp-col.zero .sp-bar{background:var(--mx-yellow);}
.sp-bar-wrap{
  width:100%;height:26vh;display:flex;align-items:flex-end;
  border-bottom:1px solid var(--rule);
}
.sp-btns{display:flex;gap:.3vw;}
.sp-btn{
  font-family:var(--font-mono);font-size:var(--fs-small);font-weight:var(--fw-bold);
  width:2.2vw;height:2.2vw;line-height:1;
  background:transparent;color:var(--text-secondary);
  border:1px solid var(--rule);cursor:pointer;
}
.sp-btn:hover{background:var(--text-primary);color:var(--bg-primary);}
.sp-label{
  font-size:var(--fs-tiny);color:var(--text-tertiary);
  text-align:center;line-height:1.35;height:3.2em;
}
.sp-ask{
  font-size:var(--fs-title);font-weight:var(--fw-bold);line-height:1.4;
  text-align:center;
}
.sp-hold{
  font-size:var(--fs-hero);font-weight:var(--fw-bold);
  letter-spacing:.16em;line-height:1.3;
}
`);

/* 五点，从"什么都没有"到"像照片一样"。
   中间三档故意留得模糊 —— 真实的主观体验也不是五个整齐的档位。 */
var SP_LABELS = ['什么都没有', '很模糊', '有一些', '比较清楚', '像照片一样'];
var SP = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

PERCEPTION.scene({
  id: 'spectrum',
  label: '想象光谱',
  dark: true,
  states: [

    /* ---- 2.0 先把输入拿掉 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">02 / 想象</div>
          <p class="sp-ask anim" style="--d:.15s">
            闭上眼睛。<br>想象一个苹果。
          </p>
          <p class="step small muted" style="max-width:46vw;text-align:center">
            花瓣是绿色的，叶子是红色的。<br>
            —— 反着说，是为了逼出真实的画面，而不是"苹果"这个概念。
          </p>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 2.1 不给二分答案，给一条谱 ---- */
    function (ctx) {
      var cols = [1, 2, 3, 4, 5].map(function (n) {
        return `
          <div class="sp-col${n === 1 ? ' zero' : ''}" data-n="${n}">
            <div class="sp-num" data-count="${n}">0</div>
            <div class="sp-bar-wrap"><div class="sp-bar" data-bar="${n}" style="height:0"></div></div>
            <div class="sp-btns">
              <button class="sp-btn" data-dec="${n}">−</button>
              <button class="sp-btn" data-inc="${n}">+</button>
            </div>
            <div class="sp-label">${n}<br>${SP_LABELS[n - 1]}</div>
          </div>`;
      }).join('');

      ctx.set(`
        <div class="stack gap-sm mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">02 / 想象</div>
          <p class="sp-ask anim" style="--d:.1s">睁开眼睛。刚才那个画面，有多清楚？</p>
          <div id="spBoard">${cols}</div>
          <p class="small faint anim fade" style="--d:.8s">
            报一个数 —— 对着你刚才真的看见（或没看见）的东西。按 R 清零重来。
          </p>
        </div>
      `);

      var board = ctx.q('#spBoard');
      var redraw = function () {
        var max = Math.max(1, SP[1], SP[2], SP[3], SP[4], SP[5]);
        [1, 2, 3, 4, 5].forEach(function (n) {
          board.querySelector('[data-count="' + n + '"]').textContent = SP[n];
          board.querySelector('[data-bar="' + n + '"]').style.height =
            (SP[n] / max * 100) + '%';
        });
      };

      ctx.on(board, 'click', function (e) {
        var t = e.target;
        if (t.dataset.inc) { SP[+t.dataset.inc]++; redraw(); }
        else if (t.dataset.dec) { SP[+t.dataset.dec] = Math.max(0, SP[+t.dataset.dec] - 1); redraw(); }
      });

      /* R = 清零。讲者如果这一场投了两次（讲完心盲再投一次），用得上。 */
      var onKey = function (e) {
        if (e.key === 'r' || e.key === 'R') {
          SP = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }; redraw();
        }
      };
      window.addEventListener('keydown', onKey);

      redraw();
      return function () { window.removeEventListener('keydown', onKey); };
    },

    /* ---- 2.2 把"2–4%"变成这个房间里的一件事实 ---- */
    function (ctx) {
      var zero = SP[1];
      var total = SP[1] + SP[2] + SP[3] + SP[4] + SP[5];

      /* 没投过票（排练时按快了）就降级成一句话，不要显示"0 个人" */
      var line = (total >= 5 && zero > 0)
        ? '刚才，这个房间里有 <b style="color:var(--mx-yellow)">' + zero + '</b> 个人，' +
          '什么也没有看见。'
        : '这条谱上，有人落在最左边。';

      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">02 / 想象</div>
          <h2 class="sp-ask anim" style="--d:.1s;max-width:70vw">${line}</h2>
          <p class="step" style="font-size:var(--fs-subtitle);line-height:1.6;
             max-width:60vw;text-align:center;color:var(--text-secondary)">
            他们知道苹果长什么样，一眼就能认出，也画得出来 ——<br>
            只是闭上眼，没有画面。
          </p>
          <p class="step" style="font-size:var(--fs-subtitle);line-height:1.6;
             max-width:60vw;text-align:center">
            这不是"想象力弱"。<br>
            这是<b class="c-orange">另一种拥有心灵的方式</b>。
          </p>
        </div>
      `);
      ctx.steps();
    },

  ],
});
