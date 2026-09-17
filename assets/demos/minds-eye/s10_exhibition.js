/* ============================================================
   场景 10：展览  (id: exhibition · 2 个状态)

   收尾。前面九幕把科学讲完了，这里才说"所以我想做一件更大的事"。

   ⚠️ 顺序很要紧：**先有科学，再有展览。** 上一版把展览放在科学之前讲，
      结果整场空掉了 —— 那几件"能一起做的事"没有底下的八幕撑着，就是口号。

   按用户的交代：这一段只说展览，不说招募被试。
   ============================================================ */
PERCEPTION.css('scene-exhibition', `
#exPillars{display:flex;gap:2.6vw;justify-content:center;align-items:flex-start;}
.ex-pillar{width:17vw;display:flex;flex-direction:column;gap:.6vw;align-items:center;}
.ex-pillar i{display:block;width:100%;height:.5vw;}
.ex-pillar b{font-size:var(--fs-body);font-weight:var(--fw-bold);}
.ex-pillar span{font-size:var(--fs-tiny);color:var(--text-tertiary);line-height:1.5;text-align:center;}
#exQr{height:37vh;width:auto;display:block;}
`);

PERCEPTION.scene({
  id: 'exhibition',
  label: '展览',
  dark: true,
  states: [

    /* ---- 10.0 从问题，到一场展 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">10 / 展览</div>
          <h2 class="doc-lead anim" style="--d:.1s">
            我想把刚才那个问题，做成一场展。
          </h2>
          <div id="exPillars" class="anim" style="--d:.3s">
            <div class="ex-pillar">
              <i style="background:var(--mx-blue)"></i>
              <b>神经科学的证据</b><span>脑与行为上，确实测得到的东西</span>
            </div>
            <div class="ex-pillar">
              <i style="background:var(--mx-cream)"></i>
              <b>现象学的悬置</b><span>先把「我知道」放下来，只描述经验本身</span>
            </div>
            <div class="ex-pillar">
              <i style="background:var(--mx-yellow)"></i>
              <b>艺术的转译</b><span>让「缺席」变成能被走进去的东西</span>
            </div>
          </div>
          <p class="step doc-body hi">中国美术学院跨媒体艺术学院 · 浙江大学</p>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 10.1 二维码 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">10 / 展览</div>
          <h2 class="doc-lead anim" style="--d:.1s">想一起做这场展的，扫码找我。</h2>
          <img id="exQr" class="anim fade" style="--d:.3s" src="./media/qr-wechat.png" alt="微信二维码">
        </div>
      `);
    },

  ],
});
