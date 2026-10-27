/* ============================================================
 * 场景：收  (id: end · 3 个状态)
 *
 * 1 是全场唯一一处把结论放上屏幕的地方 —— 因为那三种情境本身
 * 是分享者的论述，不是实验结果，摊开来观众才知道差别在哪。
 *
 * 2 收。只放「谢谢大家」和二维码 —— 不解释。
 * ============================================================ */
PERCEPTION.css('scene-end', `
#seTbl{width:62vw;display:flex;flex-direction:column;gap:var(--space-sm);}
#seTbl .r{
  display:flex;align-items:center;gap:var(--space-lg);
  border-left:4px solid var(--border-subtle);
  padding:var(--space-xs) 0 var(--space-xs) var(--space-md);
}
#seTbl .r.a{border-left-color:var(--accent-orange);}
#seTbl .r.b{border-left-color:var(--accent-blue);}
#seTbl .r.c{border-left-color:var(--accent-purple);}
#seTbl .k{font-family:var(--font-mono);font-size:var(--fs-small);
          letter-spacing:.24em;color:var(--text-tertiary);width:1.6em;flex:none;}
#seTbl .w{font-size:var(--fs-subtitle);color:var(--text-secondary);flex:1;}
#seTbl .v{font-family:var(--font-mono);font-size:var(--fs-small);white-space:nowrap;}
#seTbl .v.a{color:var(--accent-orange);}
#seTbl .r.b .v{color:var(--accent-blue);}
#seTbl .r.c .v{color:var(--accent-purple);}
#seQ{font-size:var(--fs-title);font-weight:var(--fw-bold);line-height:1.5;
     text-align:center;max-width:70vw;}
#seQ em{font-style:normal;color:var(--accent-orange);}
#seQR{width:14vw;max-width:210px;display:block;border-radius:var(--radius-md);}
`);

PERCEPTION.scene({
  id: 'end',
  label: '收',
  part: '收',
  dark: false,
  states: [

    /* ---- 三种审美 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg">
          <div class="title anim" style="--d:0s">审美与感知</div>
          <div id="seTbl">
            <div class="r a anim" style="--d:.15s">
              <span class="k">A</span><span class="w">自然 · 摩天大楼</span><span class="v a">只有感</span>
            </div>
            <div class="r b anim" style="--d:.3s">
              <span class="k">B</span><span class="w">画 + 解读</span><span class="v">感 + 知</span>
            </div>
            <div class="r c anim" style="--d:.45s">
              <span class="k">C</span><span class="w">文字</span><span class="v">感 → 知 → 感</span>
            </div>
          </div>
        </div>
      `);
    },

    /* ---- 收：只有一句谢和一个码 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg">
          <div class="hero anim" style="--d:0s">谢谢大家</div>
          <img id="seQR" class="anim" style="--d:.25s" src="./media/qr-wechat.png" alt="微信">
        </div>
      `);
    },

  ],
});
