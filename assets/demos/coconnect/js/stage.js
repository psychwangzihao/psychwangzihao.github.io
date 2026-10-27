/* ============================================================
 * COCOnnect — 舞台与输入
 *
 * Stage：整块灰底 stage 的 DOM 管理（对应 PsychoPy 的那个 window）。
 * Input：键盘事件的队列化 —— 对应 event.getKeys() 的语义：
 *        按下的键进队列，谁在等谁取；没人在等就先存着，
 *        下一次 wait() 立刻拿到（这一点很关键：被试手快，
 *        按键常常发生在屏幕还没翻过来的时候，不能丢）。
 * ============================================================ */
'use strict';

const Stage = {
  el() { return document.getElementById('stage'); },
  show(html) { this.el().innerHTML = html; },
  clear() { this.el().innerHTML = ''; },
};

const Input = {
  _queue: [],       // 还没被取走的按键
  _resolve: null,   // 当前唯一在等的 waiter（流程是严格串行的，不会有第二个）
  _allow: null,     // 那个 waiter 接受的键集合；null = 任意键
  _ready: false,

  init() {
    if (this._ready) return;
    this._ready = true;
    /* 捕获阶段监听：即使焦点在按钮/输入框上也能收到 */
    document.addEventListener('keydown', (e) => this._onKey(e), true);
    /* 网页上的按钮统一走这条委托 —— 点按钮 = 按一下那个键。
       这样所有屏幕的「键盘/鼠标」两套交互就只有一份逻辑。 */
    document.addEventListener('click', (e) => {
      const b = e.target.closest ? e.target.closest('[data-key]') : null;
      if (!b) return;
      let k = b.getAttribute('data-key');
      if (k === 'space') k = ' ';
      this.push(k);
    });
    /* 切走再回来时清空队列 —— 免得回来被之前的按键直接翻页 */
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.clear();
    });
  },

  _norm(e) {
    let k = e.key;
    if (k === undefined || k === null) return null;
    if (k.length === 1) k = k.toLowerCase();          // Y → y、' ' 保持
    if (k === 'Spacebar') k = ' ';
    if (k === 'Esc') k = 'Escape';
    if (k === 'Up') k = 'ArrowUp';
    if (k === 'Down') k = 'ArrowDown';
    if (k === 'Left') k = 'ArrowLeft';
    if (k === 'Right') k = 'ArrowRight';
    return k;
  },

  /* 字母键会被中文输入法吞掉（组合框打开期间 keydown 不再上报），
     所以数字键 1/2/3 是必需的备用通道 —— 见 config.js 的说明。 */
  _onKey(e) {
    const k = this._norm(e);
    if (k === null) return;
    if (k === ' ' || k.indexOf('Arrow') === 0 || k === 'Tab') e.preventDefault();
    if (k === 'Escape') this._lastEscAt = performance.now();
    this.push(k);
  },

  /* 最近 ms 毫秒内真的按过 Esc 吗？
     全屏兜底（app.js 的 fullscreenchange）靠它判断：某些浏览器会把
     全屏下的 Esc 吞掉，页面收不到 keydown，只能拿「退出全屏」当退出信号；
     但另一些浏览器两件事都会发生 —— 那就不能补第二次，否则一次按键
     算成两次，结束屏刚出来就被自己关掉。 */
  _lastEscAt: -1e9,
  sawEscapeWithin(ms) { return (performance.now() - this._lastEscAt) < ms; },

  /* 一个键进来了（来自键盘，或来自点按钮）。有人在等且这个键是它等的
     → 立刻交付；否则进队列等着。 */
  push(k) {
    if (this._resolve && (!this._allow || this._allow.indexOf(k) >= 0)) {
      const done = this._resolve;
      this._resolve = null; this._allow = null;
      done(k);
      return;
    }
    this._queue.push(k);
  },

  clear() { this._queue.length = 0; },

  /* 等到 keys 里的任意一个键。keys 省略 = 任意键。
     先查队列：被试手快、屏幕还没翻过来就按了，这个键不能丢。 */
  wait(keys) {
    const allow = keys ? keys.slice() : null;
    for (let i = 0; i < this._queue.length; i++) {
      if (!allow || allow.indexOf(this._queue[i]) >= 0) {
        return Promise.resolve(this._queue.splice(i, 1)[0]);
      }
    }
    return new Promise((resolve) => { this._resolve = resolve; this._allow = allow; });
  },

  /* 从此刻起等待，忽略之前积压的键。用于屏幕刚出现的那一刻。 */
  waitFresh(keys) { this.clear(); return this.wait(keys); },

  /* N 毫秒后自动 resolve（用于注视点那种定时屏）。 */
  sleep(ms) { return new Promise((r) => setTimeout(r, ms)); },
};
