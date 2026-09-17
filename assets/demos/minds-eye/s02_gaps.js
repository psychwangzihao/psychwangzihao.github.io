/* ============================================================
   场景 2：不完备  (id: gaps · 4 个状态)

   规矩同 s01：只有名词、数字、和两句必须照着做的动作。

   2.0 是全场当场做盲点。**步骤要留在屏幕上**（有人会漏听），
   但压到两句 —— 多说一个字都是在替讲者说话。
   ============================================================ */
PERCEPTION.scene({
  id: 'gaps',
  label: '不完备',
  dark: true,
  states: [

    /* ---- 2.0 现场做盲点 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">02 / 不完备</div>
          <h2 class="doc-lead anim" style="--d:.15s">闭上一只眼。</h2>
          <div class="doc-terms gaps" style="width:56vw">
            <div class="step">两个拇指，手臂伸直，相距约 20 cm</div>
            <div class="step">右眼看左拇指，把右拇指往右移</div>
          </div>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 2.1 视野 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">02 / 不完备</div>
          <div class="doc-terms gaps" style="width:52vw">
            <div class="anim" style="--d:.12s">中央 2°</div>
            <div class="anim" style="--d:.24s">眼跳</div>
            <div class="anim" style="--d:.36s">变化盲视</div>
          </div>
        </div>
      `);
    },

    /* ---- 2.2 其他通道 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">02 / 不完备</div>
          <div class="doc-terms gaps" style="width:52vw">
            <div class="anim" style="--d:.12s">掩蔽</div>
            <div class="anim" style="--d:.24s">两点阈</div>
            <div class="anim" style="--d:.36s">嗅觉适应</div>
          </div>
        </div>
      `);
    },

    /* ---- 2.3 没有的通道 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">02 / 不完备</div>
          <div class="doc-terms kv gaps" style="width:42vw">
            <div class="anim" style="--d:.12s"><span>电感受</span><i>鲨鱼</i></div>
            <div class="anim" style="--d:.24s"><span>磁感</span><i>候鸟</i></div>
            <div class="anim" style="--d:.36s"><span>偏振光</span><i>蚂蚁</i></div>
          </div>
        </div>
      `);
    },

  ],
});
