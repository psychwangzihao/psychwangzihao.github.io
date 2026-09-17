/* ============================================================
   场景 4：想象  (id: imagine · 4 个状态)

   规矩同 s01。四张模态卡只留"名字"，不留解释。

   4.2 是这一幕真正要破的东西：**心的眼睛只是四个模态之一。**
   标题是「心的眼睛」，但不破这一下，整场就变成一场关于视觉的分享。
   ============================================================ */
PERCEPTION.css('scene-imagine', `
#imMods{display:flex;gap:2vw;justify-content:center;width:100%;}
.im-mod{
  width:15vw;display:flex;flex-direction:column;gap:.6vw;
  border-top:.35vw solid var(--mx-blue);padding-top:.9vw;
}
.im-mod u{
  text-decoration:none;font-family:var(--font-mono);font-size:var(--fs-tiny);
  color:var(--text-tertiary);letter-spacing:.16em;
}
.im-mod b{font-size:var(--fs-subtitle);font-weight:var(--fw-bold);line-height:1.3;}
`);

PERCEPTION.scene({
  id: 'imagine',
  label: '想象',
  dark: true,
  states: [

    /* ---- 4.0 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">04 / 想象</div>
          <div class="doc-terms" style="width:52vw">
            <div class="anim" style="--d:.12s">心理扫描</div>
            <div class="anim" style="--d:.24s">心理旋转</div>
          </div>
        </div>
      `);
    },

    /* ---- 4.1 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">04 / 想象</div>
          <div class="doc-terms" style="width:52vw">
            <div class="anim" style="--d:.12s">瞳孔</div>
            <div class="anim" style="--d:.24s">心率</div>
            <div class="anim" style="--d:.36s">运动想象</div>
          </div>
        </div>
      `);
    },

    /* ---- 4.2 四个模态 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-xl mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">04 / 想象</div>
          <div id="imMods">
            <div class="im-mod anim" style="--d:.15s">
              <u>心的眼睛</u><b>视觉意象</b>
            </div>
            <div class="im-mod anim" style="--d:.27s">
              <u>心的耳朵</u><b>内语</b>
            </div>
            <div class="im-mod anim" style="--d:.39s">
              <u>心的手</u><b>运动想象</b>
            </div>
            <div class="im-mod anim" style="--d:.51s">
              <u>心的鼻子与皮肤</u><b>嗅、味、触</b>
            </div>
          </div>
        </div>
      `);
    },

    /* ---- 4.3 四个是分开的 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-xl mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">04 / 想象</div>
          <div class="doc-terms" style="width:52vw;gap:1.8vw">
            <div class="anim" style="--d:.12s">有人没有画面，但有声音</div>
            <div class="anim" style="--d:.26s">有人画面极清楚，没有声音</div>
          </div>
        </div>
      `);
    },

  ],
});
