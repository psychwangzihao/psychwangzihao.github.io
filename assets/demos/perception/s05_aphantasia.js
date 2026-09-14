/* ============================================================
 * 场景 5：心盲症与想象  (id aphantasia · 5 个状态)
 * 目的：展示主观体验的个体差异。
 * 注：讲者王梓豪本人是心盲症（aphantasia，约 3–4% 的人）。
 * ============================================================ */
PERCEPTION.css('scene-aphantasia', `
/* 5.0 指令：一句问话 + 倒计时数字 */
#aphAsk{max-width:60vw;}
#cdNum{font-family:var(--font-mono);line-height:1;}

/* 5.1 对比：左右两张卡片 */
#aphPair{display:flex;align-items:stretch;justify-content:center;gap:4vw;}
.aph-card{
  width:35vw;min-width:280px;min-height:22vw;
  border-radius:var(--radius-lg);padding:var(--space-md);
  box-shadow:var(--shadow-md);
  display:flex;flex-direction:column;align-items:center;
}
/* A：白卡，从左侧滑入 */
.aph-a{
  background:var(--bg-card);
  opacity:0;transform:translateX(-40px);
  transition:opacity var(--dur-slow) var(--ease-out),
             transform var(--dur-slow) var(--ease-out);
}
.aph-a.in{opacity:1;transform:none;}
/* B：暗卡，从右侧滑入 */
.aph-b{
  background:var(--bg-dark);color:var(--text-inverse);
  opacity:0;transform:translateX(40px);
  transition:opacity var(--dur-slow) var(--ease-out),
             transform var(--dur-slow) var(--ease-out);
}
.aph-b.in{opacity:1;transform:none;}
.aph-b .subtitle{color:var(--text-inverse);}

/* 花：先糊着、褪色，再一点点清晰起来 */
#flowerArt{
  width:12vw;min-width:120px;margin-top:var(--space-sm);
  filter:blur(10px) saturate(.2);
  transition:filter var(--dur-slowest) var(--ease-out);
}
#flowerArt.on{filter:blur(0) saturate(1);}

/* B 卡的内容：整块黑，只有四个字 */
#aphDark{
  flex:1;width:100%;margin-top:var(--space-sm);
  display:flex;align-items:center;justify-content:center;
}
#aphDark span{
  font-size:var(--fs-body);color:var(--text-tertiary);
  letter-spacing:.2em;
}

#aphFoot{margin-top:2vw;text-align:center;}

/* 5.2 补充：三张窄卡，图标 + 一句话 */
#aphLines{display:flex;flex-direction:column;gap:1.5vw;width:50vw;}
.card.aph-line{
  border-radius:var(--radius-md);box-shadow:var(--shadow-sm);
  padding:var(--space-sm) var(--space-md);
  background:var(--bg-card);
  display:flex;align-items:center;gap:var(--space-md);
}
`);

PERCEPTION.scene({
  id: 'aphantasia',
  label: '心盲症',
  states: [

    /* ---- 5.0 指令：闭眼想一朵花，10 秒倒计时 ---- */
    function (ctx) {
      ctx.set(`
        <h2 id="aphAsk" class="title center anim" style="--d:0s;font-weight:var(--fw-medium)">
          闭上眼睛，想象一朵花。花瓣是绿色的，叶子是红色的。
        </h2>

        <div id="cdNum" class="hero c-blue anim pop" style="--d:.2s;margin-top:3vw">10</div>
      `);

      var num = ctx.q('#cdNum');
      var left = 10;

      /* 每秒换一个数字，缩一下再回弹 */
      ctx.every(1000, function () {
        if (left <= 0) return;
        left--;
        num.textContent = left;
        num.animate([{ transform: 'scale(1.2)' }, { transform: 'scale(1)' }],
                    { duration: 200, easing: 'cubic-bezier(.16,1,.3,1)' });
        /* 数到 0 停一下，让学生看清，再走 */
        if (left === 0) ctx.after(350, function () { ctx.next(); });
      });
    },

    /* ---- 5.1 举手：把主观体验变成看得见的比例
       礼堂里让大家闭眼，等于放空一半人；改成举手，你从台上看得见，
       学生自己也看得见 —— 冲击力比一屏插画大得多。 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg">
          <h2 class="title center anim" style="--d:0s">睁开眼睛。</h2>

          <p class="subtitle center anim" style="--d:.35s;max-width:60vw">
            刚才脑海里有<b class="c-blue">清晰画面</b>的，请举手。
          </p>

          <p class="body muted center anim fade" style="--d:1.4s;max-width:52vw">
            先别放下 —— 环顾一下四周，记住这个比例。<br>待会儿要用到它。
          </p>
        </div>
      `);
    },

    /* ---- 5.2 对比：别人的脑海 vs 我的脑海 ---- */
    function (ctx) {
      ctx.set(`
        <div id="aphPair">
          <div id="aphA" class="aph-card aph-a">
            <div class="subtitle">大多数人的脑海</div>
            <svg id="flowerArt" viewBox="0 0 100 140" aria-hidden="true">
              <!-- 茎 -->
              <path d="M50 62V134" fill="none" stroke="var(--accent-green)"
                    stroke-width="4" stroke-linecap="round"/>
              <!-- 两片叶子 -->
              <ellipse cx="33" cy="90" rx="15" ry="7.5" fill="var(--accent-green)"
                       transform="rotate(-28 33 90)"/>
              <ellipse cx="67" cy="110" rx="15" ry="7.5" fill="var(--accent-green)"
                       transform="rotate(28 67 110)"/>
              <!-- 六片圆花瓣 -->
              <g fill="var(--accent-pink)">
                <ellipse cx="50" cy="25" rx="10.5" ry="16"/>
                <ellipse cx="50" cy="25" rx="10.5" ry="16" transform="rotate(60 50 40)"/>
                <ellipse cx="50" cy="25" rx="10.5" ry="16" transform="rotate(120 50 40)"/>
                <ellipse cx="50" cy="25" rx="10.5" ry="16" transform="rotate(180 50 40)"/>
                <ellipse cx="50" cy="25" rx="10.5" ry="16" transform="rotate(240 50 40)"/>
                <ellipse cx="50" cy="25" rx="10.5" ry="16" transform="rotate(300 50 40)"/>
              </g>
              <!-- 花心 -->
              <circle cx="50" cy="40" r="8" fill="var(--warning)"/>
            </svg>
          </div>

          <div id="aphB" class="aph-card aph-b">
            <div class="subtitle">心盲症的脑海</div>
            <div id="aphDark"><span>一片漆黑</span></div>
          </div>
        </div>

        <div id="aphFoot">
          <div class="body anim fade" style="--d:.46s;color:var(--text-secondary)">我属于右边这 3–4%。</div>
          <div class="small faint anim fade" style="--d:.6s;margin-top:var(--space-xs)">心盲症（Aphantasia）</div>
        </div>
      `);

      /* 两张卡片同时从左右两侧滑入，400ms 后字幕才出来 */
      ctx.soon(function () { ctx.q('#aphA').classList.add('in'); }, 60);
      ctx.soon(function () { ctx.q('#aphB').classList.add('in'); }, 60);
      /* 花：糊 + 褪色 → 清晰 + 上色，1s */
      ctx.soon(function () { ctx.q('#flowerArt').classList.add('on'); }, 700);
    },

    /* ---- 5.3 补充：三句话，三个我 ---- */
    function (ctx) {
      ctx.set(`
        <div id="aphLines">
          <div class="card aph-line anim" style="--d:0s">
            ${ICON.eye('ico c-blue')}
            <span class="body">我知道花长什么样，能认出来，能画出来。</span>
          </div>

          <div class="card aph-line anim" style="--d:.15s">
            ${ICON.eyeOff('ico faint')}
            <span class="body">但闭上眼睛，什么都没有。</span>
          </div>

          <div class="card aph-line anim" style="--d:.3s">
            ${ICON.moon('ico c-purple')}
            <span class="body">可我做梦时能看到画面。</span>
          </div>
        </div>
      `);
    },

    /* ---- 5.4 过渡 ---- */
    function (ctx) {
      ctx.set(`
        <h2 class="title center anim fade" style="--d:0s">构建可以不同，也可以缺失。那如果一条通道彻底缺失呢？</h2>
      `);
    },

  ],
});
