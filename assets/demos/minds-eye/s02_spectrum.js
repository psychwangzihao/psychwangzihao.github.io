/* ============================================================
   场景 2：想象光谱  (id: spectrum · 3 个状态)

   全场的高点。前面讲的是「有输入时大脑在补」，这里第一次把输入拿掉。

   关键设计：**不问「能不能看见」，问「有多清楚，报个数」。**
   - 二分的问题只会得到「大部分人都举手」，然后场面僵住
   - 五点量表会得到一条**分布**，而分布里必然有一些人落在最左端
   - 于是「心盲症 2–4%」从一个统计数字，变成这个房间里的一件事实

   ⚠️ **现场没有鼠标**，所以计数完全走键盘：
       1–5        = 给对应那一档加一个人
       0 / 删除键 = 撤回（减掉最近记的那一档）
       R          = 清零
   屏幕上那排 ± 按钮已经去掉了 —— 摆一排按钮会像网页表单，
   而这一幕应该像一件装置。按键提示做得很小很暗，观众基本不会注意。

   按 1 就加 1 分、按 3 就加 3 分，是最直接的映射：
   讲者举一次手就按一下，不用先选列再按加号。
   ============================================================ */
PERCEPTION.css('scene-spectrum', `
#spBoard{
  display:flex;align-items:flex-end;justify-content:center;
  gap:2.4vw;width:100%;margin-top:var(--space-md);
}
.sp-col{display:flex;flex-direction:column;align-items:center;gap:.7vw;width:11.5vw;}
.sp-num{
  font-family:var(--font-mono);font-size:var(--fs-subtitle);
  font-weight:var(--fw-bold);line-height:1;
  transition:color var(--dur-fast) var(--ease-out);
}
.sp-bar-wrap{
  width:100%;height:28vh;display:flex;align-items:flex-end;
  border-bottom:1px solid var(--rule);
}
.sp-bar{
  width:100%;background:var(--mx-blue);
  transition:height var(--dur-slow) var(--ease-out);min-height:2px;
}
/* 最左那一格是这一屏真正要说的话，单独给颜色 */
.sp-col.zero .sp-bar{background:var(--mx-yellow);}
/* 最近记的那一档亮一下：讲者一眼知道下一次「撤回」减的是谁 */
.sp-col.last .sp-num{color:var(--mx-yellow);}
.sp-label{
  font-size:var(--fs-tiny);color:var(--text-tertiary);
  text-align:center;line-height:1.35;height:3.2em;
}
.sp-ask{
  font-size:var(--fs-title);font-weight:var(--fw-bold);line-height:1.4;
  text-align:center;
}
.sp-keys{
  font-family:var(--font-mono);font-size:var(--fs-tiny);
  letter-spacing:.18em;color:var(--text-tertiary);opacity:.55;text-align:center;
}
`);

/* 五点，从「什么都没有」到「像照片一样」。
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
            —— 反着说，是为了逼出真实的画面，而不是「苹果」这个概念。
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
            <div class="sp-label">${n} &nbsp;${SP_LABELS[n - 1]}</div>
          </div>`;
      }).join('');

      ctx.set(`
        <div class="stack gap-sm mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">02 / 想象</div>
          <p class="sp-ask anim" style="--d:.1s">睁开眼睛。刚才那个画面，有多清楚？</p>
          <div id="spBoard">${cols}</div>
          <p class="sp-keys anim fade" style="--d:.9s">1–5 记数 · 0 撤回 · R 清零</p>
        </div>
      `);

      var board = ctx.q('#spBoard');
      var last = 0;

      function redraw() {
        var max = Math.max(1, SP[1], SP[2], SP[3], SP[4], SP[5]);
        [1, 2, 3, 4, 5].forEach(function (n) {
          board.querySelector('[data-count="' + n + '"]').textContent = SP[n];
          board.querySelector('[data-bar="' + n + '"]').style.height = (SP[n] / max * 100) + '%';
          board.querySelector('[data-n="' + n + '"]').classList.toggle('last', n === last);
        });
      }

      /* 键盘计数。挂 PERCEPTION.keyHook，而不是自己监听 window ——
         core 的翻页键（翻页笔的 ↑↓ / PageUp / PageDown / 空格）不能被抢走。 */
      PERCEPTION.keyHook = function (k) {
        if (k >= '1' && k <= '5') { SP[+k]++; last = +k; redraw(); return true; }
        if (k === '0' || k === 'Backspace') {
          if (last) { SP[last] = Math.max(0, SP[last] - 1); redraw(); }
          return true;
        }
        if (k === 'r' || k === 'R') {
          SP = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }; last = 0; redraw(); return true;
        }
        return false;
      };

      redraw();
      return function () { PERCEPTION.keyHook = null; };
    },

    /* ---- 2.2 把「2–4%」变成这个房间里的一件事实 ---- */
    function (ctx) {
      var zero = SP[1];
      var total = SP[1] + SP[2] + SP[3] + SP[4] + SP[5];

      /* 没记过数（排练时按快了）就降级成一句话，不要显示「0 个人」 */
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
            这条谱上，每个人都在某个位置。<br>
            包括那些落在最左边的人。
          </p>
        </div>
      `);
      ctx.steps();
    },

  ],
});
