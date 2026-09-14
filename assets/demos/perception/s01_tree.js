/* ============================================================
 * 场景 1：树倒悖论  (id: tree · 4 个状态)
 * 目的：制造认知冲突，引出「刺激 ≠ 知觉」。
 * ============================================================ */
PERCEPTION.css('scene-tree', `
#treeQ{max-width:70vw;}
#voteWrap{margin-top:3vw;width:60vw;max-width:900px;}
#bars{margin-top:var(--space-sm);}
.bar-col .num{font-size:var(--fs-data);font-weight:var(--fw-bold);font-family:var(--font-mono);}
.bar-col .lab{font-size:var(--fs-body);color:var(--text-secondary);}
#voteHint{font-size:var(--fs-tiny);color:var(--text-tertiary);margin-top:var(--space-sm);}

.cmp-card{width:30vw;min-width:230px;min-height:15vw;}
.cmp-card ul{list-style:none;margin-top:var(--space-xs);}
.cmp-card li{font-size:var(--fs-body);line-height:1.7;color:var(--text-primary);}
.neq{
  font-size:var(--fs-hero);color:var(--text-tertiary);line-height:1;
  font-weight:var(--fw-light);
}

#triWrap{width:60vw;max-width:1000px;}
.tri{
  display:flex;align-items:center;gap:var(--space-sm);
  width:100%;padding:var(--space-sm) var(--space-md);
  border-radius:var(--radius-lg);
}
.tri .txt{font-size:var(--fs-body);line-height:1.5;}
.tri .ico{margin-right:.4vw;}
`);

/* 现场举手的票数。挂在 PERCEPTION 上而不是放进状态里：退回这一页时
   不该清零，而且第 11 幕会把同一组数字再拿出来对照一次。 */
PERCEPTION.votes = { yes: 0, no: 0 };

PERCEPTION.scene({
  id: 'tree',
  label: '树倒悖论',
  states: [

    /* ---- 1.0 问题 + 举手投票 ---- */
    function (ctx) {
      /* 票数存在模块级，退回这一页时不会清零 —— 讲座里可能要来回对照。
         要清空按 R。 */
      var votes = PERCEPTION.votes;

      ctx.set(`
        <h1 class="hero center anim" id="treeQ" style="--d:0s">
          如果森林里一棵树倒下了，<br>周围没有人，它会响吗？
        </h1>

        <div id="voteWrap" class="stack gap-sm">
          <div class="row gap-lg anim" style="--d:.4s">
            <button class="btn primary" id="voteYes">会</button>
            <button class="btn" id="voteNo">不会</button>
          </div>

          <div class="bars anim fade" id="bars" style="--d:.6s;opacity:0">
            <div class="bar-col">
              <span class="num c-blue" id="numYes">0</span>
              <div class="bar" id="barYes"></div>
              <span class="lab">会</span>
            </div>
            <div class="bar-col">
              <span class="num c-orange" id="numNo">0</span>
              <div class="bar alt" id="barNo"></div>
              <span class="lab">不会</span>
            </div>
          </div>

          <div id="voteHint" class="anim fade" style="--d:.8s">
            举手示意，老师点按钮计数 · 按 <b>R</b> 清空 · 按 <b>→</b> 继续
          </div>
        </div>
      `);

      var bars = ctx.q('#bars');
      var barYes = ctx.q('#barYes'), barNo = ctx.q('#barNo');
      var numYes = ctx.q('#numYes'), numNo = ctx.q('#numNo');

      function paint() {
        bars.style.opacity = 1;
        var max = Math.max(votes.yes, votes.no, 1);
        numYes.textContent = votes.yes;
        numNo.textContent = votes.no;
        /* 高度：最高的柱子占满，其余按比例；都为 0 时留一点底 */
        barYes.style.height = (votes.yes / max * 100) + '%';
        barNo.style.height = (votes.no / max * 100) + '%';
        barYes.style.minHeight = votes.yes ? '12px' : '0';
        barNo.style.minHeight = votes.no ? '12px' : '0';
      }

      ctx.on('#voteYes', 'click', function () { votes.yes++; paint(); });
      ctx.on('#voteNo', 'click', function () { votes.no++; paint(); });
      ctx.on(window, 'keydown', function (e) {
        if (e.isComposing) return;
        if (e.key === 'r' || e.key === 'R') { votes.yes = 0; votes.no = 0; paint(); }
      });
    },

    /* ---- 1.1 拆解：声波 ≠ 响 ---- */
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

    /* ---- 1.2 三连问：光 / 糖 / 损伤 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-md" id="triWrap">
          <div class="card tight tri anim" style="--d:0s;background:var(--accent-blue-light)">
            ${ICON.sun('ico lg c-blue')}
            <div class="txt">波长在宇宙里，<b class="c-blue">红</b>在大脑里</div>
          </div>

          <div class="card tight tri anim" style="--d:.15s;background:var(--accent-green-light)">
            ${ICON.candy('ico lg c-green')}
            <div class="txt">分子在杯子里，<b class="c-green">甜</b>在大脑里</div>
          </div>

          <div class="card tight tri anim" style="--d:.3s;background:var(--accent-pink-light)">
            ${ICON.body('ico lg c-pink')}
            <div class="txt">组织在身体上，<b class="c-pink">痛</b>在大脑里</div>
          </div>
        </div>

        <div class="takeaway anim fade" style="--d:.7s;margin-top:var(--space-lg)">
          世界只提供能量，大脑提供体验。
        </div>
      `);
    },

    /* ---- 1.3 过渡 ---- */
    function (ctx) {
      ctx.set(`
        <h2 class="title center anim" style="--d:0s">那大脑是怎么做到的？</h2>
      `);
    },

  ],
});
