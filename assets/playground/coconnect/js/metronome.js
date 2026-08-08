/* COCOnnect — metronome (ported from common/metronome.py)
   1000Hz sine click, 50ms, with 2ms attack + 10ms decay envelope.
   Web Audio lookahead scheduler keeps steady tempo via the audio clock.
*/
'use strict';

const Metronome = {
  _ctx: null,
  _timer: null,
  _nextT: 0,
  _freq: 0,
  running: false,

  _ensureCtx() {
    if (!this._ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      this._ctx = new AC();
    }
    if (this._ctx.state === 'suspended') this._ctx.resume();
    return this._ctx;
  },

  _scheduleTick(t, volume) {
    const ctx = this._ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = CONFIG.METRONOME_TONE_HZ;   // 1000 Hz
    const dur = CONFIG.METRONOME_TICK_S;              // 50 ms
    const attack = 0.002;                             // 2ms attack
    const decay = 0.010;                              // 10ms decay
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + attack);
    gain.gain.setValueAtTime(volume, t + dur - decay);
    gain.gain.linearRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.01);
  },

  _loop() {
    // lookahead: keep scheduling ticks up to ~120ms ahead
    const ctx = this._ctx;
    const ahead = 0.12;
    const period = 1 / this._freq;
    while (this._nextT < ctx.currentTime + ahead) {
      this._scheduleTick(this._nextT, this._volume);
      this._nextT += period;
    }
  },

  /** 连续节拍器：从 start() 起持续到 stop()。 */
  start(freq, volume) {
    const ctx = this._ensureCtx();
    this.stop();
    this._freq = freq;
    this._volume = (volume == null ? CONFIG.METRONOME_VOLUME : volume);
    this._nextT = ctx.currentTime + 0.05;
    this.running = true;
    this._timer = setInterval(() => { if (this.running) this._loop(); }, 60);
    this._loop();
  },

  /** 停止。 */
  stop() {
    this.running = false;
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
  },
};
