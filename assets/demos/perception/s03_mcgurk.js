/* ============================================================
 * 场景 3：McGurk 效应  (id: mcgurk · 4 个状态)
 * 目的：展示多感官整合 —— 同一个声音，眼睛能改写你听到的音节。
 * 注：视频由作者稍后放入 ./media/mcgurk.mp4；文件缺失时自动降级为口型动画，
 *     整场演示不依赖该文件也能跑通。
 * ============================================================ */
(function () {
  'use strict';

  var SRC = './media/mcgurk.mp4';
  var PLAYS = 2;                 /* 视频（或口型）播 2 遍 */
  var FALLBACK_PLAY_MS = 2500;   /* 降级模式里「一遍」按 2.5s 计，2 遍 ≈ 5s */

  /* 播放按钮里的三角（按钮的白底圆由 CSS 画） */
  var TRI = '<svg class="mp-tri" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5 19 12 7 19.5z"/></svg>';

  /* 降级用的口型示意（正面）：ba = 双唇闭合，ga = 下颌张开、舌尖上抬。
     全部由 CSS 关键帧驱动：下颌整体 translateY、口腔 scaleY、齿/舌淡入淡出。
     注意：下颌组内的坐标写的是「闭口」位置，张口靠整组下移 26 个单位。 */
  var MOUTH = `
    <svg id="mpMouth" viewBox="20 36 160 78" aria-hidden="true">
      <ellipse id="mpCavity" class="cavity" cx="100" cy="66" rx="64" ry="15"/>

      <g id="mpUpperSet" class="mp-teeth">
        <path class="tooth" d="M46 58 Q100 53 154 58 L154 68 Q100 64 46 68 Z"/>
      </g>

      <g id="mpJaw">
        <g id="mpLowerSet" class="mp-teeth">
          <path class="tooth" d="M52 44 Q100 36 148 44 L148 52 Q100 44 52 52 Z"/>
          <path class="tongue" d="M74 52 Q100 30 126 52 Q100 58 74 52 Z"/>
        </g>
        <path class="lip" d="M30 62 Q100 44 170 62"/>
      </g>

      <path class="lip" d="M30 62 Q100 44 170 62"/>
    </svg>`;

  /* 视频加载失败时置位，跨状态保留（回退到 3.0 也不用重新探测） */
  var fallback = false;

  /* 视频卡片：small = 揭晓态缩到 45% 宽；withPlay = 是否叠播放按钮 */
  function stageHTML(small, withPlay) {
    return `
      <div class="mp-stage${small ? ' small' : ''}" id="mpStage">
        ${fallback ? '' : `<video id="mcgurkVid" src="${SRC}" playsinline preload="metadata"></video>`}
        ${withPlay ? `<button class="mp-play" id="mpPlay" aria-label="播放">${TRI}</button>` : ''}
        <div class="mp-mouth${fallback ? ' on' : ''}" id="mpMouthWrap">
          ${MOUTH}
          <div class="tiny faint mp-cap">（示例口型：视频文件未加载）</div>
        </div>
      </div>`;
  }

  PERCEPTION.css('scene-mcgurk', `
/* 视频卡片：40vw 宽 · 16:9（即 22.5vw 高） */
.mp-wrap{position:relative;display:flex;flex-direction:column;align-items:center;}
.mp-stage{
  position:relative;flex:none;
  width:40vw;aspect-ratio:16/9;
  border-radius:var(--radius-xl);box-shadow:var(--shadow-lg);
  background:var(--bg-card);overflow:hidden;
}
/* 揭晓态：缩到 45% 宽，同时受屏高约束（16:9 不会变形） */
.mp-stage.small{width:min(45vw,76vh);}
#mcgurkVid{display:block;width:100%;height:100%;object-fit:cover;background:var(--bg-secondary);}

/* 播放按钮：白底圆 + 蓝色三角，2s 一次呼吸 */
.mp-play{
  position:absolute;left:50%;top:50%;z-index:2;
  width:6vw;height:6vw;min-width:58px;min-height:58px;
  border:0;padding:0;border-radius:var(--radius-full);
  background:rgba(255,255,255,.9);color:var(--accent-blue);
  display:flex;align-items:center;justify-content:center;cursor:pointer;
  box-shadow:var(--shadow-lg);
  animation:mpBreathe 2s var(--ease-in-out) infinite;
  transition:opacity var(--dur-normal) var(--ease-out),
             background var(--dur-fast) var(--ease-out),
             box-shadow var(--dur-fast) var(--ease-out);
}
.mp-play:hover{background:var(--bg-card);box-shadow:var(--shadow-xl);}
.mp-play .mp-tri{width:50%;height:50%;fill:currentColor;stroke:none;}
.mp-play.gone{opacity:0;pointer-events:none;}
@keyframes mpBreathe{
  0%,100%{transform:translate(-50%,-50%) scale(1);}
  50%{transform:translate(-50%,-50%) scale(1.08);}
}

/* 口型替身（视频缺失时显示）—— z-index 必须低于播放按钮，
   否则替身一出现就把按钮盖住，现场就没法点播了 */
.mp-mouth{
  position:absolute;inset:0;display:none;z-index:1;
  flex-direction:column;align-items:center;justify-content:center;
  gap:var(--space-xs);background:var(--bg-secondary);
}
.mp-mouth.on{display:flex;}
.mp-mouth svg{width:58%;height:auto;}
.mp-cap{margin-top:var(--space-2xs);}

#mpMouth .lip{fill:none;stroke:var(--text-primary);stroke-width:5;stroke-linecap:round;}
#mpMouth .cavity{fill:var(--text-primary);opacity:.16;}
#mpMouth .tooth{fill:var(--bg-card);}
#mpMouth .tongue{fill:var(--accent-pink);opacity:.6;}

/* 口型循环（1.2s 一轮：ba 闭合 → ga 张开 → ba） */
#mpCavity{transform-box:fill-box;transform-origin:center;
          animation:mpCavity 1.2s var(--ease-in-out) infinite;}
#mpJaw{animation:mpJaw 1.2s var(--ease-in-out) infinite;}
.mp-teeth{animation:mpTeeth 1.2s var(--ease-in-out) infinite;}
@keyframes mpCavity{
  0%,12%{transform:scaleY(.05);}
  38%,62%{transform:scaleY(1);}
  88%,100%{transform:scaleY(.05);}
}
@keyframes mpJaw{
  0%,12%{transform:translateY(0);}
  38%,62%{transform:translateY(26px);}
  88%,100%{transform:translateY(0);}
}
@keyframes mpTeeth{
  0%,18%{opacity:0;}
  32%,68%{opacity:1;}
  82%,100%{opacity:0;}
}

/* 视频下方 2vw 的提示语（绝对定位，淡出时不推挤卡片） */
.mp-hint{
  position:absolute;top:100%;left:0;right:0;text-align:center;
  margin-top:var(--space-md);
  transition:opacity var(--dur-slow) var(--ease-out);
}
.mp-hint.gone{opacity:0;}

/* 揭晓态：左视频 · 右文字 + 整合示意 */
.mp-reveal{display:flex;align-items:center;justify-content:center;gap:var(--space-lg);width:100%;}
.mp-col{display:flex;flex-direction:column;align-items:center;gap:var(--space-lg);}
.mp-card{width:35vw;min-width:280px;}
.mp-card p{font-size:var(--fs-body);line-height:1.7;}
.mp-card p+p{margin-top:var(--space-sm);}
@keyframes mpSlideIn{from{opacity:0;transform:translateX(48px);}to{opacity:1;transform:none;}}
.mp-slide{animation:mpSlideIn var(--dur-slow) var(--ease-out) both;animation-delay:var(--d,0s);}

/* 眼睛 → 大脑 → 知觉：虚线串联，逐个点亮 */
.mp-flow{display:flex;align-items:center;justify-content:center;gap:var(--space-sm);
         width:35vw;min-width:280px;}
.mp-node{display:flex;flex-direction:column;align-items:center;gap:var(--space-2xs);
         opacity:.25;transition:opacity var(--dur-normal) var(--ease-out);}
.mp-node.on{opacity:1;}
.mp-node span{font-size:var(--fs-small);color:var(--text-secondary);}
.mp-dash{flex:1;height:0;border-top:2px dashed var(--border-subtle);}
`);

PERCEPTION.scene({
  id: 'mcgurk',
  label: 'McGurk 效应',
  noClick: true,          /* 看视频时误点不该翻页：本场景只认播放按钮和 → 键 */
  states: [

    /* ---- 3.0 准备：视频卡片 + 播放按钮 ---- */
    function (ctx) {
      ctx.set(`
        <div class="mp-wrap">
          ${stageHTML(false, true)}
          <div class="body muted mp-hint anim fade" id="mpHint" style="--d:.3s">看这个视频，告诉我你听到了什么。</div>
        </div>
      `);

      var vid = ctx.q('#mcgurkVid');
      var mouth = ctx.q('#mpMouthWrap');

      /* 视频不可用 → 原地换成口型动画，其余交互完全不变 */
      function degrade() {
        if (fallback) return;
        fallback = true;
        if (vid) vid.style.display = 'none';
        if (mouth) mouth.classList.add('on');
      }
      ctx.on(vid, 'error', degrade);
      /* error 事件不一定来（例如失败被缓存），1.5s 后再用 readyState 兜一次 */
      ctx.after(1500, function () { if (vid && vid.readyState === 0) degrade(); });

      /* 点播放进入 3.1；键盘 → 由 core.js 统一处理，场景里不绑方向键 */
      ctx.on('#mpPlay', 'click', function () { ctx.next(); });
    },

    /* ---- 3.1 播放：播 2 遍后自动进入揭晓 ---- */
    function (ctx) {
      ctx.set(`
        <div class="mp-wrap">
          ${stageHTML(false, true)}
          <div class="body muted mp-hint" id="mpHint">看这个视频，告诉我你听到了什么。</div>
        </div>
      `);

      var vid = ctx.q('#mcgurkVid');
      var mouth = ctx.q('#mpMouthWrap');
      var play = ctx.q('#mpPlay');
      var hint = ctx.q('#mpHint');

      /* 提示语淡出 */
      ctx.soon(function () { hint.classList.add('gone'); }, 60);

      var done = false;
      function finish() { if (done) return; done = true; ctx.next(); }

      /* 口型替身：放 2 遍（≈5s）后前进 */
      var running = false;
      function mouthRun() {
        if (running) return;
        running = true;
        fallback = true;
        if (vid) vid.style.display = 'none';
        if (mouth) mouth.classList.add('on');
        if (play) play.classList.add('gone');
        ctx.after(PLAYS * FALLBACK_PLAY_MS, finish);
      }

      /* 3.0 已经知道文件缺失，或者这一刻才发现文件坏了 */
      if (fallback) { mouthRun(); return; }
      ctx.on(vid, 'error', mouthRun);

      function kick() {
        var p = vid.play();
        if (p && p.catch) p.catch(function () {
          if (vid.error) { mouthRun(); return; }        /* 文件坏了 → 口型 */
          play.classList.remove('gone');                /* 自动播放被拦 → 等一次点击 */
          ctx.toast('浏览器拦截了自动播放，点一下播放按钮');
        });
      }

      var plays = 0;
      ctx.on(vid, 'ended', function () {
        plays++;
        if (plays < PLAYS) { vid.currentTime = 0; kick(); }
        else { finish(); }
      });

      play.classList.add('gone');
      kick();
      /* 被拦时播放按钮会重新出现，点它继续 */
      ctx.on(play, 'click', function () { play.classList.add('gone'); kick(); });
      /* 保险丝：万一 ended 不来（文件损坏、解码卡住），40s 后也能继续 */
      ctx.after(PLAYS * 20000, finish);
    },

    /* ---- 3.2 揭晓：左视频 · 右文字 + 整合示意 ---- */
    function (ctx) {
      ctx.set(`
        <div class="mp-reveal">
          ${stageHTML(true, false)}

          <div class="mp-col">
            <div class="card mp-card mp-slide" id="mpCard" style="--d:.1s">
              <p class="body">声波没变，为什么你听到的音节变了？</p>
              <p class="body">因为眼睛在影响耳朵。大脑在整合，在猜。</p>
            </div>

            <div class="mp-flow" id="mpFlow">
              <div class="mp-node">${ICON.eye('ico lg c-blue')}<span>眼睛</span></div>
              <span class="mp-dash"></span>
              <div class="mp-node">${ICON.brain('ico lg c-purple')}<span>大脑</span></div>
              <span class="mp-dash"></span>
              <div class="mp-node">${ICON.spark('ico lg c-orange')}<span>知觉</span></div>
            </div>
          </div>
        </div>
      `);

      /* 视频停在第一帧，别留一块黑 */
      var vid = ctx.q('#mcgurkVid');
      if (vid) {
        ctx.on(vid, 'loadedmetadata', function () {
          try { vid.currentTime = .05; } catch (e) {}
        });
      }

      /* 文字卡滑入（400ms）之后，三个环节每隔 200ms 亮一个 */
      ctx.each('#mpFlow .mp-node', function (el, i) {
        ctx.after(900 + i * 200, function () { el.classList.add('on'); });
      });
    },

    /* ---- 3.3 过渡 ---- */
    function (ctx) {
      ctx.set(`
        <h2 class="title center anim fade" style="--d:0s">知觉是大脑的推断。那这个推断在哪里发生？</h2>
      `);
    },

  ],
});

})();
