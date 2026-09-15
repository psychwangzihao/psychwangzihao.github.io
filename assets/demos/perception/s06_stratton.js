/* ============================================================
 * 场景 6：斯特拉顿眼镜  (id stratton · 7 个状态)
 * 目的：展示大脑可以根据输入重新接线。
 * 1897 年，心理学家 George Stratton 戴上了一副上下颠倒的眼镜。
 *
 * 翻转只作用于本状态自己的 #stratWrap —— 绝不去翻 #stage 或 body，
 * 否则导航圆点、进度条、轻提示都会跟着倒过来。
 * 文字另外反向翻一次（#stratText），这样世界是倒的、字还是正的。
 * ============================================================ */

/* 会翻过来的「世界」：天空 / 太阳 / 山 / 地面 / 房子 / 树 / 鸟 */
var STRAT_WORLD_SVG = `
<svg viewBox="0 0 240 110" aria-hidden="true">
  <rect x="0" y="0" width="240" height="110" fill="var(--accent-blue-light)"/>
  <circle cx="46" cy="26" r="12" fill="var(--warning)"/>
  <path d="M0 82 40 44 80 82Z" fill="var(--accent-green)" opacity=".45"/>
  <path d="M58 82 106 34 154 82Z" fill="var(--accent-green)" opacity=".65"/>
  <rect x="0" y="82" width="240" height="28" fill="var(--accent-green)"/>
  <rect x="170" y="60" width="32" height="22" fill="var(--bg-card)"/>
  <path d="M166 60 186 42 206 60Z" fill="var(--accent-orange)"/>
  <rect x="182" y="70" width="8" height="12" fill="var(--accent-orange)"/>
  <path d="M28 48 38 70 18 70Z" fill="var(--accent-green)" opacity=".9"/>
  <path d="M28 62 40 86 16 86Z" fill="var(--accent-green)" opacity=".9"/>
  <rect x="26" y="84" width="4" height="8" fill="var(--text-secondary)"/>
  <path d="M120 24q6-6 12 0M136 30q5-5 10 0" fill="none"
        stroke="var(--text-secondary)" stroke-width="2" stroke-linecap="round"/>
</svg>`;

PERCEPTION.css('scene-stratton', `
/* 翻转容器：只包住本状态的画面。文字同步反向翻回来 */
#stratWrap{transform-origin:center;transition:transform .6s var(--ease-in-out);}
#stratWrap.flip{transform:scaleY(-1);}
#stratText{transform-origin:center;transition:transform .6s var(--ease-in-out);}
#stratText.flip{transform:scaleY(-1);}

/* 被翻的那个世界。给得越大越有冲击力 —— 这一下是全场最「物理」的一刻，
   缩成一个小方块就只剩示意图了。SVG 的 viewBox 是 240×110，比例别改。 */
#stratWorld{
  width:min(64vw, 118vh);height:auto;aspect-ratio:240/110;
  min-width:320px;
  border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-md);
}
#stratWorld svg{display:block;width:100%;height:100%;}
/* 收束那一屏文字多，世界收小当背景用 */
.strat-sm #stratWorld{width:min(42vw,68vh);}

/* 恶心感：左右各晃 5px，0.5s 一个来回，跑 6 趟 = 3s */
@keyframes wobble{
  0%,100%{transform:translateX(0);}
  25%{transform:translateX(-5px);}
  75%{transform:translateX(5px);}
}
#stratWob.wob{animation:wobble .5s var(--ease-in-out) 6;}

/* 眼镜：淡入时轻微转一下 */
@keyframes stGlassIn{
  from{opacity:0;transform:rotate(-14deg) scale(.92);}
  to{opacity:1;transform:none;}
}
#stGlass{animation:stGlassIn var(--dur-slower) var(--ease-out) both;}
#stGlass .ico{width:8vw;height:8vw;min-width:64px;min-height:64px;}
`);

PERCEPTION.scene({
  id: 'stratton',
  label: '自我进化 · 颠倒的世界',
  states: [

    /* ---- 6.0 先猜一猜：揭晓之前先让人押一个答案 ----
       押过之后同一个结果会记得牢得多 —— 因为他在等自己的答案对不对。 */
    function (ctx) {
      ctx.set(QUIZ.html({
        q: '戴上把世界上下颠倒的眼镜，一直戴着。<br>戴到第八天，你会看到什么？',
        options: ['还是颠倒的', '正过来了', '知道是颠倒的，但不再难受'],
        answer: 1,
        note: ''
      }));
      /* 押对了 → 下一按直接跳到「第一天」，跳过「引入」那一屏（内容重复）；
         押错了 → 先让正确答案留一下，下一按正常进「引入」再讲一遍。 */
      QUIZ.mount(ctx, {
        answer: 1,
        onReveal: function (picked, correct) {
          if (correct) {
            ctx.holdNext(function () {
              ctx.goto(PERCEPTION.scenes.findIndex(function (x) { return x.id === 'stratton'; }), 2);
            });
          }
        }
      });
    },

    /* ---- 6.1 引入：1897 年，那副眼镜 ---- */
    function (ctx) {
      ctx.set(`
        <div id="stratWrap" style="transform-origin:center;transition:transform .6s var(--ease-in-out)">
          <div id="stratWob" class="stack">
            <div id="stGlass">${ICON.glasses('ico xl c-blue')}</div>

            <div class="subtitle center anim fade" style="--d:.45s;margin-top:2vw">
              1897 年，心理学家斯特拉顿戴上了一副眼镜。
            </div>

            <div class="step body center muted" style="margin-top:1vw">
              这副眼镜把世界上下颠倒。
            </div>
          </div>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 6.2 第一天：世界翻过来 ---- */
    function (ctx) {
      ctx.set(`
        <div id="stratWrap" style="transform-origin:center;transition:transform .6s var(--ease-in-out)">
          <div id="stratWob" class="stack">
            <div id="stratWorld" class="anim fade" style="--d:.1s">${STRAT_WORLD_SVG}</div>

            <div id="stratText" class="stack" style="margin-top:2vw">
              <div class="subtitle center anim fade" style="--d:.4s">
                第一天：没法走路，伸手全反，恶心呕吐。
              </div>
            </div>
          </div>
        </div>
      `);

      /* 先让学生看清正着的世界，再翻过去 —— 翻完开始晃 */
      ctx.after(450, function () {
        ctx.q('#stratWrap').classList.add('flip');
        ctx.q('#stratText').classList.add('flip');
      });
      ctx.after(1050, function () { ctx.q('#stratWob').classList.add('wob'); });
    },

    /* ---- 6.3 第八天：大脑把它正过来了 ---- */
    function (ctx) {
      ctx.set(`
        <div id="stratWrap" style="transform-origin:center;transition:transform .6s var(--ease-in-out)">
          <div id="stratWob" class="stack">
            <div id="stratWorld" class="anim fade" style="--d:.1s">${STRAT_WORLD_SVG}</div>

            <div id="stratText" class="stack" style="margin-top:2vw">
              <div class="subtitle center anim fade" style="--d:.4s">
                第八天：可以骑车、打篮球。世界「正过来了」。
              </div>
              <div class="body center anim fade"
                   style="--d:.55s;margin-top:1vw;color:var(--accent-blue);font-weight:var(--fw-medium)">
                不是眼镜变了，是大脑重新组织了视觉信号。
              </div>
            </div>
          </div>
        </div>
      `);

      /* 接上一状态的倒着，这里翻回正的 */
      ctx.q('#stratWrap').classList.add('flip');
      ctx.q('#stratText').classList.add('flip');
      ctx.after(450, function () {
        ctx.q('#stratWrap').classList.remove('flip');
        ctx.q('#stratText').classList.remove('flip');
      });
    },

    /* ---- 6.4 摘掉眼镜：又颠倒回去 ---- */
    function (ctx) {
      ctx.set(`
        <div id="stratWrap" style="transform-origin:center;transition:transform .6s var(--ease-in-out)">
          <div id="stratWob" class="stack">
            <div id="stratWorld" class="anim fade" style="--d:.1s">${STRAT_WORLD_SVG}</div>

            <div id="stratText" class="stack" style="margin-top:2vw">
              <div class="subtitle center anim fade" style="--d:.4s">
                摘掉眼镜后，世界又颠倒了。又需要几天恢复。
              </div>
            </div>
          </div>
        </div>
      `);

      ctx.after(450, function () {
        ctx.q('#stratWrap').classList.add('flip');
        ctx.q('#stratText').classList.add('flip');
      });
    },

    /* ---- 6.5 收束：不是硬件，是接线 ---- */
    function (ctx) {
      ctx.set(`
        <div id="stratWrap" class="strat-sm" style="transform-origin:center;transition:transform .6s var(--ease-in-out)">
          <div id="stratWob" class="stack">
            <div id="stratWorld" class="anim fade" style="--d:.1s">${STRAT_WORLD_SVG}</div>

            <div id="stratText" class="stack" style="margin-top:1.4vw">
              <div class="title center anim fade" style="--d:.4s">
                大脑不是固定硬件。它会根据输入重新接线。
              </div>

              <!-- 2025 年的 fMRI 研究，把斯特拉顿的故事接到现在，
                   而且时间尺度几乎重合（7–10 天 vs 第八天）—— 这是全场
                   最有说服力的一处呼应。脑区是后顶叶，正好接回脑图那一幕。 -->
              <div class="step body center" style="margin-top:var(--space-md);max-width:62vw;color:var(--text-secondary)">
                2025 年，Brewer 等人让被试连续两周戴着左右颠倒的眼镜。
              </div>

              <div class="step body center" style="max-width:62vw;color:var(--text-secondary)">
                <b class="c-blue">第七到十天</b>，他们适应了 —— 和斯特拉顿的「第八天」几乎重合。
                与此同时，他们<b class="c-blue">后顶叶</b>的视觉地图也跟着变了。
              </div>

              <div class="step body center" style="max-width:62vw;color:var(--text-secondary)">
                摘掉眼镜，一天之内恢复原样。可再戴回去 ——
                <b class="c-blue">这次只要一天</b>。
              </div>

              <div class="quote step" style="max-width:52vw">
                “The brain is a dynamic system,<br>constantly altering its own circuitry.”
                <span class="attr">David Eagleman, <i>Livewired</i></span>
              </div>
            </div>
          </div>
        </div>
      `);

      ctx.q('#stratWrap').classList.add('flip');
      ctx.q('#stratText').classList.add('flip');
      ctx.after(450, function () {
        ctx.q('#stratWrap').classList.remove('flip');
        ctx.q('#stratText').classList.remove('flip');
      });
      ctx.steps();
    },

    /* ---- 6.6 过渡 ---- */
    function (ctx) {
      ctx.set(`
        <h2 class="title center anim fade" style="--d:0s;max-width:70vw">
          那如果换一条完全不同的通道呢？
        </h2>
      `);
    },

  ],
});
