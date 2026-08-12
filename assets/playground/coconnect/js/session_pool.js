/* COCOnnect — pool session sampler (ported from common/session.py + exp2.py, v4)
   图片级去重（localStorage）；等级保真过滤：
     错误试次按 swap 位置 |swap_pos+1-目标|≤SWAP_TOLERANCE（±3）
     正确试次按文本长度 |len-目标|≤LEN_TOLERANCE（±4）
   动态试次 n（cap 25、margin 0.95，会话1 计算、会话2 复用）。
*/
'use strict';

const SessionPool = {
  images: [],
  _index: {},
  loaded: false,
  _dynN: {},                 // key `subject|level` -> n（会话2 复用）

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
    try { return new Set(JSON.parse(localStorage.getItem(this._usedKey(subject)) || '[]')); }
    catch (e) { return new Set(); }
  },

  markShown(subject, ids) {
    const used = this.usedImages(subject);
    for (const id of ids) used.add(id);
    localStorage.setItem(this._usedKey(subject), JSON.stringify([...used]));
  },

  resetUsed(subject) {
    localStorage.removeItem(this._usedKey(subject));
    delete this._dynN[subject + '|*'];
    for (const k of Object.keys(this._dynN)) if (k.startsWith(subject + '|')) delete this._dynN[k];
  },

  // ---- 等级保真过滤 ----
  _lenOk(im, level, target) {
    const txt = im.texts && im.texts[level];
    if (!txt) return false;
    return Math.abs(txt.length - target) <= CONFIG.EXP2_LEN_TOLERANCE;
  },
  _swapOk(im, level, target) {
    const sp = im.errors && im.errors[level] && im.errors[level].swap_pos;
    if (sp == null) return false;
    return Math.abs((sp + 1) - target) <= CONFIG.EXP2_SWAP_TOLERANCE;
  },

  _errText(im, level) {
    const err = (im.errors && im.errors[level]) || {};
    return err.error || im.texts[level];
  },

  /** Exp1 finecurve：每长度 n_half 正确 + n_half 错误（图不重复）。 */
  fineCurveTrials(subject, trialsPerLength, seed) {
    const used = this.usedImages(subject);
    const rng = seededRng(seed == null ? 20260807 : seed);
    const trials = [];
    const chosen = new Set();
    const nHalf = Math.max(1, Math.floor(trialsPerLength / 2));

    for (const level of CONFIG.LEVELS) {
      const target = CONFIG.LEVEL_CHAR_TARGETS[level];
      const avail = this.images.filter((im) => !used.has(im.id) && !chosen.has(im.id) && im.texts[level]);
      const onlyLen = avail.filter((im) => this._lenOk(im, level, target) && !this._swapOk(im, level, target));
      const lenCand = avail.filter((im) => this._lenOk(im, level, target));
      if (lenCand.length < nHalf) throw new Error(`可用图不足（等级 ${level} 正确侧需 ${nHalf}，剩 ${lenCand.length}）`);

      // 正确：优先 only_len，不足从 len_cand 补齐
      const picked = shuffle(onlyLen, rng).slice(0, nHalf);
      if (picked.length < nHalf) {
        const extra = shuffle(lenCand.filter((im) => !picked.includes(im)), rng).slice(0, nHalf - picked.length);
        picked.push(...extra);
      }
      picked.forEach((im) => chosen.add(im.id));

      // 错误：swap-ok 池（排除已选正确图）
      const swapCand = this.images.filter((im) => !used.has(im.id) && !chosen.has(im.id)
        && im.texts[level] && this._swapOk(im, level, target));
      if (swapCand.length < nHalf) throw new Error(`可用图不足（等级 ${level} 错误侧需 ${nHalf}，剩 ${swapCand.length}）`);
      const wrong = shuffle(swapCand, rng).slice(0, nHalf);
      wrong.forEach((im) => chosen.add(im.id));

      for (const im of picked) {
        trials.push({ im, level, text: im.texts[level], answer: 'yes', swapPos: null });
      }
      for (const im of wrong) {
        trials.push({ im, level, text: this._errText(im, level), answer: 'no', swapPos: this._swapPos(im, level) });
      }
    }
    return shuffle(trials, rng);
  },

  _swapPos(im, level) {
    const e = im.errors && im.errors[level];
    return (e && e.swap_pos != null) ? e.swap_pos : null;
  },

  /** Exp2：目标等级抽 n 试次（n//2 正确 + n-n//2 错误），等级保真过滤。 */
  exp2Trials(subject, level, n, seed) {
    const used = this.usedImages(subject);
    const target = CONFIG.LEVEL_CHAR_TARGETS[level];
    const nCorrect = Math.floor(n / 2);
    const nWrong = n - nCorrect;
    const rng = seededRng(seed == null ? 1000 : seed);

    const avail = this.images.filter((im) => !used.has(im.id) && im.texts[level]);
    const onlyLen = avail.filter((im) => this._lenOk(im, level, target) && !this._swapOk(im, level, target));
    const lenCand = avail.filter((im) => this._lenOk(im, level, target));
    if (lenCand.length < nCorrect) throw new Error(`可用图不足（正确侧需 ${nCorrect}，剩 ${lenCand.length}）。请补起草或放宽容差。`);

    const pickedCorrect = shuffle(onlyLen, rng).slice(0, nCorrect);
    if (pickedCorrect.length < nCorrect) {
      const extra = shuffle(lenCand.filter((im) => !pickedCorrect.includes(im)), rng).slice(0, nCorrect - pickedCorrect.length);
      pickedCorrect.push(...extra);
    }
    const usedPick = new Set(pickedCorrect.map((im) => im.id));

    const swapCand = this.images.filter((im) => !used.has(im.id) && !usedPick.has(im.id)
      && im.texts[level] && this._swapOk(im, level, target));
    if (swapCand.length < nWrong) throw new Error(`可用图不足（错误侧需 ${nWrong}，剩 ${swapCand.length}）。请补起草或放宽容差。`);

    const pickedWrong = shuffle(swapCand, rng).slice(0, nWrong);

    const trials = [];
    for (const im of pickedCorrect) trials.push({ im, level, text: im.texts[level], answer: 'yes', swapPos: null });
    for (const im of pickedWrong) trials.push({ im, level, text: this._errText(im, level), answer: 'no', swapPos: this._swapPos(im, level) });
    return shuffle(trials, rng);
  },

  /** 动态试次 n（exp2.compute_dynamic_n）。n_total_conditions = 两会话条件总数（24）。 */
  computeDynamicN(subject, level, nTotalConditions) {
    const key = subject + '|' + level;
    if (this._dynN[key]) return this._dynN[key];
    const used = this.usedImages(subject);
    const target = CONFIG.LEVEL_CHAR_TARGETS[level];
    const cap = CONFIG.EXP2_TRIALS_PER_CONDITION;       // 25
    const N = Math.max(1, nTotalConditions);            // 24
    const avail = this.images.filter((im) => !used.has(im.id) && im.texts[level]);
    const swapCand = avail.filter((im) => this._swapOk(im, level, target));
    const lenCand = avail.filter((im) => this._lenOk(im, level, target));
    const union = new Set(swapCand.map((im) => im.id));
    lenCand.forEach((im) => union.add(im.id));

    const swapEff = swapCand.length / (N * 0.95);
    const lenEff = (2 * lenCand.length) / N;
    const unionEff = union.size / N;
    const bound = Math.min(swapEff, lenEff, unionEff);
    const n = Math.max(1, Math.min(cap, Math.floor(CONFIG.EXP2_DYNAMIC_MARGIN * bound)));
    this._dynN[key] = n;
    return n;
  },

  /** 练习：2 正确 + 2 错误，真实池图 L12（v4.2）。返回未记录数据的试次。 */
  practiceTrials(subject) {
    const n = CONFIG.PRACTICE_TRIALS;                    // 4
    const level = 'L12';
    const target = CONFIG.LEVEL_CHAR_TARGETS[level];
    const used = this.usedImages(subject);
    const rng = seededRng(20260807);
    const avail = this.images.filter((im) => !used.has(im.id) && im.texts[level]);
    const lenCand = avail.filter((im) => this._lenOk(im, level, target));
    const swapCand = avail.filter((im) => this._swapOk(im, level, target));
    const nHalf = Math.floor(n / 2);
    const correct = shuffle(lenCand, rng).slice(0, nHalf);
    const wrong = shuffle(swapCand.filter((im) => !correct.includes(im)), rng).slice(0, nHalf);
    const trials = [];
    for (const im of correct) trials.push({ im, level, text: im.texts[level], answer: 'yes' });
    for (const im of wrong) trials.push({ im, level, text: this._errText(im, level), answer: 'no' });
    return shuffle(trials, rng);
  },
};

/** 固定序列清单（v5.1-B）：网页版消费预生成的清单（含图片路径）。 */
const Manifest = {
  async loadExp1(run) {
    const res = await fetch(`data/manifests/exp1_${run}.json`, { cache: 'no-cache' });
    if (!res.ok) throw new Error('清单加载失败: exp1_' + run);
    return await res.json();
  },
  async loadExp2(level, session) {
    const res = await fetch(`data/manifests/exp2_${level}_s${session}.json`, { cache: 'no-cache' });
    if (!res.ok) throw new Error('清单加载失败: exp2_' + level + '_s' + session);
    return await res.json();
  },
};
