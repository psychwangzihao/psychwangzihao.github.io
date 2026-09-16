/* ============================================================
   场景 3：心盲  (id: aphantasia · 3 个状态)

   上一幕把房间投成了一条谱。这一幕要说的是谱最左端那些人。

   口径和高中那版完全不同：
     - 高中版的重点是「原来每个人不一样」的惊奇
     - 这一版的重点是 **这不是缺陷，是一种不同的意识形态**
   而且讲者本人就属于这里 —— 由他亲口说，比屏幕上任何一页数据都重。

   视觉极简：这一幕不需要新的图形，前面两张图已经把话说完了。
   ============================================================ */
PERCEPTION.css('scene-aphantasia', `
#aphNum{
  font-family:var(--font-mono);font-weight:var(--fw-bold);
  font-size:calc(var(--fs-hero) * 1.5);line-height:1;
  letter-spacing:.02em;color:var(--mx-yellow);
}
.aph-say{
  font-size:var(--fs-title);font-weight:var(--fw-bold);
  line-height:1.45;text-align:center;max-width:74vw;
}
.aph-line{
  font-size:var(--fs-subtitle);line-height:1.7;
  text-align:center;max-width:62vw;color:var(--text-secondary);
}
.aph-line.hi{color:var(--text-primary);}
`);

PERCEPTION.scene({
  id: 'aphantasia',
  label: '心盲',
  dark: true,
  states: [

    /* ---- 3.0 那条谱最左端，有多宽 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">03 / 心盲</div>
          <div id="aphNum" class="anim" style="--d:.15s">2&ndash;4%</div>
          <p class="step aph-line">
            一个四十人的房间，大概有一个。<br>
            散场以后你问他，他会说：我知道苹果长什么样。
          </p>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 3.1 讲者本人 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">03 / 心盲</div>
          <h2 class="aph-say anim" style="--d:.15s">
            我属于那里。
          </h2>
          <div class="aph-line step">我知道苹果长什么样。我一眼认得出，也画得出来。</div>
          <div class="aph-line step hi">但闭上眼，什么都没有。</div>
          <div class="aph-line step">可我做梦的时候，能看到画面。</div>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 3.2 重新说一遍这件事 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">03 / 心盲</div>
          <p class="aph-say anim" style="--d:.15s;color:var(--text-secondary)">
            这不是「想象力弱」。<br>
            这是<b style="color:var(--mx-blue)">另一种拥有心灵的方式</b>。
          </p>
          <div class="mx-rule anim fade" style="--d:.5s;width:14vw"></div>
          <p class="step aph-line hi" style="max-width:66vw">
            而且它是我理解你们每一个人的仪器。<br>
            一个不会自动生成画面的脑子，正好把「画面是生成出来的」这件事显出来了。
          </p>
        </div>
      `);
      ctx.steps();
    },

  ],
});
