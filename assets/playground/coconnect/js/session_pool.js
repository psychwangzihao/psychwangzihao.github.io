/* COCOnnect — pool session sampler (ported from common/session.py)
   图片级去重：每被试一张图只显示一次（localStorage）。
*/
'use strict';

const SessionPool = {
  images: [],
  _index: {},
  loaded: false,

  async load() {
    if (this.loaded) return this.images;
    const res = await fetch(CONFIG.POOL_JSON, { cache: 'no-cache' });
    if (!res.ok) throw new Error('无法加载池子数据: ' + res.status);
    this.images = await res.json();
    this._index = {};
    for (const im of this.images) this._index[im.id] = im;
    this.loaded = true;
    return this.images;
  },

  _usedKey(subject) { return 'coconnect_used_' + subject; },

  usedImages(subject) {
    try {
      return new Set(JSON.parse(localStorage.getItem(this._usedKey(subject)) || '[]'));
    } catch (e) { return new Set(); }
  },

  markShown(subject, ids) {
    const used = this.usedImages(subject);
    for (const id of ids) used.add(id);
    localStorage.setItem(this._usedKey(subject), JSON.stringify([...used]));
  },

  resetUsed(subject) {
    localStorage.removeItem(this._usedKey(subject));
  },

  /** Exp1 finecurve：每长度 trialsPerLength 试次，正误各半（交替），图不重复。 */
  fineCurveTrials(subject, trialsPerLength, seed) {
    const used = this.usedImages(subject);
    const avail = this.images.filter((im) => !used.has(im.id));
    const nNeeded = CONFIG.LEVELS.length * trialsPerLength;
    if (avail.length < nNeeded) {
      throw new Error(`可用图不足：精细曲线需 ${nNeeded} 张不重复图，剩 ${avail.length}。`);
    }
    const rng = seededRng(seed == null ? 20260807 : seed);
    const chosen = shuffle(avail, rng).slice(0, nNeeded);
    const trials = [];
    for (let i = 0; i < CONFIG.LEVELS.length; i++) {
      const level = CONFIG.LEVELS[i];
      for (let j = 0; j < trialsPerLength; j++) {
        const im = chosen[i * trialsPerLength + j];
        const err = (im.errors && im.errors[level]) || {};
        const errTxt = err.error || im.texts[level];
        const isCorrect = (j % 2 === 0);
        trials.push({
          im, level,
          text: isCorrect ? im.texts[level] : errTxt,
          answer: isCorrect ? 'yes' : 'no',
        });
      }
    }
    return shuffle(trials, rng);
  },

  /** Exp2：目标等级抽 n 张未用图，正误各半（交替），图不重复。 */
  exp2Trials(subject, level, n, seed) {
    const used = this.usedImages(subject);
    const avail = this.images.filter((im) => !used.has(im.id) && im.texts[level]);
    if (avail.length < n) {
      throw new Error(`可用图不足：需 ${n} 张（等级 ${level}），剩 ${avail.length}。`);
    }
    const rng = seededRng(seed == null ? 1000 : seed);
    const chosen = shuffle(avail, rng).slice(0, n);
    const trials = [];
    for (let i = 0; i < chosen.length; i++) {
      const im = chosen[i];
      const err = (im.errors && im.errors[level]) || {};
      const errTxt = err.error || im.texts[level];
      const isCorrect = (i % 2 === 0);
      trials.push({
        im, level,
        text: isCorrect ? im.texts[level] : errTxt,
        answer: isCorrect ? 'yes' : 'no',
      });
    }
    return shuffle(trials, rng);
  },
};
