/* ============================================================
 * 场景 2：盲点测试  (id: blindspot · 4 个状态)
 * 目的：让每个学生亲身体验「大脑在填充」。
 * 注：这是真实的盲点测试，学生需要靠近/远离屏幕找到那个距离。
 * ============================================================ */
PERCEPTION.css('scene-blindspot', `
#bsBoard{
  background:var(--bg-card);border-radius:var(--radius-xl);
  box-shadow:var(--shadow-md);padding:var(--space-lg) var(--space-xl);
  display:flex;align-items:center;justify-content:center;gap:180px;
  position:relative;overflow:hidden;
}
#bsFix{font-size:var(--fs-hero);font-weight:var(--fw-bold);line-height:1;user-select:none;}
#bsDot{
  font-size:var(--fs-hero);line-height:1;color:var(--accent-blue);
  user-select:none;transform:translateY(-.06em);
}
#bsDot.blink{animation:softPulse 2s var(--ease-in-out) infinite;}

#bsSteps{display:flex;gap:var(--space-md);margin-top:var(--space-lg);}
#bsSteps .card{width:15vw;min-width:150px;text-align:center;}
#bsWarn{margin-top:var(--space-sm);font-size:var(--fs-tiny);color:var(--text-tertiary);letter-spacing:.1em;}

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

    /* ---- 2.0 指导 ---- */
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
            <div class="card tight anim" style="--d:.2s">1. 闭上左眼</div>
            <div class="card tight anim" style="--d:.35s">2. 右眼盯住 +</div>
            <div class="card tight anim" style="--d:.5s">3. 慢慢靠近屏幕，直到 ● 消失</div>
          </div>

          <div id="bsSlider" class="anim fade" style="--d:.6s">
            <span>两点间距</span>
            <input type="range" id="bsRange" min="80" max="520" value="260">
            <span>找不到就调这个</span>
          </div>

          <div id="bsWarn" class="anim fade" style="--d:.8s">不要偷看，不要眨眼 · 按 → 进入计时</div>
        </div>
      `);

      var board = ctx.q('#bsBoard'), range = ctx.q('#bsRange');
      function apply() { board.style.gap = range.value + 'px'; }
      ctx.on(range, 'input', apply);
      apply();
    },

    /* ---- 2.1 等待：20 秒倒计时环 ---- */
    function (ctx) {
      var board = ctx.q('#bsBoard'), range = ctx.q('#bsRange');
      var gapPx = range ? range.value : 260;

      ctx.set(`
        <div class="stack">
          <div id="bsBoard" class="anim" style="--d:0s;gap:${gapPx}px">
            <span id="bsFix">+</span>
            <span id="bsDot" class="blink">●</span>
          </div>

          <div id="ringWrap" class="anim fade" style="--d:.2s">
            <svg viewBox="0 0 100 100">
              <circle id="ringBg" cx="50" cy="50" r="44"></circle>
              <circle id="ringFg" cx="50" cy="50" r="44"
                      stroke-dasharray="276.5" stroke-dashoffset="0"></circle>
            </svg>
            <div id="ringNum">20</div>
          </div>

          <div class="small faint anim fade" style="--d:.4s;margin-top:var(--space-sm)">
            保持右眼盯住 <b>+</b>，慢慢前后移动 · <b>→</b> 提前揭晓
          </div>
        </div>
      `);

      var fg = ctx.q('#ringFg'), num = ctx.q('#ringNum');
      var total = 20, left = total;

      /* 环：20 秒线性走完 */
      ctx.soon(function () { fg.style.strokeDashoffset = '276.5'; }, 60);

      /* 数字：每秒更新 */
      ctx.every(1000, function () {
        left--;
        if (left <= 0) { left = 0; ctx.next(); }
        num.textContent = left;
        num.animate([{ transform: 'scale(1.25)' }, { transform: 'scale(1)' }],
                    { duration: 220, easing: 'cubic-bezier(.16,1,.3,1)' });
      });
    },

    /* ---- 2.2 揭晓 ---- */
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
            <p class="anim fade" style="--d:.3s"><b>圆点消失时，你看到黑洞了吗？</b></p>
            <p class="anim fade" style="--d:.5s muted">没有。你看到的是背景。</p>
            <p class="anim fade" style="--d:.7s">但那里没有感光细胞。<br>谁填的？—— <b class="c-blue">大脑</b>。</p>
          </div>
        </div>
      `);

      /* 放大镜移动 → 目标位置高亮 */
      ctx.soon(function () { ctx.q('#magnifier').classList.add('on'); }, 500);
      ctx.after(1500, function () { ctx.q('#bsSpot').classList.add('on'); });
    },

    /* ---- 2.3 过渡 ---- */
    function (ctx) {
      ctx.set(`
        <h2 class="title center anim" style="--d:0s">大脑不仅会填，还会被其他感官改写。</h2>
      `);
    },

  ],
});
