/* ============================================================
 * 场景 12：下课  (id: curtain · 1 个状态)
 * 门从两侧合拢，回到开场那块校徽门牌 —— 首尾同一个画面。
 * 原来「求索卡」那一幕的收尾话放在这里（二维码和纸质卡片已去掉）。
 * ============================================================ */
PERCEPTION.css('scene-curtain', `
/* z-index 必须高过幕布（.door 是 20），否则落在门板后面看不见 */
.curtain-sign{
  position:absolute;left:0;right:0;bottom:7vh;text-align:center;z-index:30;
  font-size:var(--fs-small);color:rgba(255,255,255,.5);letter-spacing:.18em;
  opacity:0;transition:opacity 1s var(--ease-out) 1.6s;
}
.curtain-sign.on{opacity:1;}
`);

PERCEPTION.scene({
  id: 'curtain',
  label: '下课',
  states: [

    function (ctx) {
      /* 门一开始是开的（接着上一幕的亮屏），然后缓缓合上 */
      ctx.set(
        DOOR.html({ open: true, note: '有问题，来教室外面找我。' }) +
        '<div class="curtain-sign" id="curtainSign">浙江大学心理与行为科学系 · 王梓豪</div>'
      );

      DOOR.close(ctx, 900);
      ctx.after(1600, function () { ctx.q('#curtainSign').classList.add('on'); });
    },

  ],
});
