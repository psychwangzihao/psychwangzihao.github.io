/* ============================================================
 * 场景：大小错觉  (id: illusion · 3 个状态)
 *
 * 位置：在 Eagleman 之后、脑电之前 —— 它是「为什么要测量」的引子。
 *
 * 这一幕的第二拍才是重点：先证明「一样大」，再把同一张图放一次，
 * 让他当着「已知」的面再失败一次 —— **知道答案，修不好它**。
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
/* 揭晓那一屏下面还有三行字和一句引文，圆要收小一点才放得下 */
.eb-sm .eb-group{width:min(21vw,32vh);height:min(21vw,32vh);}
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
  label: '如何研究脑 · 主观报告不可信',
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

    /* ---- 1：揭晓「一样大」，只给证据，不给结论 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-md eb-sm">
          <div id="ebWrap">
            <div class="eb-group">${ebbinghausSVG(50, 112, 'ebProofL')}</div>
            <div class="eb-group">${ebbinghausSVG(18, 79, 'ebProofR')}</div>
          </div>

          <div class="il-answer anim" style="--d:.2s">一样大。</div>

          <p class="step body" style="max-width:62vw;text-align:center;color:var(--text-secondary)">
            橙圈是原样描上去的，和两个蓝圆<b>严格重合</b> —— 像素级的相同。
          </p>
        </div>
      `);

      ctx.soon(function () {
        ctx.q('#ebProofL').classList.add('on');
        ctx.q('#ebProofR').classList.add('on');
      }, 260);
      ctx.steps();
    },

    /* ---- 2：知道了，再看一眼——还是错的。
       这一幕的第二拍才是全场最要紧的一下：**知道答案，修不好它**。
       所以把同一张图再放一次，让他当着「已知」的面再失败一次。 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-md eb-sm">
          <div id="ebWrap">
            <div class="eb-group">${ebbinghausSVG(50, 112, 'ebProofL')}</div>
            <div class="eb-group">${ebbinghausSVG(18, 79, 'ebProofR')}</div>
          </div>

          <p class="body anim fade" style="--d:.25s;max-width:62vw;text-align:center;color:var(--text-secondary)">
            你已经<b>知道</b>它们一样大了。再看一眼。
          </p>

          <div class="step il-answer" style="color:var(--accent-orange)">还是不一样。</div>

          <p class="step subtitle" style="max-width:62vw;text-align:center">
            知道答案，也修不好它。
          </p>

          <div class="quote step">
            “So the first lesson about trusting your senses is: don’t.”
            <span class="attr">David Eagleman, <i>Incognito</i></span>
          </div>
        </div>
      `);
      ctx.steps();
    },

  ],
});
