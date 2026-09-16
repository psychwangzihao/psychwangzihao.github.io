/* ============================================================
 * 眼见为实吗？ / Is Seeing Believing?
 * core.js — 场景注册、状态机、导航、键盘、URL 同步
 * 无依赖，纯原生 JS。
 *
 * 场景模块的写法（见 s01_tree.js 等）：
 *
 *   PERCEPTION.scene({
 *     id: 'tree',                  // 用于 URL hash：#scene=tree&state=1
 *     label: '树倒悖论',            // 调试面板显示
 *     noClick: false,              // true = 本场景禁止「点击任意处前进」
 *     states: [
 *       function (ctx) {           // 每个状态一个函数
 *         ctx.set(`<div class="anim">...</div>`);
 *         ctx.on('#voteA', 'click', () => {...});
 *         ctx.raf(t => { ...动画... });
 *         ctx.after(2000, () => ctx.next());
 *         // 可选：return 一个清理函数
 *       },
 *     ],
 *   });
 *
 * ctx 提供的所有监听器/定时器/动画帧都会在切场景时自动清理，
 * 所以 60 多个状态来回切换也不会泄漏。
 * ============================================================ */
(function () {
  'use strict';

  var SCENES = [];
  var cssSeen = {};

  /* ---------------- 注册 API（供场景文件调用） ---------------- */

  window.PERCEPTION = {
    scene: function (def) { SCENES.push(def); },
    /** 注入一段场景专属 CSS（同一 key 只注入一次） */
    css: function (key, text) {
      if (cssSeen[key]) return;
      cssSeen[key] = true;
      var s = document.createElement('style');
      s.textContent = text;
      document.head.appendChild(s);
    },
    goto: function (sceneIdx, state) { goto(sceneIdx, state); },
    next: function () { next(); },
    prev: function () { prev(); },
    scenes: SCENES,
  };

  /* ---------------- DOM ---------------- */

  var stage = document.getElementById('stage');
  var progress = document.getElementById('progress');
  var progressFill = document.getElementById('progressFill');
  var navbar = document.getElementById('navbar');
  var dotsEl = document.getElementById('dots');
  var blackout = document.getElementById('blackout');
  var debugEl = document.getElementById('debug');
  var fsbtn = document.getElementById('fsbtn');
  var toastEl = document.getElementById('toast');

  /* ---------------- 状态 ---------------- */

  var si = 0, st = 0;          // 场景索引 / 状态索引
  var busy = false;            // 切换防抖
  var nextGate = null;         // 见 ctx.holdNext()
  var prevGate = null;         // 见 ctx.holdPrev()：往回按时，先把已露出的行收回去
  var stepPos = {};            // "场景:状态" → 已露出几行。来回走时按原样恢复
  var dispose = null;          // 当前状态的清理函数
  var curEl = null;            // 当前 .scene 元素
  var seen = [];               // 每个场景是否到过（导航圆点用）
  var debugOn = false;
  var blackOn = false;
  var dark = false;

  var params = new URLSearchParams(location.search);
  var DEBUG_DEFAULT = params.get('debug') === '1';

  var totalStates = function () {
    var n = 0;
    for (var i = 0; i < SCENES.length; i++) n += SCENES[i].states.length;
    return n;
  };
  var flatIndex = function (a, b) {
    var n = 0;
    for (var i = 0; i < a; i++) n += SCENES[i].states.length;
    return n + b;
  };

  /* ---------------- ctx：带自动清理的小工具集 ---------------- */

  function makeCtx() {
    var kill = [];
    var ctx = {
      /** 写入本状态的 HTML，返回 wrap 元素 */
      set: function (html) { curEl.innerHTML = html; return curEl; },
      /** 追加 HTML */
      add: function (html) { curEl.insertAdjacentHTML('beforeend', html); return curEl; },
      q: function (sel) { return curEl.querySelector(sel); },
      qa: function (sel) { return Array.prototype.slice.call(curEl.querySelectorAll(sel)); },

      /** 事件绑定（target 可以是元素或选择器字符串） */
      on: function (target, type, fn, opts) {
        var t = typeof target === 'string' ? curEl.querySelector(target) : target;
        if (!t) return null;
        t.addEventListener(type, fn, opts);
        kill.push(function () { t.removeEventListener(type, fn, opts); });
        return t;
      },
      /** 给一组元素批量绑定 */
      each: function (sel, fn) {
        ctx.qa(sel).forEach(function (el, i) { fn(el, i); });
      },
      /** requestAnimationFrame 循环（fn 收到 timestamp） */
      raf: function (fn) {
        var id = 0, alive = true;
        var loop = function (ts) { if (!alive) return; fn(ts); id = requestAnimationFrame(loop); };
        id = requestAnimationFrame(loop);
        kill.push(function () { alive = false; cancelAnimationFrame(id); });
      },
      /** 一次性动画帧 */
      frame: function (fn) { var id = requestAnimationFrame(fn); kill.push(function () { cancelAnimationFrame(id); }); },
      /** 延时 */
      after: function (ms, fn) { var id = setTimeout(fn, ms); kill.push(function () { clearTimeout(id); }); return id; },
      /** 周期 */
      every: function (ms, fn) { var id = setInterval(fn, ms); kill.push(function () { clearInterval(id); }); return id; },
      /** 延时后的 CSS 过渡（先 rAF 再改样式，保证 transition 生效） */
      soon: function (fn, delay) {
        ctx.after(delay || 30, function () { requestAnimationFrame(fn); });
      },
      /** 逐字/逐词出现：把 .wordby 内文本切成 <span class="w"> */
      wordby: function (selOrEl, step) {
        var el = typeof selOrEl === 'string' ? curEl.querySelector(selOrEl) : selOrEl;
        if (!el) return;
        var stepMs = step == null ? 50 : step;
        var text = el.textContent;
        el.textContent = '';
        var frag = document.createDocumentFragment();
        Array.prototype.forEach.call(text, function (ch, i) {
          var s = document.createElement('span');
          s.className = 'w';
          s.textContent = ch === ' ' ? ' ' : ch;
          s.style.animationDelay = (i * stepMs) + 'ms';
          frag.appendChild(s);
        });
        el.appendChild(frag);
      },
      /** 依次给元素加 class（用于错开动效） */
      stagger: function (sel, cls, step, delay) {
        ctx.qa(sel).forEach(function (el, i) {
          ctx.after((delay || 0) + i * step, function () { el.classList.add(cls); });
        });
      },
      /** 滑动/淡入进入 —— 给元素加上 .anim 即可，这里只是延迟触发 */
      reveal: function (sel, step, delay) {
        ctx.each(sel, function (el, i) { el.style.setProperty('--d', ((delay || 0) + i * step) / 1000 + 's'); });
      },

      toast: toast,
      next: function () { next(); },
      prev: function () { prev(); },
      goto: function (a, b) { goto(a, b); },
      /** 本场景 id / 状态序号 */
      sceneId: function () { return SCENES[si].id; },
      state: function () { return st; },
      /** 是否暗色场景（用于同步导航栏配色） */
      isDark: function () { return dark; },

      /** 让下一个状态在 N 毫秒后自动前进（只能有一次） */
      autoNext: function (ms) { ctx.after(ms, function () { next(); }); },

      /** 拦下「下一次前进」，先做别的事（例如揭晓答案），再按才翻页。
          传 null = 撤销拦截，恢复成正常翻页。
          只生效一次；离开本状态会自动失效。 */
      holdNext: function (fn) {
        if (!fn) { nextGate = null; return; }
        nextGate = function () { try { fn(); } catch (e) {} };
        kill.push(function () { nextGate = null; });
      },

      /** holdNext 的回退版本：拦下「上一次后退」。 */
      holdPrev: function (fn) {
        if (!fn) { prevGate = null; return; }
        prevGate = function () { try { fn(); } catch (e) {} };
        kill.push(function () { prevGate = null; });
      },

      /** 把一屏内容拆成「按一次出一行」。
          带 .step 的元素默认隐藏（CSS 里 opacity:0），每按一次 → 露出下一行；
          全部露完之后，再按才真的翻页。讲者因此完全掌握节奏 ——
          想停多久停多久，也不会因为手快把还没讲的内容翻过去。
          用法：ctx.set(`<p class="step">…</p><p class="step">…</p>`);
                ctx.steps(); */
      steps: function (sel) {
        var items = ctx.qa(sel || '.step');
        if (!items.length) return function () {};

        /* 进度按「场景:状态」记下来 —— 这是前进/后退对称的关键：
           往回走到这一屏时，要恢复成你离开它时的样子，
           而不是把已经讲过的行全部收回去重来。 */
        var key = si + ':' + st;
        var i = stepPos[key] || 0;

        function sync() {
          stepPos[key] = i;
          /* 还有没露的行 → 拦住「前进」；已经露了至少一行 → 拦住「后退」。
             两个方向因此各走一步，按几下过去就按几下回来。 */
          ctx.holdNext(i < items.length ? advance : null);
          ctx.holdPrev(i > 0 ? retreat : null);
        }
        function advance() { items[i].classList.add('on'); i++; sync(); }
        function retreat() { i--; items[i].classList.remove('on'); sync(); }

        /* 恢复：进来时先把该露的露出来 */
        for (var k = 0; k < i; k++) items[k].classList.add('on');
        sync();
        return advance;
      },

      dispose: function () { kill.forEach(function (f) { try { f(); } catch (e) {} }); kill.length = 0; },
    };
    return ctx;
  }

  /* ---------------- 渲染 ---------------- */

  function render(dir) {
    var scene = SCENES[si];
    if (!scene) return;
    st = Math.max(0, Math.min(scene.states.length - 1, st));
    seen[si] = true;

    /* 清理上一个状态 */
    if (dispose) { dispose(); dispose = null; }

    var old = curEl;
    var ctx = makeCtx();
    var wrap = document.createElement('div');
    wrap.className = 'scene';
    if (scene.dark) wrap.classList.add('dark');
    curEl = wrap;
    stage.appendChild(wrap);

    /* 先给 ctx 一个可用的 curEl，场景函数里 ctx.set() 才有目标 */
    var ret = null;
    try {
      ret = scene.states[st](ctx, wrap);
    } catch (err) {
      console.error('[scene ' + scene.id + ' state ' + st + ']', err);
      wrap.innerHTML = '<div class="body c-error">场景出错：' + (err && err.message) + '</div>';
    }

    /* 暗色判定放在建完 DOM 之后：除了场景级 scene.dark，
       状态里只要有一个 [data-dark] 元素也算 —— 一个场景里
       暗色和亮色状态混着来的时候（收束、回响），靠这个切导航配色。 */
    dark = !!scene.dark || !!wrap.querySelector('[data-dark]');
    syncDarkClass();

    dispose = function () {
      try { if (typeof ret === 'function') ret(); } catch (e) {}
      ctx.dispose();
    };

    /* 进入动画 */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        wrap.classList.add('in');
        if (old) old.classList.add('out');
      });
    });
    /* 旧场景移除 */
    if (old) {
      setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 700);
    }

    updateChrome();
    syncHash();
  }

  /* 暗色场景时给 body 打标，让底部导航圆点换成暗色配色 */
  function syncDarkClass() {
    document.body.classList.toggle('dark-scene', !!dark);
  }

  function updateChrome() {
    /* 进度条 */
    var pct = (flatIndex(si, st) / Math.max(1, totalStates() - 1)) * 100;
    progressFill.style.width = pct + '%';

    /* 导航圆点 */
    var html = '';
    for (var i = 0; i < SCENES.length; i++) {
      var cls = 'dot' + (i === si ? ' cur' : (seen[i] ? ' done' : ''));
      html += '<button class="' + cls + '" data-i="' + i + '" title="' +
              (i + 1) + '. ' + SCENES[i].label + '"></button>';
    }
    html += '<span class="lbl">' + (si + 1) + '/' + SCENES.length + ' · ' + (st + 1) + '/' + SCENES[si].states.length + '</span>';
    dotsEl.innerHTML = html;
    Array.prototype.forEach.call(dotsEl.querySelectorAll('.dot'), function (b) {
      b.addEventListener('click', function () { goto(parseInt(b.dataset.i, 10), 0); });
    });

    if (debugOn) renderDebug();
  }

  function syncHash() {
    var h = '#scene=' + SCENES[si].id + '&state=' + st;
    if (location.hash !== h) {
      history.replaceState(null, '', location.pathname + location.search + h);
    }
  }

  /* ---------------- 导航 ---------------- */

  function goto(a, b, dir) {
    if (busy) return;
    a = Math.max(0, Math.min(SCENES.length - 1, a));
    b = b == null ? 0 : Math.max(0, Math.min(SCENES[a].states.length - 1, b));
    if (a === si && b === st) return;
    busy = true;
    si = a; st = b;
    render(dir);
    setTimeout(function () { busy = false; }, 300);
  }

  function next() {
    if (busy) return;
    /* 场景可以「拦一下」下一次前进：先用掉它做别的事（比如揭晓答案），
       再按才真的翻页。见 ctx.holdNext。 */
    if (nextGate) { var g = nextGate; nextGate = null; g(); return; }
    var scene = SCENES[si];
    if (st < scene.states.length - 1) goto(si, st + 1, 1);
    else if (si < SCENES.length - 1) goto(si + 1, 0, 1);
  }

  function prev() {
    if (busy) return;
    /* 和 next() 对称：如果这一屏还有「已经露出来的行」，先收回去，
       而不是直接跳到上一屏把它整屏丢掉。
       否则前进要按 4 下才过得去的一屏，回退 1 下就跳过去了 —— 不对称。 */
    if (prevGate) { var g = prevGate; prevGate = null; g(); return; }
    if (st > 0) goto(si, st - 1, -1);
    else if (si > 0) goto(si - 1, SCENES[si - 1].states.length - 1, -1);
  }

  /* ---------------- 键盘 ---------------- */

  window.addEventListener('keydown', function (e) {
    if (e.isComposing) return;
    var k = e.key;

    if (k === 'Escape') {
      if (blackOn) { toggleBlack(); e.preventDefault(); return; }
      if (debugOn && DEBUG_DEFAULT === false) { toggleDebug(); e.preventDefault(); return; }
      if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
      return;
    }

    /* 场景可以先接管键盘（见 PERCEPTION.keyHook）。返回 true = 这个键我处理了，
       core 不再管它 —— 「想象光谱」那一幕的计数就是这么做的。 */
    if (PERCEPTION.keyHook && PERCEPTION.keyHook(k, e)) return;

    /* ⚠️ 这里的键位是**为翻页笔定的**，和别处反着来：
       很多翻页笔的两个按键发的就是 ↑ / ↓。原来 ↑↓ 是「换场景」，
       于是按下翻页笔会整幕整幕地跳过去，.step 逐行揭露全被跳过。
       现在 ↑↓ 和 →← PageUp PageDown 空格 一律 = 翻一页；
       换场景退到 [ ] 和数字键（排练用笔记本键盘时够用）。 */
    if (k === 'ArrowDown' || k === 'ArrowRight' || k === 'PageDown' ||
        k === ' ' || k === 'Enter' || k === 'n') {
      next(); e.preventDefault();
    } else if (k === 'ArrowUp' || k === 'ArrowLeft' || k === 'PageUp' || k === 'p') {
      prev(); e.preventDefault();
    } else if (k === ']') {
      if (si < SCENES.length - 1) goto(si + 1, 0); e.preventDefault();
    } else if (k === '[') {
      if (si > 0) goto(si - 1, 0); e.preventDefault();
    } else if (k === 'f' || k === 'F') {
      toggleFullscreen();
    } else if (k === 'x' || k === 'X') {
      /* 黑屏原来绑在 B 上 —— 但不少翻页笔的「黑屏」键发的就是 b，
         会和翻页打架。改到 X，并额外支持翻页笔常发的 '.'（黑屏键）。 */
      toggleBlack();
    } else if (k === '.') {
      toggleBlack();
    } else if (k === 'd' || k === 'D') {
      toggleDebug();
    } else if (k === 'Home') {
      goto(0, 0); e.preventDefault();
    } else if (false) {
      /* 数字键原来在这里跳场景 —— **本场去掉了**。
         「想象光谱」那一幕要用 1–5 数人数，两边会撞：
         讲者万一在别的屏上按了数字，会直接跳到某一幕去。
         换场景现在只走 [ ]（排练时用笔记本键盘）和底部圆点。 */
    } else if (k === '0') {
      /* 跳到「展览」那一幕（本场最后一幕）。按 id 找，不写死下标 —— 顺序还会调。 */
      var li = -1;
      for (var j = 0; j < SCENES.length; j++) if (SCENES[j].id === 'exhibition') { li = j; break; }
      goto(li >= 0 ? li : SCENES.length - 1, 0);
      e.preventDefault();
    } else if (k === '?' || k === '/') {
      toast('↑↓ / →← / 空格 翻页 · [ ] 换幕 · X 黑屏 · F 全屏');
      e.preventDefault();
    }
  });

  /* ---------------- 点击任意处前进（可被场景禁用） ---------------- */

  document.addEventListener('click', function (e) {
    var scene = SCENES[si];
    if (!scene || scene.noClick) return;
    /* 点在交互元素上不前进 */
    if (e.target.closest('button, a, input, select, textarea, canvas, svg, [data-noclick], #navbar, #debug, #fsbtn')) return;
    if (document.getElementById('perception-shield')) return; /* 场景自设的拦截层 */
    next();
  });

  /* ---------------- 全屏 / 黑屏 / 调试 ---------------- */

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
    else document.documentElement.requestFullscreen().catch(function () {});
  }
  fsbtn.addEventListener('click', toggleFullscreen);

  function toggleBlack() {
    blackOn = !blackOn;
    blackout.classList.toggle('on', blackOn);
    toast(blackOn ? '黑屏（再按 X 恢复）' : '');
  }

  function toggleDebug() {
    debugOn = !debugOn;
    debugEl.classList.toggle('on', debugOn);
    if (debugOn) renderDebug();
  }

  function renderDebug() {
    var scene = SCENES[si];
    var fps = fpsNow().toFixed(0);
    var html = '<div><b>场景</b> ' + si + ' · ' + scene.id + ' <span style="opacity:.6">' + scene.label + '</span></div>' +
      '<div><b>状态</b> ' + st + '/' + (scene.states.length - 1) + '</div>' +
      '<div><b>总进度</b> ' + (flatIndex(si, st) + 1) + '/' + totalStates() + '</div>' +
      '<div><b>FPS</b> ' + fps + ' · DPR ' + window.devicePixelRatio.toFixed(1) + '</div>' +
      '<div><b>尺寸</b> ' + window.innerWidth + '×' + window.innerHeight + '</div>' +
      '<div class="jump">';
    for (var i = 0; i < SCENES.length; i++) {
      html += '<button data-i="' + i + '">' + (i + 1) + ' ' + SCENES[i].label + '</button>';
    }
    html += '</div>';
    debugEl.innerHTML = html;
    Array.prototype.forEach.call(debugEl.querySelectorAll('.jump button'), function (b) {
      b.addEventListener('click', function () { goto(parseInt(b.dataset.i, 10), 0); });
    });
  }

  /* FPS 采样 */
  var frames = 0, fpsT0 = performance.now(), fps = 60;
  function fpsNow() { return fps; }
  (function tickFps(ts) {
    frames++;
    if (ts - fpsT0 >= 500) { fps = frames * 1000 / (ts - fpsT0); frames = 0; fpsT0 = ts; }
    if (debugOn) { /* 只在调试面板打开时刷新 DOM，避免无谓开销 */
      var el = debugEl.querySelector('div:nth-child(4)');
      if (el) el.innerHTML = '<b>FPS</b> ' + fps.toFixed(0);
    }
    requestAnimationFrame(tickFps);
  })(performance.now());

  /* ---------------- 轻提示 ---------------- */

  var toastTimer = null;
  function toast(msg) {
    if (!msg) { toastEl.classList.remove('on'); return; }
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('on'); }, 2200);
  }

  /* ---------------- 顶部/底部热区：浮现导航 ---------------- */

  var hideTimer = null;
  function showChrome() {
    progress.classList.add('on');
    navbar.classList.add('on');
    fsbtn.classList.add('on');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideChrome, 3000);
  }
  function hideChrome() {
    progress.classList.remove('on');
    navbar.classList.remove('on');
    fsbtn.classList.remove('on');
  }
  window.addEventListener('mousemove', function (e) {
    var h = window.innerHeight;
    if (e.clientY > h * 0.90 || e.clientY < h * 0.06) showChrome();
  });
  /* 触屏 / 首次进入短暂显示一次 */
  setTimeout(showChrome, 600);

  /* ---------------- 启动 ---------------- */

  function boot() {
    /* 初始场景：?scene=blindspot&state=2 或 #scene=blindspot&state=2 */
    var q = new URLSearchParams(location.search);
    var hs = new URLSearchParams(location.hash.replace(/^#/, ''));
    var wantId = q.get('scene') || hs.get('scene');
    var wantSt = parseInt(q.get('state') || hs.get('state') || '0', 10) || 0;
    if (wantId) {
      for (var i = 0; i < SCENES.length; i++) {
        if (SCENES[i].id === wantId) { si = i; st = wantSt; break; }
      }
    }
    for (var j = 0; j < si; j++) seen[j] = true;
    if (DEBUG_DEFAULT) { debugOn = true; debugEl.classList.add('on'); }
    render(1);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})();
