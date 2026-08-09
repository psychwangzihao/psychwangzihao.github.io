/* COCOnnect — metronome (ported from common/metronome.py, v4)
   660Hz sine "ding": 2ms linear attack + exponential decay (tau 0.09s),
   total tick 0.35s (shortened at high freq), volume 0.9.
   Supports alignTo (wall-clock seconds) for auditory prep-beat lock-phase.
*/
'use strict';

const Metronome = {
  _ctx: null,
  _timer: null,
  _nextWall: 0,
  _freq: 0,
  _volume: 0.9,
  _tickS: 0.35,
  running: false,

  _ensureCtx() {
    if (!this._ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      this._ctx = new AC();
    }
    if (this._ctx.state === 'suspended') this._ctx.resume();
    return this._ctx;
  },

  /** tick 时长：min(0.35, max(0.01, period-0.03)) —— 高频自动缩短（同 metronome.py） */
  _computeTickS(freq) {
    const period = 1 / freq;
    return Math.min(CONFIG.METRONOME_TICK_S, Math.max(0.01, period - 0.03));
  },

  /** 在 ctx 时钟时间 ctxTime 处播一个 660Hz 钟形叮。 */
  _scheduleTick(ctxTime, vol) {
    const ctx = this._ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = CONFIG.METRONOME_TONE_HZ;   // 660 Hz
    const dur = this._tickS;
    const attack = CONFIG.METRONOME_ATTACK_S;         // 2 ms 线性起音
    gain.gain.setValueAtTime(0, ctxTime);
    gain.gain.linearRampToValueAtTime(vol, ctxTime + attack);
    // 指数衰减（tau=0.09s）→ 0.001
    gain.gain.setValueAtTime(vol, ctxTime + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, ctxTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctxTime);
    osc.stop(ctxTime + dur + 0.01);
  },

  /** 前瞻调度：把未来 120ms 内的 tick 全部排进音频时钟。 */
  _loop() {
    const ctx = this._ctx;
    const nowWall = performance.now() / 1000;
    const offset = ctx.currentTime - nowWall;          // ctx时间 = 墙钟时间 + offset
    const period = 1 / this._freq;
    while (this._nextWall < nowWall + 0.12) {
      this._scheduleTick(this._nextWall + offset, this._volume);
      this._nextWall += period;
    }
  },

  /**
   * 启动节拍器。
   * @param freq    Hz
   * @param volume  0..1
   * @param opts    {alignTo: 墙钟秒} —— 若给定，首个 tick 排在该时刻
   *                （用于听觉预备拍锁相：text 在 alignTo+beats*period 出现）。
   */
  start(freq, volume, opts) {
    const ctx = this._ensureCtx();
    this.stop();
    this._freq = freq;
    this._volume = (volume == null ? CONFIG.METRONOME_VOLUME : volume);
    this._tickS = this._computeTickS(freq);
    const nowWall = performance.now() / 1000;
    const alignTo = (opts && opts.alignTo != null) ? opts.alignTo : null;
    this._nextWall = (alignTo != null && alignTo > nowWall) ? alignTo : nowWall + 0.05;
    this.running = true;
    this._timer = setInterval(() => { if (this.running) this._loop(); }, 50);
    this._loop();
  },

  /** 停止。 */
  stop() {
    this.running = false;
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
  },
};
