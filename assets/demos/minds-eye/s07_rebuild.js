/* ============================================================
   场景 7：感知可以被重建  (id: rebuild · 3 个状态)

   上一幕说"参数可以练"。这一幕更进一步：**通道本身可以被换掉。**

   这一块对艺术最要紧 —— 它证明「感官」不是给定的硬件，
   而是一个可以重新接线的接口。后面"回到艺术"那一幕就架在这上面。

   注意分寸：感官替代是真的能用的（有人真的靠舌头上的电极阵列读字），
   但需要长期训练。不要写成科幻。
   ============================================================ */
PERCEPTION.scene({
  id: 'rebuild',
  label: '重建',
  dark: true,
  states: [

    /* ---- 7.0 换一条通道，照样能"看" ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">07 / 重建</div>
          <div class="doc-terms art" style="width:56vw">
            <div class="anim" style="--d:.12s">舌上电极</div>
            <div class="anim" style="--d:.24s">振动背心</div>
          </div>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 7.1 直接换硬件 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">07 / 重建</div>
          <div class="doc-terms art" style="width:56vw">
            <div class="anim" style="--d:.12s">人工耳蜗</div>
            <div class="anim" style="--d:.24s">视网膜假体</div>
            <div class="anim" style="--d:.36s">人工前庭</div>
          </div>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 7.2 机制 + 落点 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-md mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">07 / 重建</div>
          <h2 class="doc-lead anim" style="--d:.15s">
            大脑不检查来源。<br>它只找规律。
          </h2>
        </div>
      `);
      ctx.steps();
    },

  ],
});
