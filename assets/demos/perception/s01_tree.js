/* ============================================================
 * 场景 1：树倒悖论  (id: tree · 6 个状态)
 * 目的：制造认知冲突，引出「刺激 ≠ 知觉」。
 * ============================================================ */
PERCEPTION.css('scene-tree-hear', `
#hearStage{width:min(84vw,150vh);max-width:1560px;}
#hearStage svg{display:block;width:100%;height:auto;}

/* 通路上的每一段：默认压暗，被点到时才亮起来 */
.hp-st{opacity:.2;transition:opacity .55s var(--ease-out);}
.hp-st.on{opacity:1;}
.hp-st path{fill:none;stroke:var(--brain-ink);stroke-width:4.5;
  stroke-linecap:round;stroke-linejoin:round;transition:stroke .55s var(--ease-out);}
.hp-st text{fill:var(--text-secondary);font-family:var(--font-sans);
  font-size:24px;font-weight:var(--fw-medium);}
.hp-st.on path{stroke:var(--accent-blue);}
.hp-st.on text{fill:var(--accent-blue);font-weight:var(--fw-bold);}
/* 最后一段是大脑：它和前面七段不是一类东西，单独给个颜色 */
#hpBrain.on path{stroke:var(--accent-purple);}
#hpBrain.on text{fill:var(--accent-purple);}
`);

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

/* 现场举手的票数。挂在 PERCEPTION 上而不是放进状态里：开场要投两次，
   最后第 11 幕回扣时还要用它。 */
PERCEPTION.votes = { yes: 0, no: 0 };

/* ---------- 声音的通路 ----------
   声波 → 耳廓 → 耳道 → 鼓膜 → 听小骨 → 耳蜗 → 听神经 → 大脑
   画成「流程图」而不是解剖图：这一屏要讲的是路径，不是耳朵长什么样。
   终点落在大脑上，正好接后面那一幕。 */
function hearingSpiral(cx, cy, r0, r1, turns, steps) {
  var d = '', i, t, ang, r, x, y;
  for (i = 0; i <= steps; i++) {
    t = i / steps;
    ang = t * turns * Math.PI * 2;
    r = r0 + (r1 - r0) * t;
    x = cx + Math.cos(ang) * r;
    y = cy + Math.sin(ang) * r;
    d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
  }
  return d;
}

function hearingPathSVG() {
  return `
  <svg viewBox="0 0 980 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g class="hp-st" id="hpWave">
      <path d="M34,132 Q62,165 34,198"/>
      <path d="M62,110 Q104,165 62,220"/>
      <path d="M90,88 Q146,165 90,242"/>
      <text x="72" y="292" text-anchor="middle">声波</text>
    </g>
    <g class="hp-st" id="hpPinna">
      <path d="M216,78 C168,88 158,152 172,206 C182,244 208,256 226,244"/>
      <path d="M210,110 C186,120 182,162 192,198"/>
      <text x="196" y="292" text-anchor="middle">耳廓</text>
    </g>
    <g class="hp-st" id="hpCanal">
      <path d="M224,126 L326,142"/>
      <path d="M230,208 L326,190"/>
      <text x="272" y="292" text-anchor="middle">耳道</text>
    </g>
    <g class="hp-st" id="hpDrum">
      <path d="M334,136 C346,158 346,176 334,198"/>
      <text x="338" y="292" text-anchor="middle">鼓膜</text>
    </g>
    <g class="hp-st" id="hpBones">
      <path d="M356,148 L378,138 L386,166 Z"/>
      <path d="M390,140 L412,152 L400,178 Z"/>
      <path d="M418,148 L440,162 L424,184 Z"/>
      <text x="412" y="292" text-anchor="middle">听小骨</text>
    </g>
    <g class="hp-st" id="hpCochlea">
      <path d="${hearingSpiral(500, 166, 7, 54, 2.4, 90)}"/>
      <text x="504" y="292" text-anchor="middle">耳蜗</text>
    </g>
    <g class="hp-st" id="hpNerve">
      <path d="M560,150 C600,142 630,124 664,112"/>
      <path d="M560,166 C600,160 630,144 664,134"/>
      <path d="M560,182 C600,178 630,164 664,156"/>
      <text x="620" y="292" text-anchor="middle">听神经</text>
    </g>
    <g class="hp-st" id="hpBrain">
      <path d="M700,168 C696,126 726,100 772,96 C822,92 866,118 878,150
               C890,180 874,204 840,212 C806,220 760,218 726,206
               C706,198 698,186 700,168 Z"/>
      <path d="M726,140 C744,128 764,138 776,126"/>
      <path d="M790,124 C810,114 830,124 844,114"/>
      <path d="M714,182 C734,172 754,182 770,172"/>
      <path d="M798,176 C818,168 838,176 852,168"/>
      <text x="790" y="292" text-anchor="middle">大脑</text>
    </g>
  </svg>`;
}

/* 投票面板。第 1.1 和第 1.3 两幕都用它 —— 两次统计长得一样，
   只有上面那行小标签不同（第一次 / 第二次）。票数存在 PERCEPTION.votes 里，
   两次共用一组数字，最后一次为准。 */
function voteBoard(ctx, tag) {
  var votes = PERCEPTION.votes;
  ctx.set(`
    <div class="stack gap-lg" style="width:100%">
      <div class="body center anim fade" style="--d:0s;color:var(--text-secondary)">
        ${tag}统计 —— 觉得「它会响」的，请举手。
      </div>

      <div id="voteWrap" class="stack gap-sm">
        <div class="row gap-lg anim" style="--d:.3s">
          <button class="btn primary" id="voteYes">会</button>
          <button class="btn" id="voteNo">不会</button>
        </div>

        <div class="bars anim fade" id="bars" style="--d:.5s;opacity:0">
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
  paint();
}

PERCEPTION.scene({
  id: 'tree',
  label: '树倒悖论',
  states: [

    /* ---- 1.0 两个提问。不预设答案，也不先给结论 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-xl" style="max-width:74vw">
          <h1 class="title center anim" style="--d:0s">
            如果现在，窗外有一棵树倒下来了 ——<br>你觉得会怎么样？
          </h1>

          <h1 class="step title center">
            从科学上讲，这件事会不会因为你在不在场，而改变？
          </h1>

          <h1 class="step hero center" style="color:var(--accent-blue)">
            那么：在一片无人的森林里，<br>一棵树倒下了，它还会响吗？
          </h1>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 1.1 第一次统计 ---- */
    function (ctx) {
      voteBoard(ctx, '第一次');
    },

    /* ---- 1.2 声音的通路：一条一条点亮，走到大脑为止 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg" style="width:100%">
          <div class="body center anim fade" style="--d:0s;color:var(--text-secondary)">
            先看「响」是怎么发生的。
          </div>

          <div id="hearStage" class="anim fade" style="--d:.2s">${hearingPathSVG()}</div>

          <div class="step takeaway">没有耳朵，就没有「响」。</div>
        </div>
      `);

      /* 一段一段亮过去，像一道脉冲沿着通路走。只演一遍，不拦翻页 ——
         讲者想在哪一段停下来讲都行。 */
      var STAGES = ['hpWave', 'hpPinna', 'hpCanal', 'hpDrum',
                    'hpBones', 'hpCochlea', 'hpNerve', 'hpBrain'];
      STAGES.forEach(function (id, i) {
        ctx.after(700 + i * 330, function () {
          var el = ctx.q('#' + id);
          if (el) el.classList.add('on');
        });
      });

      ctx.steps();   /* 收束句按一下才出 */
    },

    /* ---- 1.3 第二次统计：这次才是准的 ---- */
    function (ctx) {
      voteBoard(ctx, '第二次');
    },

    /* ---- 1.4 拆解：声波 ≠ 响 ---- */
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

        <div class="takeaway" style="margin-top:4vw">
          <span class="wordby" id="treeTake">声波在森林里，响在大脑里。</span>
        </div>

        <div class="quote step">
          “You’re not perceiving what’s out there.<br>
          You’re perceiving whatever your brain tells you.”
          <span class="attr">David Eagleman, <i>Incognito</i></span>
        </div>
      `);

      /* 逐字出现：**一进来就把文字拆成单个字**，再让外框一起淡入。
         原来的写法是先整句出现、900ms 后再拆成逐字，于是会闪一下
         （先看见整句 → 消失 → 再一个字一个字来）。 */
      var el = ctx.q('#treeTake');
      el.style.opacity = '0';
      ctx.wordby(el, 70);
      ctx.soon(function () { el.style.opacity = '1'; }, 60);
      ctx.steps();
    },

    /* ---- 1.5 三连问：光 / 糖 / 损伤 ---- */
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

    /* ---- 1.6 过渡 ---- */
    function (ctx) {
      ctx.set(`
        <h2 class="title center anim" style="--d:0s">那大脑是怎么做到的？</h2>
      `);
    },

  ],
});
