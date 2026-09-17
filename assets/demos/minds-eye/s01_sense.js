/* ============================================================
   场景 1：感知是什么  (id: sense · 3 个状态)

   ⚠️ 写这一场的规矩（用户 2026-09-16 定，全场通用）：
      **屏幕上不放句子。只放名词、数字、图。解释全部由讲者说。**
      这个 demo 不需要别人自己看懂 —— 它必须搭配讲解。
      所以：能删的字一律删；一屏只有三四个词条是正常的。

   不要因为"看起来太空"就往里加字。空是对的。
   ============================================================ */
PERCEPTION.css('scene-sense', `
#emBar{
  position:relative;width:72vw;height:5.4vw;
  display:flex;border:1px solid var(--rule);
}
#emBar > i{flex:1;height:100%;display:block;}
#emMark{position:relative;width:72vw;height:5vw;margin-top:.4vw;}
.em-pt{position:absolute;top:0;display:flex;flex-direction:column;align-items:center;}
.em-pt u{
  text-decoration:none;font-family:var(--font-mono);font-size:var(--fs-tiny);
  color:var(--text-tertiary);letter-spacing:.14em;
}
.em-pt b{font-size:var(--fs-body);font-weight:var(--fw-bold);margin-top:.2vw;}
.em-pt::before{
  content:'';width:1px;height:1.1vw;background:var(--text-tertiary);
  order:-1;margin-bottom:.3vw;
}
#senseBig{
  font-family:var(--font-mono);font-weight:var(--fw-bold);
  font-size:calc(var(--fs-hero) * 1.15);line-height:1.1;
  letter-spacing:.02em;color:var(--mx-yellow);
}
`);

PERCEPTION.scene({
  id: 'sense',
  label: '感知是什么',
  dark: true,
  states: [

    /* ---- 1.0 就一个数字 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">01 / 感知</div>
          <div id="senseBig" class="anim" style="--d:.15s">380–750 nm</div>
        </div>
      `);
    },

    /* ---- 1.1 量程（只有名词和数字） ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">01 / 感知</div>
          <div class="doc-terms kv" style="width:42vw">
            <div class="anim" style="--d:.12s"><span>视觉</span><i>380–750 nm</i></div>
            <div class="anim" style="--d:.24s"><span>听觉</span><i>20–20000 Hz</i></div>
            <div class="anim" style="--d:.36s"><span>触觉</span><i>2–3 mm</i></div>
            <div class="anim" style="--d:.48s"><span>味觉</span><i>5</i></div>
          </div>
        </div>
      `);
    },

    /* ---- 1.2 只有那张谱 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">01 / 感知</div>

          <div id="emBar" class="anim fade" style="--d:.25s">
            <i style="background:#2A2A31"></i>
            <i style="background:#33333C"></i>
            <i style="background:#6B2E2E"></i>
            <i style="background:#FFCD00"></i>
            <i style="background:#5A41B4"></i>
            <i style="background:#2A2A31"></i>
            <i style="background:#33333C"></i>
          </div>
          <div id="emMark" class="anim fade" style="--d:.35s">
            <div class="em-pt" style="left:26%;transform:translateX(-50%)">
              <u>红外</u><b style="color:var(--mx-cream)">蛇</b>
            </div>
            <div class="em-pt" style="left:50%;transform:translateX(-50%)">
              <u>可见光</u><b style="color:var(--mx-yellow)">人</b>
            </div>
            <div class="em-pt" style="left:70%;transform:translateX(-50%)">
              <u>紫外</u><b style="color:var(--mx-purple-lit)">蜜蜂</b>
            </div>
          </div>
        </div>
      `);
    },

  ],
});
