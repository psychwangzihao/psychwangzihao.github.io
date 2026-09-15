/* ============================================================
 * 场景：心在哪里  (id: mind · 2 个状态)
 * 位置：心盲之后、大脑之前。
 *
 * 这一幕是一个「转折」：前面三幕已经让观众相信「世界在我心中」，
 * 这里把问题收成一句话 —— 那个在感受、在想象、在决定的东西，
 * 到底在哪里？然后引到大脑。
 *
 * 中文的「心」正好一语双关：我们说「心里想」「心里难受」，
 * 但解剖学上，胸口那个心不负责这些。这个双关是这一幕的支点。
 * ============================================================ */
PERCEPTION.scene({
  id: 'mind',
  label: '心在哪里',
  states: [

    /* ---- 0：先顺着日常语言问一句 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-xl" style="max-width:72vw">
          <h1 class="title center anim" style="--d:0s">
            我们都说「<b class="c-pink">心里</b>想」、「<b class="c-pink">心里</b>难受」。
          </h1>

          <h1 class="hero center anim" style="--d:1s">
            可是 —— 心，真的在<b class="c-pink">胸口</b>吗？
          </h1>
        </div>
      `);
    },

    /* ---- 1：给出答案，并把它指到大脑上 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg" style="max-width:72vw">
          <h1 class="title center anim fade" style="--d:0s;color:var(--text-secondary)">
            不在胸口。
          </h1>

          <div class="step stack gap-sm" style="align-items:center">
            <div class="hero center" style="color:var(--accent-purple)">它在这里。</div>
            <div class="body center muted" style="max-width:52vw">
              那个在感受、在想象、在下决心的东西，
              是一堆细胞用电流和化学物质互相说话的结果。
            </div>
          </div>

          <div class="step subtitle center" style="color:var(--accent-blue)">
            接下来，我们就去看看这个器官。
          </div>
        </div>
      `);
      ctx.steps();
    },

  ],
});
