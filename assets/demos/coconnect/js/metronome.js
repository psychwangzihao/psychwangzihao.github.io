/* ============================================================
 * COCOnnect — 定频节拍器（v8）
 *
 * 严格对齐 experiment.py 的 Metronome 类：
 *   单次滴答 = sin(2π·880·t) · exp(-t/0.015) · 0.7，长 80ms
 *   播放     = 缓冲 × gain（gain 由音量测试选定，默认 0.7）
 *   时序     = 每 1/hz 秒一拍，**首拍与图片出现同刻**
 *
 * Python 那边是「一次性生成整段缓冲再 sd.play」，浏览器这边等价的做法
 * 是把同一个波形做成 AudioBuffer，然后用**前瞻调度**（lookahead）在
 * WebAudio 自己的时钟上排点 —— setInterval 只负责"提前排"，真正决定
 * 发声时刻的是 ctx.currentTime，所以不受主线程卡顿影响，精度到采样点。
 *
 * 音频不可用时静默降级，实验照常（和 Python 一样）。
 * ============================================================ */
'use strict';

const Metronome = {
  _ctx: null,
  _buf: null,          // 单次滴答的波形（已含 0.7 峰值）
  _gainNode: null,     // GainNode：gain 由音量测试调
  _live: [],           // 已排点、可能还没响的 source
  _timer: null,
  _nextTime: 0,
  _period: 0,
  _horizon: 0.12,      // 前瞻窗口（秒）；循环模式拉长到 1s
  running: false,
  gainValue: CONFIG.METRONOME_GAIN_DEFAULT,

  /* 只在用户手势之后调用（浏览器不允许无手势创建 AudioContext）。
     返回是否可用。 */
  init() {
    if (this._ctx) { this._resume(); return !!this._buf; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try { this._ctx = new AC(); } catch (e) { this._ctx = null; return false; }
    this._resume();

    const ctx = this._ctx;
    const sr = ctx.sampleRate;
    const n = Math.max(1, Math.round(CONFIG.METRONOME_TICK_S * sr));
    const buf = ctx.createBuffer(1, n, sr);
    const d = buf.getChannelData(0);
    /* 逐样本重建 exp 包络的 880Hz 正弦 —— 和 numpy 那段逐项对应 */
    for (let i = 0; i < n; i++) {
      const t = i / sr;
      d[i] = Math.sin(2 * Math.PI * CONFIG.METRONOME_TONE_HZ * t)
           * Math.exp(-t / CONFIG.METRONOME_DECAY_TAU)
           * CONFIG.METRONOME_PEAK;
    }
    this._buf = buf;
    this._gainNode = ctx.createGain();
    this._gainNode.gain.value = this.gainValue;
    this._gainNode.connect(ctx.destination);
    return true;
  },

  _resume() {
    if (this._ctx && this._ctx.state === 'suspended') this._ctx.resume();
  },

  get available() { return !!(this._ctx && this._buf); },

  setGain(v) {
    this.gainValue = Math.min(CONFIG.METRONOME_GAIN_MAX,
                     Math.max(CONFIG.METRONOME_GAIN_MIN, Math.round(v * 100) / 100));
    if (this._gainNode) this._gainNode.gain.value = this.gainValue;
  },

  /* 排一个滴答在 ctx 时钟的 when 秒处发声。 */
  _schedule(when) {
    const src = this._ctx.createBufferSource();
    src.buffer = this._buf;
    src.connect(this._gainNode);
    src.start(when);
    this._live.push(src);
    src.onended = () => {
      const i = this._live.indexOf(src);
      if (i >= 0) this._live.splice(i, 1);
    };
  },

  /* 前瞻调度：每 25ms 往前看 _horizon 秒，把落在窗口内的拍排出去。 */
  _pump() {
    if (!this.running || !this._ctx) return;
    const horizon = this._ctx.currentTime + this._horizon;
    while (this._nextTime < horizon) {
      this._schedule(Math.max(this._nextTime, this._ctx.currentTime));
      this._nextTime += this._period;
    }
  },

  _begin(hz, horizon) {
    if (!this.available) return false;
    this.stop();
    this._period = 1 / Math.max(hz, 0.05);
    this._horizon = horizon;
    this._nextTime = this._ctx.currentTime + 0.005;   // 5ms 余量，别排到过去
    this.running = true;
    this._pump();
    this._timer = setInterval(() => this._pump(), 25);
    return true;
  },

  /* 图片出现的那一刻调用：首拍 = 此刻。 */
  start(hz) { this._begin(hz, 0.12); },

  /* 音量测试用：按 hz 无限循环（对应 Python 的 sd.play(loop=True)）。 */
  startLoop(hz) { this._begin(hz, 1.0); },

  /* 反应后 / 音量测试结束时调用。已排点但还没响的一律掐掉。 */
  stop() {
    this.running = false;
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
    if (!this._ctx) return;
    const now = this._ctx.currentTime;
    for (const src of this._live.slice()) {
      try { src.stop(now); } catch (e) { /* 已经停了 */ }
    }
    this._live.length = 0;
  },
};
