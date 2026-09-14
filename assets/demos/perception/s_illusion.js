/* ============================================================
 * 场景：大小错觉（冷开场）  (id: illusion · 2 个状态)
 *
 * 位置：紧接着开幕，在「树倒悖论」之前。
 *
 * 为什么放在最前面：一场讲座的头 60 秒决定后面 40 分钟。
 * 与其先讲道理，不如先让全场亲眼看到自己的眼睛在骗自己。
 *
 * ⚠️ 换成艾宾浩斯错觉的理由（原来用的是闪烁网格）：
 *   闪烁网格属于「周边视觉」类错觉 —— 必须盯着中间不动、
 *   让图案落在视野边缘才看得到，对屏幕对比度、观看距离、
 *   圆点与格子的比例都很敏感。老师和学生都反映看不出来。
 *   艾宾浩斯错觉是「中央视觉」类：盯着看就行，任何屏幕、
 *   任何距离都成立，不可能失败。冷开场不能有失败的可能。
 *
 * 这一屏的第二拍才是重点：**知道真相，并不能让错觉消失**。
 * 全场已经知道两个圆一样大了，再看一眼，它们还是不一样大。
 * 这就是后面「科学不是猜，是测量」的种子。
 * ============================================================ */
PERCEPTION.css('scene-illusion', `
#ebWrap{
  display:flex;align-items:center;justify-content:center;
  gap:3.5vw;width:100%;margin:var(--space-md) 0;
}
.eb-group{position:relative;width:min(26vw,42vh);height:min(26vw,42vh);}
.eb-group svg{display:block;width:100%;height:100%;overflow:visible;}

/* 揭晓时压上去的那两个「一模一样的圆」 */
.eb-proof{
  fill:none;stroke:var(--accent-orange);stroke-width:4;
  stroke-dasharray:460;stroke-dashoffset:460;
  transition:stroke-dashoffset 1.1s var(--ease-out);
}
.eb-proof.on{stroke-dashoffset:0;}

.il-q{
  font-size:var(--fs-subtitle);font-weight:var(--fw-medium);
  text-align:center;line-height:1.5;
}
.il-answer{
  font-size:var(--fs-title);font-weight:var(--fw-bold);
  text-align:center;line-height:1.35;
}
`);

/* 艾宾浩斯错觉：中间两个圆**半径完全相同**，
   只有周围那圈圆的大小不同 —— 大脑比较的是「相对大小」，
   不是绝对大小。 */
var EB_C = 60;          /* 中心圆半径（两边一样） */

function ebbinghausSVG(surroundR, dist, proofId) {
  var R = 160;                              /* 画布半径 */
  var N = 8;                                /* 周围一圈 8 个，两边一样多 */
  var s = '<svg viewBox="' + (-R) + ' ' + (-R) + ' ' + (R * 2) + ' ' + (R * 2) +
          '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';
  var i, a;
  for (i = 0; i < N; i++) {
    a = (-90 + i * 360 / N) * Math.PI / 180;
    s += '<circle cx="' + (Math.cos(a) * dist).toFixed(1) +
         '" cy="' + (Math.sin(a) * dist).toFixed(1) +
         '" r="' + surroundR + '" fill="#DED7CD"/>';
  }
  s += '<circle cx="0" cy="0" r="' + EB_C + '" fill="#9FB8D0"/>';
  /* 揭晓用：一个和中心圆**严格重合**的描边圆 */
  s += '<circle class="eb-proof" id="' + proofId + '" cx="0" cy="0" r="' + EB_C + '"/>';
  return s + '</svg>';
}

PERCEPTION.scene({
  id: 'illusion',
  label: '大小错觉',
  states: [

    /* ---- 0：哪个大？ ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-md">
          <div class="il-q anim" style="--d:0s">
            左右两个<b class="c-blue">蓝圆</b>，哪一个更大？
          </div>

          <div id="ebWrap" class="anim fade" style="--d:.35s">
            <div class="eb-group">${ebbinghausSVG(50, 112, 'ebProofL')}</div>
            <div class="eb-group">${ebbinghausSVG(18, 79, 'ebProofR')}</div>
          </div>
        </div>
      `);
    },

    /* ---- 1：一样大（而且知道了也没用）---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-md">
          <div id="ebWrap">
            <div class="eb-group">${ebbinghausSVG(50, 112, 'ebProofL')}</div>
            <div class="eb-group">${ebbinghausSVG(18, 79, 'ebProofR')}</div>
          </div>

          <div class="il-answer anim" style="--d:.2s">一样大。</div>

          <p class="body anim fade" style="--d:1.2s;max-width:62vw;text-align:center;color:var(--text-secondary)">
            橙圈是原样描上去的，和两个蓝圆<b>严格重合</b>。<br>
            可你现在再看一眼 —— 它们<b class="c-orange">还是不一样大</b>。
          </p>

          <p class="subtitle anim fade" style="--d:2.2s;max-width:62vw;text-align:center">
            知道真相，并不能让错觉消失。
          </p>
        </div>
      `);

      /* 描边圆转一圈画出来，把「严格重合」这件事演示掉 */
      ctx.soon(function () {
        ctx.q('#ebProofL').classList.add('on');
        ctx.q('#ebProofR').classList.add('on');
      }, 260);
    },

  ],
});
