/* ============================================================
 * 场景：窗口有多窄  (id: window · 2 个状态)
 * 电磁波谱是**现场画出来的**，不是插图 —— 人占的那一段，
 * 放在整条谱上就是这么细的一条缝。
 * 三个标记是三种生物的窗口，谁也不比谁更"全"。
 * ============================================================ */
PERCEPTION.css('scene-window', `
#pwSpec{
  width:78vw;max-width:1520px;height:auto;display:block;
  border-radius:var(--radius-md);box-shadow:var(--shadow-md);
}
#pwEar{width:66vw;display:flex;flex-direction:column;gap:var(--space-sm);}
#pwEar .r{display:flex;align-items:center;gap:var(--space-md);}
#pwEar .nm{width:7em;text-align:right;font-size:var(--fs-small);color:var(--text-secondary);flex:none;}
#pwEar .track{flex:1;height:1.2vw;min-height:14px;background:var(--bg-secondary);
              border-radius:var(--radius-full);position:relative;overflow:hidden;}
#pwEar .track i{position:absolute;top:0;bottom:0;display:block;border-radius:var(--radius-full);}
#pwEar .val{width:11em;font-family:var(--font-mono);font-size:var(--fs-tiny);
            color:var(--text-tertiary);flex:none;}
`);

PERCEPTION.scene({
  id: 'window',
  label: '窗口有多窄',
  part: '人如何感',
  dark: false,
  states: [

    /* ---- 视觉：一条缝 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg">
          <canvas id="pwSpec" class="anim" style="--d:0s" width="1520" height="380"></canvas>
        </div>
      `);
      var cv = ctx.q('#pwSpec');
      var src = PZ.spectrum(1520, 380, [
        { at: 0.86, who: '蛇',   label: '红外',   color: '#E8834A' },
        { at: 0.62, who: '人',   label: '可见光', color: '#4A90D9' },
        { at: 0.47, who: '蜜蜂', label: '紫外',   color: '#8B7EC8' }
      ]);
      cv.getContext('2d').drawImage(src, 0, 0);
    },

    /* ---- 耳朵也一样窄 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-xl">
          <div id="pwEar">
            <div class="r anim" style="--d:.15s">
              <span class="nm">人</span>
              <span class="track"><i style="left:18%;width:62%;background:var(--accent-blue)"></i></span>
              <span class="val">20 Hz – 20 kHz</span>
            </div>
            <div class="r anim" style="--d:.3s">
              <span class="nm">蝙蝠</span>
              <span class="track"><i style="left:74%;width:24%;background:var(--accent-purple)"></i></span>
              <span class="val">超声</span>
            </div>
            <div class="r anim" style="--d:.45s">
              <span class="nm">大象</span>
              <span class="track"><i style="left:0%;width:16%;background:var(--accent-green)"></i></span>
              <span class="val">次声</span>
            </div>
          </div>
        </div>
      `);
    },

  ],
});
