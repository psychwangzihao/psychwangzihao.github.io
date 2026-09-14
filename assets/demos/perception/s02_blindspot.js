/* ============================================================
 * 场景 2：盲点测试  (id: blindspot · 3 个状态)
 * 目的：让每个学生亲身体验「大脑在填充」。
 * 注：这是真实的盲点测试，学生需要靠近/远离屏幕找到那个距离。
 * ============================================================ */
PERCEPTION.css('scene-blindspot', `
#bsBoard{
  background:var(--bg-card);border-radius:var(--radius-xl);
  box-shadow:var(--shadow-md);padding:var(--space-md);
  display:flex;align-items:center;justify-content:center;gap:66vw;
  width:100%;position:relative;overflow:hidden;
}
#bsFix{font-size:var(--fs-hero);font-weight:var(--fw-bold);line-height:1;user-select:none;}
#bsDot{
  font-size:var(--fs-hero);line-height:1;color:var(--accent-blue);
  user-select:none;transform:translateY(-.06em);
}
#bsDot.blink{animation:softPulse 2s var(--ease-in-out) infinite;}

#bsSteps{display:flex;gap:var(--space-md);margin-top:var(--space-lg);}
/* 字号必须给：不给就退回浏览器默认的 16px，投影到后排根本看不清 */
#bsSteps .card{width:15vw;min-width:150px;text-align:center;
               font-size:var(--fs-small);line-height:1.5;}
#bsWarn{margin-top:var(--space-sm);font-size:var(--fs-tiny);color:var(--text-tertiary);letter-spacing:.1em;}

/* 不用屏幕的那条路（后排同学用） */
#bsHands{
  margin-top:var(--space-md);max-width:52vw;text-align:left;
  display:flex;flex-direction:column;gap:var(--space-2xs);
}
#bsHands b{font-size:var(--fs-small);color:var(--accent-blue);}
#bsHands span{font-size:var(--fs-small);color:var(--text-secondary);line-height:1.5;}

#bsSlider{margin-top:var(--space-md);display:flex;align-items:center;gap:var(--space-sm);
          font-size:var(--fs-tiny);color:var(--text-tertiary);}
#bsSlider input{width:22vw;min-width:180px;accent-color:var(--accent-blue);}

/* 倒计时环 */
#ringWrap{position:relative;width:5vw;height:5vw;min-width:64px;min-height:64px;margin-top:var(--space-md);}
#ringWrap svg{transform:rotate(-90deg);width:100%;height:100%;}
#ringBg{fill:none;stroke:var(--border-subtle);stroke-width:5;}
#ringFg{fill:none;stroke:var(--accent-blue);stroke-width:5;stroke-linecap:round;
        transition:stroke-dashoffset 20s linear;}
#ringNum{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  font-size:var(--fs-subtitle);font-weight:var(--fw-bold);color:var(--accent-blue);
  font-family:var(--font-mono);
}

/* 揭晓态：左图右文 */
#bsReveal{display:flex;align-items:center;justify-content:center;gap:var(--space-xl);width:100%;}
#bsReveal .board{flex:none;transform:scale(.82);transform-origin:center;}
#bsCard{width:35vw;min-width:280px;}
#bsCard p{font-size:var(--fs-body);line-height:1.7;margin-bottom:var(--space-sm);}
#bsCard p:last-child{margin-bottom:0;}

/* 放大镜 */
#magnifier{
  position:absolute;top:50%;left:6%;width:7vw;height:7vw;min-width:74px;min-height:74px;
  margin-top:-3.5vw;border:3px solid var(--accent-orange);border-radius:50%;
  opacity:0;transition:left 1s var(--ease-out),opacity var(--dur-slow) var(--ease-out);
  pointer-events:none;box-shadow:0 0 0 3px rgba(232,131,74,.12);
}
#magnifier.on{opacity:1;left:46%;}
#bsSpot{
  position:absolute;top:50%;left:50%;width:6vw;height:6vw;margin-top:-3vw;margin-left:1vw;
  border-radius:50%;background:radial-gradient(circle,rgba(232,131,74,.30) 0%,rgba(232,131,74,0) 70%);
  opacity:0;transition:opacity var(--dur-slower) var(--ease-out);pointer-events:none;
}
#bsSpot.on{opacity:1;animation:softPulse 2.4s var(--ease-in-out) infinite;}
`);

PERCEPTION.scene({
  id: 'blindspot',
  label: '盲点测试',
  noClick: true,          /* 学生正在做测试，误点不该翻页 */
  states: [

    /* ---- 2.0 指导：把学生请上台来玩 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack">
          <div id="bsBoard" class="anim" style="--d:0s">
            <span id="bsFix">+</span>
            <span id="bsDot">●</span>
            <div id="magnifier"></div>
            <div id="bsSpot"></div>
          </div>

          <div id="bsSteps">
            <div class="card tight step">1. 闭上左眼</div>
            <div class="card tight step">2. 右眼盯住 +</div>
            <div class="card tight step">3. 调节间距，直到 ● 消失</div>
          </div>

          <div id="bsSlider" class="step anim fade" style="--d:.6s">
            <span>两点间距</span>
            <input type="range" id="bsRange" min="8" max="66" value="66">
          </div>
        </div>
      `);

      var board = ctx.q('#bsBoard'), range = ctx.q('#bsRange');
      /* 单位是 vw：初始就在最远端（水平撑满整个屏幕），讲者再手动往小调 */
      function apply() { board.style.gap = range.value + 'vw'; }
      ctx.on(range, 'input', apply);
      apply();
      ctx.steps();
    },

    /* ---- 2.1 揭晓：一行一行来 ---- */
    function (ctx) {
      ctx.set(`
        <div id="bsReveal">
          <div id="bsBoard" class="board">
            <span id="bsFix">+</span>
            <span id="bsDot">●</span>
            <div id="magnifier"></div>
            <div id="bsSpot"></div>
          </div>

          <div id="bsCard" class="card anim" style="--d:.1s">
            <p class="step"><b>圆点消失时，你看到黑洞了吗？</b></p>
            <p class="step muted">没有。你看到的是背景。</p>
            <p class="step">但那里没有感光细胞。<br>谁填的？—— <b class="c-blue">大脑</b>。</p>
          </div>

          <div class="quote step" style="max-width:34vw;margin-top:var(--space-md)">
            “Instead of reality being passively recorded by the brain,<br>
            it is actively constructed by it.”
            <span class="attr">David Eagleman, <i>Incognito</i></span>
          </div>
        </div>
      `);

      /* 放大镜移动 → 目标位置高亮 */
      ctx.soon(function () { ctx.q('#magnifier').classList.add('on'); }, 500);
      ctx.after(1500, function () { ctx.q('#bsSpot').classList.add('on'); });
      ctx.steps();
    },

    /* ---- 2.2 过渡 ---- */
    function (ctx) {
      ctx.set(`
        <h2 class="title center anim" style="--d:0s;max-width:70vw">大脑会替你补上不存在的东西。<br>可每个人补出来的，都一样吗？</h2>
      `);
    },

  ],
});
