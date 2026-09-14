/* ============================================================
 * 场景 9：脑机接口  (id: bci · 3 个状态 · 亮色)
 * 目的：展示 BCI 的原理、四类已有接口与边界。
 *
 * 共用绘图：flow() —— 每一处「信号通路」都用它画，
 * 节点样式和箭头只有一份；compact 版给四宫格里的小卡片用。
 * ============================================================ */
(function () {
  'use strict';

  /* ---------------- 共用绘图：一行信号通路 ----------------
   * items   : 节点文字，从左到右
   * accent  : 强调色（传 CSS 变量，如 'var(--accent-blue)'）
   * compact : true = 小一号，供四宫格的小卡片里使用
   * 返回 HTML 字符串；节点靠 .lit 点亮，箭头跟在后面亮。
   * 箭头借 icons.js 的 ICON.arrow，颜色走 currentColor。
   * ------------------------------------------------------ */
  function flow(items, accent, compact) {
    var html = '<div class="flow' + (compact ? ' bci-flow-compact' : '') +
               '" style="--flow-accent:' + accent + '">';
    for (var i = 0; i < items.length; i++) {
      if (i) html += '<span class="flow-arrow">' + ICON.arrow('ico') + '</span>';
      html += '<div class="flow-node">' + items[i] + '</div>';
    }
    return html + '</div>';
  }

  /* 让一行通路从左到右依次点亮，step 毫秒一个 */
  function lightRow(ctx, sel, step, delay) {
    var t0 = delay || 0;
    ctx.each(sel + ' .flow-node', function (el, i) {
      ctx.after(t0 + i * step, function () { el.classList.add('lit'); });
    });
    /* 箭头夹在两个节点中间，比左边那个节点慢半拍 */
    ctx.each(sel + ' .flow-arrow', function (el, i) {
      ctx.after(t0 + i * step + step * .5, function () { el.classList.add('lit'); });
    });
  }

  /* ---------------- 场景样式 ---------------- */

  PERCEPTION.css('scene-bci', `
/* 通路：圆角矩形节点 + 小箭头 */
.flow{display:flex;align-items:center;justify-content:center;gap:var(--space-sm);}
.flow-node{
  background:var(--bg-card);border:2px solid var(--border-subtle);
  border-radius:var(--radius-sm);box-shadow:var(--shadow-sm);
  padding:var(--space-xs) var(--space-sm);
  font-size:var(--fs-small);line-height:1.5;white-space:nowrap;
  transition:border-color var(--dur-slower) var(--ease-out),
             color var(--dur-slower) var(--ease-out),
             box-shadow var(--dur-slower) var(--ease-out);
}
.flow-node.lit{border-color:var(--flow-accent);color:var(--flow-accent);box-shadow:var(--shadow-md);}
.flow-arrow{
  display:flex;align-items:center;color:var(--text-tertiary);opacity:.3;
  transition:opacity var(--dur-slower) var(--ease-out);
}
.flow-arrow.lit{opacity:1;}
.flow-arrow .ico{width:1.3vw;height:1.3vw;min-width:14px;min-height:14px;stroke-width:2.4;}

/* 卡片里的通路：再小一号，节点和箭头都要收 */
.bci-flow-compact{gap:var(--space-xs);}
.bci-flow-compact .flow-node{padding:.35vw .6vw;font-size:var(--fs-tiny);border-width:1.5px;}
.bci-flow-compact .flow-arrow .ico{width:1vw;height:1vw;min-width:12px;min-height:12px;stroke-width:3;}

/* 9.0 两行通路 */
#bciRows{width:100%;}
#bciRows>div+div{margin-top:var(--space-md);}
#bciCaption{margin-top:var(--space-lg);}

/* 9.1 四宫格：四种接口一屏看全，宽度压到 76vw、高度压到 62vh 以内 */
#bciGrid{
  width:76vw;max-width:76vw;
  display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:1fr;
  gap:var(--space-md);
}
.bci-cell{
  padding:var(--space-sm) var(--space-md);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;gap:var(--space-xs);
}
/* 小卡片：标题降到正文字号、正文降到小字号 */
.bci-cell .card-title{font-size:var(--fs-body);margin-bottom:0;}
.bci-cell p{font-size:var(--fs-small);line-height:1.6;}
/* 图示区等高，四张卡的标题才会横向对齐 */
.bci-cell-art{
  width:100%;height:6vw;min-height:52px;
  display:flex;align-items:center;justify-content:center;
}

/* 9.1 舌面电极阵列（BrainPort）
   viewBox 收到舌头本身的大小 —— 原图四周留白太多，放进小卡片会显得很小 */
#tongueSvg{height:100%;width:auto;max-width:16vw;}
#tongueSvg .skin{fill:none;stroke:var(--accent-green);stroke-width:2.5;opacity:.55;}
#tongueSvg .dot{
  fill:var(--accent-green);
  animation:softPulse 2.4s var(--ease-in-out) infinite;
  animation-delay:calc(var(--i) * .09s);
}

/* 9.2 边界 */
#bciLimits{width:100%;}
#bciClose{margin-top:var(--space-lg);color:var(--accent-orange);}
`);

  PERCEPTION.scene({
    id: 'bci',
    label: '脑机接口',
    states: [

      /* ---- 9.0 原理：两条通路，一进一出 ---- */
      function (ctx) {
        ctx.set(`
          <div id="bciRows" class="stack">
            <div id="flowIn" class="anim" style="--d:0s">
              ${flow(['感觉器官', '换能器', '神经信号', '大脑'], 'var(--accent-blue)')}
            </div>
            <div id="flowOut" class="anim" style="--d:0s">
              ${flow(['外部信号', '电极', '神经信号', '大脑'], 'var(--accent-orange)')}
            </div>
          </div>

          <div id="bciCaption" class="subtitle bold center anim fade" style="--d:.8s">
            如果知觉是神经模式，能不能绕过感官，直接写？
          </div>
        `);

        lightRow(ctx, '#flowIn', 200, 0);
        lightRow(ctx, '#flowOut', 200, 800);   /* 第一行走完，第二行再来一遍 */
      },

      /* ---- 9.1 四种已有的脑机接口：四宫格，一屏看全 ----
         原来拆成四页，讲起来是连续四分钟同一种版式；
         并排放反而更能看出「范围」。 */
      function (ctx) {
        /* 5×5 电极点，铺在舌面形状上；--i 用来错开呼吸的相位 */
        var dots = '';
        for (var r = 0; r < 5; r++) {
          for (var c = 0; c < 5; c++) {
            dots += '<circle class="dot" style="--i:' + (r * 5 + c) + '"' +
                    ' cx="' + (30 + c * 10) + '" cy="' + (28 + r * 10) + '" r="2.4"/>';
          }
        }

        ctx.set(`
          <div id="bciGrid">
            <div class="card blue bci-cell anim" id="bciCell0" style="--d:0s">
              <div class="bci-cell-art">
                ${flow(['麦克风', '处理器', '电极', '听神经'], 'var(--accent-blue)', true)}
              </div>
              <div class="card-title">人工耳蜗</div>
              <p>最成功的 BCI 之一，已经做了几十年。大脑「听见」的是电脉冲，不是声音。</p>
            </div>

            <div class="card blue bci-cell anim" id="bciCell1" style="--d:.12s">
              <div class="bci-cell-art">
                ${flow(['相机', '电极', '视觉通路'], 'var(--accent-blue)', true)}
              </div>
              <div class="card-title">视网膜假体</div>
              <p>让盲人「看见」简单形状。</p>
            </div>

            <div class="card green bci-cell anim" id="bciCell2" style="--d:.24s">
              <div class="bci-cell-art">
                <svg id="tongueSvg" viewBox="24 8 52 74" aria-hidden="true">
                  <path class="skin" d="M50 10 C67 10 75 26 75 44 L75 56 A25 25 0 0 1 25 56 L25 44 C25 26 33 10 50 10 Z"/>
                  ${dots}
                </svg>
              </div>
              <div class="card-title">BrainPort</div>
              <p>用舌头「看」。</p>
            </div>

            <div class="card purple bci-cell anim" id="bciCell3" style="--d:.36s">
              <div class="bci-cell-art">
                ${flow(['运动皮层', '解码', '机械臂'], 'var(--accent-purple)', true)}
              </div>
              <div class="card-title">运动 BCI</div>
              <p>解码运动意图，控制机械臂。</p>
            </div>
          </div>
        `);

        /* 卡片落位后，三条通路各再走一遍点亮；舌面阵列没有节点，跳过 */
        ctx.each('#bciGrid .bci-cell', function (el, i) {
          if (!el.querySelector('.flow-node')) return;
          ctx.after(760 + i * 120, function () { lightRow(ctx, '#' + el.id, 120, 0); });
        });
      },

      /* ---- 9.2 边界：能做什么，不能做什么 ---- */
      function (ctx) {
        ctx.set(`
          <div id="bciLimits" class="stack" style="gap:var(--space-sm)">
            <div class="subtitle center anim fade" style="--d:0s">分辨率有限</div>
            <div class="subtitle center anim fade" style="--d:.3s">不是读心术</div>
            <div class="subtitle center anim fade" style="--d:.6s">不是黑客帝国</div>
            <div class="subtitle center anim fade" style="--d:.9s">伦理、隐私、知情同意</div>
          </div>

          <div id="bciClose" class="title bold center anim fade" style="--d:2.4s">
            科学精神就是知道边界。
          </div>
        `);
      },

    ],
  });

})();
