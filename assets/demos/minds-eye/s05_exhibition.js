/* ============================================================
   场景 5：展览  (id: exhibition · 4 个状态)

   收尾，也是这一场分享真正的目的：
   和国美一起做一场展 —— **共同布展，也用这些研究做作品**。

   所以收尾不是"期待合作"，是三件**具体能一起做的事**。
   有具体的东西，对话才是平的。

   按用户的交代：**这一段只说展览，不说招募被试**。
   二维码是给这场展的。

   ⚠️ 现场没有鼠标：二维码只是给人扫的，讲者不需要点它。
   ============================================================ */
PERCEPTION.css('scene-exhibition', `
.ex-big{
  font-size:var(--fs-title);font-weight:var(--fw-bold);
  line-height:1.5;text-align:center;max-width:74vw;
}
.ex-line{
  font-size:var(--fs-subtitle);line-height:1.65;
  text-align:center;max-width:60vw;color:var(--text-secondary);
}
/* 三支柱：横排，每根一个方块 */
#exPillars{display:flex;gap:2.6vw;justify-content:center;align-items:flex-start;}
.ex-pillar{width:17vw;display:flex;flex-direction:column;gap:.7vw;align-items:center;}
.ex-pillar i{display:block;width:100%;height:.5vw;}
.ex-pillar b{font-size:var(--fs-body);font-weight:var(--fw-bold);}
.ex-pillar span{font-size:var(--fs-tiny);color:var(--text-tertiary);line-height:1.5;text-align:center;}

/* 三件能一起做的事 */
#exDo{display:flex;flex-direction:column;gap:1.5vw;width:64vw;text-align:left;}
.ex-do{display:flex;gap:1.4vw;align-items:baseline;}
.ex-do em{
  font-family:var(--font-mono);font-style:normal;font-weight:var(--fw-bold);
  font-size:var(--fs-body);color:var(--mx-yellow);flex:none;
}
.ex-do div{font-size:var(--fs-body);line-height:1.6;}
.ex-do div small{display:block;color:var(--text-tertiary);font-size:var(--fs-small);margin-top:.25vw;}

/* 二维码：圆角已经切在 PNG 的白卡上，这里不要再动 */
#exQr{height:37vh;width:auto;display:block;}
.ex-cap{font-size:var(--fs-small);color:var(--text-tertiary);letter-spacing:.06em;}
`);

PERCEPTION.scene({
  id: 'exhibition',
  label: '展览',
  dark: true,
  states: [

    /* ---- 5.0 从那个问题，到一场展 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">05 / 展览</div>
          <h2 class="ex-big anim" style="--d:.15s">
            刚才那个问题，我不想只在这里回答它。
          </h2>
          <p class="step ex-line">所以我们准备做一场展。</p>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 5.1 三支柱 + 和谁一起 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">05 / 展览</div>
          <div id="exPillars" class="anim" style="--d:.1s">
            <div class="ex-pillar">
              <i style="background:var(--mx-blue)"></i>
              <b>神经科学的证据</b><span>脑与行为上，确实测得到的东西</span>
            </div>
            <div class="ex-pillar">
              <i style="background:var(--mx-cream)"></i>
              <b>现象学的悬置</b><span>先把"我知道"放下来，只描述经验本身</span>
            </div>
            <div class="ex-pillar">
              <i style="background:var(--mx-yellow)"></i>
              <b>艺术的转译</b><span>让"缺席"变成能被看见、被走进去的东西</span>
            </div>
          </div>
          <p class="step ex-line">
            和中国美术学院跨媒体艺术学院、浙江大学一起。<br>
            <span style="color:var(--text-primary)">共同布展，也可以用这些研究做作品。</span>
          </p>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 5.2 三件具体能一起做的事 ----
       收尾要给具体的东西，不能只说"期待合作"。
       有具体的东西，对话才是平的。 */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">05 / 展览</div>
          <div id="exDo">
            <div class="ex-do step">
              <em>01</em>
              <div>门口不是入口，是仪器。
                <small>每个观众的一次作答，当场长进门厅那面墙里。展期结束时，那面墙是这座城市三个月的记录。</small>
              </div>
            </div>
            <div class="ex-do step">
              <em>02</em>
              <div>作品旁边挂的不是说明牌。
                <small>是这件作品对观众做了什么 —— 实测的分布。作品和它的接受，是两件展品。</small>
              </div>
            </div>
            <div class="ex-do step">
              <em>03</em>
              <div>一间不含任何图像的展厅。
                <small>它被设计给不使用心理意象的人。走进去，看谁觉得空。</small>
              </div>
            </div>
          </div>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 5.3 二维码 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">05 / 展览</div>
          <h2 class="ex-big anim" style="--d:.1s">想一起做这场展的，扫码找我。</h2>
          <img id="exQr" class="anim fade" style="--d:.3s" src="./media/qr-wechat.png" alt="微信二维码">
          <p class="ex-cap anim fade" style="--d:.6s">关于这场展览，从这儿开始聊。</p>
        </div>
      `);
    },

  ],
});
