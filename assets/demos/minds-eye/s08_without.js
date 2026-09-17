/* ============================================================
   场景 8：不需要输入的感知  (id: without · 3 个状态)

   规矩同 s01：只有词条。

   这一幕是第三幕（脑补）的反面证明 —— 输入完全没有，感知照样发生。
   三个现象名本身就是内容；背后那一层"这说明什么"，由讲者说。
   ============================================================ */
PERCEPTION.scene({
  id: 'without',
  label: '不需要输入',
  dark: true,
  states: [

    /* ---- 8.0 输入断了 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">08 / 不需要输入</div>
          <div class="doc-terms" style="width:56vw">
            <div class="anim" style="--d:.12s">查尔斯·邦奈综合征</div>
            <div class="anim" style="--d:.24s">音乐耳综合征</div>
          </div>
        </div>
      `);
    },

    /* ---- 8.1 梦 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">08 / 不需要输入</div>
          <div class="doc-terms" style="width:56vw">
            <div class="anim" style="--d:.12s">梦</div>
            <div class="anim" style="--d:.24s">清醒梦</div>
          </div>
        </div>
      `);
    },

    /* ---- 8.2 幻肢 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">08 / 不需要输入</div>
          <div class="doc-terms" style="width:56vw">
            <div class="anim" style="--d:.12s">幻肢</div>
            <div class="anim" style="--d:.24s">镜子疗法</div>
          </div>
        </div>
      `);
    },

  ],
});
