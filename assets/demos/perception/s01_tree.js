/* ============================================================
 * 场景 1：树倒悖论  (id: tree · 6 个状态)
 * 目的：制造认知冲突，引出「刺激 ≠ 知觉」。
 * ============================================================ */
PERCEPTION.css('scene-tree', `
#treeQ{max-width:74vw;}
#voteWrap{margin-top:var(--space-md);width:46vw;min-width:380px;max-width:900px;}
#bars{margin-top:var(--space-sm);}

.cmp-card{width:30vw;min-width:230px;min-height:15vw;}
.cmp-card ul{list-style:none;margin-top:var(--space-xs);}
.cmp-card li{font-size:var(--fs-body);line-height:1.7;color:var(--text-primary);}
.neq{
  font-size:var(--fs-hero);color:var(--text-tertiary);line-height:1;
  font-weight:var(--fw-light);
}

#triWrap{width:60vw;max-width:1000px;}
.tree-tri{
  display:flex;align-items:center;gap:var(--space-sm);
  width:100%;padding:var(--space-sm) var(--space-md);
  border-radius:var(--radius-lg);
}
.tree-tri .txt{font-size:var(--fs-body);line-height:1.5;}
.tree-tri .ico{margin-right:.4vw;}
`);

/* ---------- 声波动画 ----------
   原本想做「树倒下去」的动画，试完放弃了：剪影式的平涂树一旦横过来，
   就是一个棒槌，怎么调都像草台。这里改成只演「声波」这一半 ——
   一圈一圈荡开，没有任何具象物体，也就不会画虎不成。
   而且这一屏的重点本来就是「波发生了，但没有人听到」，
   树倒不倒其实是次要的。 */
PERCEPTION.css('scene-tree-fall', `
#fallStage{width:min(74vw,140vh);max-width:1400px;margin-bottom:var(--space-lg);}
#fallStage svg{display:block;width:100%;height:auto;overflow:visible;}

/* 一圈一圈荡开的声波。
   fill-mode 用 forwards 而不是 both —— 用 both 的话，delay 期间
   元素会先摆出 0% 的姿态（半透明的小圈），页面一进来就露馅。 */
.fall-ring{
  fill:none;stroke:var(--accent-orange);stroke-width:3;
  opacity:0;transform-box:fill-box;transform-origin:center;
  animation:fallRing 1.9s var(--ease-out) forwards;
}
#fallRing1{animation-delay:.25s;}
#fallRing2{animation-delay:.75s;}
#fallRing3{animation-delay:1.25s;}
@keyframes fallRing{
  0%{opacity:.9;transform:scale(.04);}
  100%{opacity:0;transform:scale(1);}
}
`);

/* 现场举手的票数。挂在 PERCEPTION 上而不是放进状态里：退回这一页时
   不该清零，而且第 11 幕会把同一组数字再拿出来对照一次。 */
PERCEPTION.votes = { yes: 0, no: 0 };

/* 一棵树：树干收分 + 团块树冠。根部在原点，往上长，
   这样绕原点旋转就是绕根部倒。 */
var FALL_TREE_BODY = (function () {
  var d = '<path d="M-13,0 L-6,-150 L6,-150 L13,0 Z"/>' +
          '<circle cx="0" cy="-214" r="56"/>';
  var i, a;
  for (i = 0; i < 7; i++) {                 /* 一圈小团，树冠边缘才不秃 */
    a = (-90 + i * 360 / 7) * Math.PI / 180;
    d += '<circle cx="' + (Math.cos(a) * 58).toFixed(0) +
         '" cy="' + (-214 + Math.sin(a) * 58).toFixed(0) + '" r="36"/>';
  }
  return d;
})();

PERCEPTION.scene({
  id: 'tree',
  label: '树倒悖论',
  states: [

    /* ---- 1.0 窗外的树：先给一个每个人都点头的事实 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg" style="max-width:70vw">
          <div class="hero center anim" style="--d:0s">
            窗外那棵树倒下来了。
          </div>

          <p class="step body center muted">
            你听见了 —— 轰的一声。
          </p>

          <p class="step body center muted">
            这件事，不会因为你在不在场而改变。
          </p>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 1.1 无人的森林：把观察者拿走 ---- */
    function (ctx) {
      var votes = PERCEPTION.votes;

      ctx.set(`
        <div class="stack gap-lg" style="width:100%">
          <h1 class="hero center anim" id="treeQ" style="--d:0s;max-width:74vw">
            那么 —— 森林里一棵树倒下了，<br>周围没有人。它会响吗？
          </h1>

          <div id="voteWrap" class="stack gap-sm">
            <div class="row gap-lg anim" style="--d:.5s">
              <button class="btn primary" id="voteYes">会</button>
              <button class="btn" id="voteNo">不会</button>
            </div>

            <div class="bars anim fade" id="bars" style="--d:.7s;opacity:0">
              <div class="bar-row">
                <span class="bar-name">会</span>
                <span class="bar-track"><span class="bar" id="barYes"></span></span>
                <span class="bar-num c-blue" id="numYes">0</span>
              </div>
              <div class="bar-row">
                <span class="bar-name">不会</span>
                <span class="bar-track"><span class="bar alt" id="barNo"></span></span>
                <span class="bar-num c-orange" id="numNo">0</span>
              </div>
            </div>
          </div>
        </div>
      `);

      var bars = ctx.q('#bars');
      var barYes = ctx.q('#barYes'), barNo = ctx.q('#barNo');
      var numYes = ctx.q('#numYes'), numNo = ctx.q('#numNo');

      /* 横条：宽度是相对轨道的百分比，比例一定是准的。
         （原来是竖柱，高度的百分比相对的是「整列」——
          连数字和标签都算在里面，所以怎么调都对不上。） */
      function paint() {
        bars.style.opacity = 1;
        var total = votes.yes + votes.no;
        numYes.textContent = votes.yes;
        numNo.textContent = votes.no;
        if (!total) { barYes.style.width = '0'; barNo.style.width = '0'; return; }
        barYes.style.width = (votes.yes / total * 100) + '%';
        barNo.style.width = (votes.no / total * 100) + '%';
      }

      ctx.on('#voteYes', 'click', function () { votes.yes++; paint(); });
      ctx.on('#voteNo', 'click', function () { votes.no++; paint(); });
      ctx.on(window, 'keydown', function (e) {
        if (e.isComposing) return;
        if (e.key === 'r' || e.key === 'R') { votes.yes = 0; votes.no = 0; paint(); }
      });
    },

    /* ---- 1.2 声波：把「物理事件」演一遍 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg">
          <div id="fallStage" class="anim fade" style="--d:0s">
            <svg viewBox="0 0 640 380" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <!-- 只有一片很淡的林子剪影当背景，不画具体的那棵树 -->
              <g opacity=".13" fill="#6E5741">
                <g transform="translate(56,310) scale(.26)">${FALL_TREE_BODY}</g>
                <g transform="translate(88,310) scale(.17)">${FALL_TREE_BODY}</g>
                <g transform="translate(600,310) scale(.22)">${FALL_TREE_BODY}</g>
              </g>

              <!-- 地面 -->
              <path d="M0,310 L640,310" stroke="#D8CFC2" stroke-width="3"/>

              <!-- 声波：从一个点荡开。外层平移把圆心放到地面上，
                   内层绕自身中心放大 -->
              <g transform="translate(330,310)">
                <circle class="fall-ring" id="fallRing1" r="250"/>
                <circle class="fall-ring" id="fallRing2" r="250"/>
                <circle class="fall-ring" id="fallRing3" r="250"/>
              </g>
            </svg>
          </div>

          <div class="takeaway anim fade" style="--d:2.3s">声波发生了。这一点是确定的。</div>
        </div>
      `);
    },

    /* ---- 1.3 拆解：声波 ≠ 响 ---- */
    function (ctx) {
      ctx.set(`
        <div class="row gap-xl wrap">
          <div class="card blue cmp-card anim fade" style="--d:0s;transform:translateX(-24px)">
            <div class="card-title">声波</div>
            <ul>
              <li>空气振动</li>
              <li>森林里一定有</li>
              <li>物理事件</li>
            </ul>
          </div>

          <div class="neq anim pop" style="--d:.45s">≠</div>

          <div class="card orange cmp-card anim fade" style="--d:.2s;transform:translateX(24px)">
            <div class="card-title">响</div>
            <ul>
              <li>听到声音的体验</li>
              <li>没有大脑就不在</li>
              <li>主观体验</li>
            </ul>
          </div>
        </div>

        <div class="takeaway anim fade" style="--d:.8s;margin-top:4vw">
          <span class="wordby" id="treeTake">声波在森林里，响在大脑里。</span>
        </div>
      `);
      ctx.after(900, function () { ctx.wordby('#treeTake', 60); });
    },

    /* ---- 1.4 三连问：光 / 糖 / 损伤 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-md" id="triWrap">
          <div class="card tight tree-tri anim" style="--d:0s;background:var(--accent-blue-light)">
            ${ICON.sun('ico lg c-blue')}
            <div class="txt">波长在宇宙里，<b class="c-blue">红</b>在大脑里</div>
          </div>

          <div class="card tight tree-tri anim" style="--d:.15s;background:var(--accent-green-light)">
            ${ICON.candy('ico lg c-green')}
            <div class="txt">分子在杯子里，<b class="c-green">甜</b>在大脑里</div>
          </div>

          <div class="card tight tree-tri anim" style="--d:.3s;background:var(--accent-pink-light)">
            ${ICON.body('ico lg c-pink')}
            <div class="txt">组织在身体上，<b class="c-pink">痛</b>在大脑里</div>
          </div>
        </div>

        <div class="takeaway anim fade" style="--d:.7s;margin-top:var(--space-lg)">
          世界只提供能量，大脑提供体验。
        </div>
      `);
    },

    /* ---- 1.5 过渡 ---- */
    function (ctx) {
      ctx.set(`
        <h2 class="title center anim" style="--d:0s">那大脑是怎么做到的？</h2>
      `);
    },

  ],
});
