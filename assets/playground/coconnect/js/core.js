/* COCOnnect — core: key handling, display, timing, trial runners.
   Ported faithfully from experiment.py / exp2.py (v4.0).
*/
'use strict';

// =====================================================================
// 全局按键缓冲（keydown → 队列；peek/take/clear）
// =====================================================================
const KeyBuf = {
  _buf: [],
  init() {
    window.addEventListener('keydown', (e) => {
      const k = e.key;
      // 避免浏览器默认行为干扰全屏/空格滚动
      if (k === CONFIG.KEY_QUIT) e.preventDefault();
      if (k === CONFIG.KEY_CONTINUE) e.preventDefault();
      this._buf.push(k);
    });
  },
  peek() { return this._buf.slice(); },
  take() { const k = this._buf.slice(); this._buf = []; return k; },
  clear() { this._buf = []; },
};

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function randDur(base, jitter) {
  return (base + (Math.random() * 2 - 1) * jitter) * 1000;   // ms
}

// =====================================================================
// 显示层（#stage 内）
// =====================================================================
const Stage = {
  el() { return document.getElementById('stage'); },

  clear() {
    this.el().innerHTML = '';
  },

  show(html) {
    this.el().innerHTML = html;
  },

  /** 固定显示：给一段时间，期间轮询 Esc。返回 'quit' 或 'done'。 */
  async hold(durationMs) {
    const start = performance.now();
    while (performance.now() - start < durationMs) {
      if (KeyBuf.peek().includes(CONFIG.KEY_QUIT)) return 'quit';
      await sleep(20);
    }
    return 'done';
  },

  fixation() {
    this.show(`<div class="screen center"><div class="fix">+</div>${hintHtml()}</div>`);
  },

  image(path) {
    this.show(`<div class="screen center"><img class="stim-img" src="${path}" alt=""></div>${hintHtml()}`);
  },

  text(text) {
    const lines = wrapTextLines(text, 20);
    const html = lines.map((ln) => `<div class="text-line">${escHtml(ln)}</div>`).join('');
    this.show(`<div class="screen center text-block">${html}</div>${hintHtml()}`);
  },

  char(ch, marked, phraseMarked) {
    let cls = 'rsvp-char';
    if (marked) cls += ' word-mark';
    const mark = phraseMarked ? '<div class="phrase-mark"></div>' : '';
    this.show(`<div class="screen center">${mark}<div class="${cls}">${escHtml(ch)}</div></div>${hintHtml()}`);
  },

  question() {
    this.show(`<div class="screen center"><div class="q">?</div></div>${hintHtml()}`);
  },
};

function hintHtml() {
  return `<div class="hint">按 Y=是, N=否</div>`;
}

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// =====================================================================
// 响应收集（§5.2：文字不提前消失，首键记录 RT；20ms 轮询）
// =====================================================================
/** 在 windowMs 内收集 Y/N。onsetT 为 RT 起点（performance.now 时间戳）。
    Returns {key: 'y'|'n'|null|'quit', rt: ms|null} */
async function pollYN(windowMs, onsetT) {
  const start = performance.now();
  let resp = null;
  while (performance.now() - start < windowMs) {
    const keys = KeyBuf.take();
    if (keys.includes(CONFIG.KEY_QUIT)) return { key: 'quit', rt: null };
    if (resp == null) {
      for (const k of keys) {
        if (k === CONFIG.KEY_YES || k === CONFIG.KEY_NO) {
          resp = k;
          return { key: resp, rt: performance.now() - onsetT };
        }
      }
    }
    await sleep(20);
  }
  return { key: resp, rt: null };
}

// =====================================================================
// RSVP 逐字呈现（§7.3 + v3.1 §F：允许早按）
// =====================================================================
/** 逐字显示 text，每字 periodMs。word/phrase 起始下标加标记。
    Returns {key:'y'|'n'|null|'quit', rt, early}. rt 自 textOnset 起。 */
async function rsvpPresent(text, periodMs, textOnset) {
  const marks = dingMarks(text);
  for (let i = 0; i < text.length; i++) {
    const marked = marks.word.has(i);
    const phrase = marks.phrase.has(i);
    Stage.char(text[i], marked, phrase);
    const t0 = performance.now();
    while (performance.now() - t0 < periodMs) {
      const keys = KeyBuf.take();
      if (keys.includes(CONFIG.KEY_QUIT)) return { key: 'quit', rt: null, early: true };
      for (const k of keys) {
        if (k === CONFIG.KEY_YES || k === CONFIG.KEY_NO) {
          return { key: k, rt: performance.now() - textOnset, early: true };
        }
      }
      await sleep(20);
    }
  }
  return { key: null, rt: null, early: false };
}

function dingMarks(text) {
  const word = new Set(), phrase = new Set();
  for (let i = 0; i < text.length; i += CONFIG.EXP2_DING_WORD_LEN) word.add(i);
  for (let i = 0; i < text.length; i += CONFIG.EXP2_DING_PHRASE_LEN) phrase.add(i);
  return { word, phrase };
}

// =====================================================================
// 数据行组装（§9.1 / exp2 _row）
// =====================================================================
function expectedKey(answer) {
  return answer === 'yes' ? CONFIG.KEY_YES : CONFIG.KEY_NO;
}

function baseRow(im, text, answer, respKey, rt) {
  const expected = expectedKey(answer);
  let acc, sk;
  if (respKey === CONFIG.KEY_YES || respKey === CONFIG.KEY_NO) {
    acc = (respKey === expected) ? 1 : 0;
    sk = respKey;
  } else if (respKey === 'quit') {
    acc = ''; sk = 'quit';
  } else {
    acc = 0; sk = 'timeout';
  }
  return {
    image_id: im.id,
    text_nchar: text.length,
    text,
    correct_answer: answer,
    subject_key: sk,
    accuracy: acc,
    rt: (rt == null ? '' : Math.round(rt) / 1000),   // 秒，3位小数
  };
}

// =====================================================================
// Exp1 精细曲线试次（§5.1/§5.2：非 RSVP 整句；可选 rsvp 备用）
// =====================================================================
async function runMatchTrial(opts) {
  // opts: { im, text, answer, freq, rsvp }
  if (await showPhase(() => Stage.fixation(), randDur(CONFIG.FIX1_DURATION, CONFIG.FIX1_JITTER))) {
    return baseRow(opts.im, opts.text, opts.answer, 'quit', null);
  }
  if (await showPhase(() => Stage.image(opts.im.path), CONFIG.IMAGE_DURATION * 1000)) {
    return baseRow(opts.im, opts.text, opts.answer, 'quit', null);
  }
  if (await showPhase(() => Stage.fixation(), randDur(CONFIG.FIX2_DURATION, CONFIG.FIX2_JITTER))) {
    return baseRow(opts.im, opts.text, opts.answer, 'quit', null);
  }
  // 文字
  const textOnset = performance.now();
  let respKey = null, rt = null;
  if (opts.rsvp) {
    Stage.text(''); // fallback
    const r = await rsvpPresent(opts.text, 1000 / opts.freq, textOnset);
    if (r.key === 'quit') return baseRow(opts.im, opts.text, opts.answer, 'quit', null);
    respKey = r.key;
    if (respKey == null) {
      Stage.question();
      const qOnset = performance.now();
      const q = await pollYN(CONFIG.RSVP_RESPONSE_WINDOW * 1000, qOnset);
      respKey = q.key; rt = q.rt;
    } else {
      rt = r.rt;
    }
  } else {
    Stage.text(opts.text);
    const dur = textDuration(opts.text.length, opts.freq, false) * 1000;
    const r = await pollYN(dur, textOnset);
    respKey = r.key; rt = r.rt;
  }
  const row = baseRow(opts.im, opts.text, opts.answer, respKey, rt);
  row.text_duration = Math.round(textDuration(opts.text.length, opts.freq, !!opts.rsvp) * 1000) / 1000;
  return row;
}

/** 显示一个阶段并持续 hold；Esc 返回 'quit'。 */
async function showPhase(renderFn, durationMs) {
  renderFn();
  return await Stage.hold(durationMs);
}

// =====================================================================
// Exp2 条件试次（presentation: whole / rsvp_simple / rsvp_ding / auditory）
// =====================================================================
async function runConditionTrial(opts) {
  // opts: { im, text, answer, spec, session, blockTimer? }
  if (await showPhase(() => Stage.fixation(), randDur(CONFIG.FIX1_DURATION, CONFIG.FIX1_JITTER))) {
    return { row: baseRow(opts.im, opts.text, opts.answer, 'quit', null), resp: 'quit' };
  }
  if (await showPhase(() => Stage.image(opts.im.path), CONFIG.IMAGE_DURATION * 1000)) {
    return { row: baseRow(opts.im, opts.text, opts.answer, 'quit', null), resp: 'quit' };
  }
  if (await showPhase(() => Stage.fixation(), randDur(CONFIG.FIX2_DURATION, CONFIG.FIX2_JITTER))) {
    return { row: baseRow(opts.im, opts.text, opts.answer, 'quit', null), resp: 'quit' };
  }

  const pres = opts.spec.presentation || opts.spec.type;
  const textOnset = performance.now();
  let respKey = null, rt = null;

  if (pres === 'rsvp_simple') {
    const r = await rsvpPresent(opts.text, 1000 / opts.spec.freq, textOnset);
    if (r.key === 'quit') return { row: baseRow(opts.im, opts.text, opts.answer, 'quit', null), resp: 'quit' };
    respKey = r.key;
    if (respKey == null) {
      Stage.question();
      const qOnset = performance.now();
      const q = await pollYN(CONFIG.RSVP_RESPONSE_WINDOW * 1000, qOnset);
      respKey = q.key; rt = q.rt;
    } else {
      rt = r.rt;
    }
  } else if (pres === 'rsvp_ding') {
    const r = await rsvpPresent(opts.text, 1000 / CONFIG.EXP2_DING_CHAR_RATE, textOnset);
    if (r.key === 'quit') return { row: baseRow(opts.im, opts.text, opts.answer, 'quit', null), resp: 'quit' };
    respKey = r.key;
    if (respKey == null) {
      Stage.question();
      const qOnset = performance.now();
      const q = await pollYN(CONFIG.RSVP_RESPONSE_WINDOW * 1000, qOnset);
      respKey = q.key; rt = q.rt;
    } else {
      rt = r.rt;
    }
  } else {
    // 整句：对照 / ABAB-A（无辅助）/ 听觉（节拍器仅文字期）
    const isAud = (opts.spec.assist === 'auditory' || pres === 'auditory');
    const rate = opts.spec.freq || CONFIG.DEFAULT_METRONOME_FREQ;
    if (isAud) Metronome.start(rate);
    Stage.text(opts.text);
    const dur = textDuration(opts.text.length, rate, false) * 1000;
    const r = await pollYN(dur, textOnset);
    if (isAud) Metronome.stop();
    respKey = r.key; rt = r.rt;
  }

  const row = baseRow(opts.im, opts.text, opts.answer, respKey, rt);
  row.text_duration = Math.round(textDuration(opts.text.length, (opts.spec.freq || CONFIG.DEFAULT_METRONOME_FREQ), false) * 1000) / 1000;
  return { row, resp: respKey };
}

// =====================================================================
// 通用屏（引导 / 休息 / 完成 / VAS）
// =====================================================================
async function showInstruction(title, body, extra) {
  KeyBuf.clear();
  Stage.show(`<div class="screen center panel">
    <div class="instr-title">${escHtml(title)}</div>
    <div class="instr-body">${body.replace(/\n/g, '<br>')}</div>
    ${extra ? `<div class="instr-extra">${escHtml(extra)}</div>` : ''}
    <div class="instr-continue">按空格键继续</div>
  </div>`);
  return await waitForSpace();
}

async function waitForSpace() {
  const start = performance.now();
  // 等待空格或 Esc
  while (true) {
    const keys = KeyBuf.take();
    if (keys.includes(CONFIG.KEY_QUIT)) return 'quit';
    if (keys.includes(CONFIG.KEY_CONTINUE)) return 'done';
    // 也接受回车
    if (keys.includes('Enter')) return 'done';
    if (performance.now() - start > 3600000) return 'timeout'; // 1h 兜底
    await sleep(20);
  }
}

async function showCountdownBreak(durationS, label, skippable) {
  const end = performance.now() + durationS * 1000;
  while (performance.now() < end) {
    const remain = Math.max(0, Math.ceil((end - performance.now()) / 1000));
    Stage.show(`<div class="screen center panel">
      <div class="instr-title">${escHtml(label || '休息一下')}</div>
      <div class="instr-extra">${remain} 秒</div>
      ${skippable ? '<div class="instr-continue">按空格键跳过</div>' : ''}
    </div>`);
    const keys = KeyBuf.take();
    if (skippable && keys.includes(CONFIG.KEY_CONTINUE)) return 'done';
    if (keys.includes(CONFIG.KEY_QUIT)) return 'quit';
    await sleep(250);
  }
  return 'done';
}

/** Block 内可选休息：空格继续 / Q 暂停 2 分钟。 */
async function showInBlockBreak(doneCount, total) {
  KeyBuf.clear();
  Stage.show(`<div class="screen center panel">
    <div class="instr-title">已完成 ${doneCount} / ${total}</div>
    <div class="instr-body">需要休息一下吗？</div>
    <div class="instr-continue">按空格键继续 · 按 Q 暂停 2 分钟</div>
  </div>`);
  while (true) {
    const keys = KeyBuf.take();
    if (keys.includes(CONFIG.KEY_QUIT)) return 'quit';
    if (keys.includes(CONFIG.KEY_CONTINUE)) return 'done';
    if (keys.includes(CONFIG.KEY_PAUSE)) {
      const r = await showCountdownBreak(CONFIG.BREAK_DURATION, '暂停中', false);
      if (r === 'quit') return 'quit';
      Stage.show(`<div class="screen center panel">
        <div class="instr-title">休息结束</div>
        <div class="instr-continue">按空格键继续</div>
      </div>`);
      const c = await waitForSpace();
      if (c === 'quit') return 'quit';
      return 'done';
    }
    await sleep(20);
  }
}

async function showVas(prompt, range, labels) {
  // 简化的 0-10（或 -5..5）滑杆：用 ← → 调整、空格确认
  KeyBuf.clear();
  const min = range ? range[0] : 0, max = range ? range[1] : 10;
  let val = Math.floor((min + max) / 2);
  Stage.show(`<div class="screen center panel">
    <div class="instr-title">主观评价</div>
    <div class="instr-body">${escHtml(prompt)}</div>
    <div class="vas-line">${escHtml(labels ? labels[0] : min)} — ${escHtml(labels ? labels[1] : max)}</div>
    <div class="vas-score">${val}</div>
    <div class="instr-continue">← → 调整 · 空格确认</div>
  </div>`);
  while (true) {
    const keys = KeyBuf.take();
    for (const k of keys) {
      if (k === 'Escape') return { val: null, quit: true };
      if (k === 'ArrowLeft') val = Math.max(min, val - 1);
      if (k === 'ArrowRight') val = Math.min(max, val + 1);
      if (k === CONFIG.KEY_CONTINUE || k === 'Enter') return { val, quit: false };
    }
    const scoreEl = document.querySelector('.vas-score');
    if (scoreEl) scoreEl.textContent = val;
    await sleep(20);
  }
}

async function showCompletion(title, body) {
  KeyBuf.clear();
  Stage.show(`<div class="screen center panel">
    <div class="instr-title">${escHtml(title)}</div>
    <div class="instr-body">${escHtml(body || '')}</div>
    <div class="instr-continue">按空格键继续</div>
  </div>`);
  return await waitForSpace();
}

/** 结束屏：显示结果 + 数据下载按钮 + 返回主页。 */
function showDoneScreen(title, body, downloadFilename, summaryHtml) {
  KeyBuf.clear();
  Stage.show(`<div class="screen center panel">
    <div class="instr-title">${escHtml(title)}</div>
    <div class="instr-body">${escHtml(body || '')}</div>
    ${summaryHtml || ''}
    <div class="done-actions">
      <button class="btn-primary" onclick="DataLog.download('${downloadFilename}')">下载数据 (CSV)</button>
      <button class="btn-secondary" onclick="App.showStart()">返回主页</button>
    </div>
    <div class="instr-hint">数据已保存在本机浏览器中（localStorage 备份），也可随时下载。</div>
  </div>`);
}

async function showPracticeFeedback(correct, wrongText) {
  const msg = correct ? '回答正确！' : (wrongText || '回答错误');
  Stage.show(`<div class="screen center panel">
    <div class="instr-title ${correct ? 'ok' : 'no'}">${correct ? '✓ 正确' : '✗ 注意'}</div>
    <div class="instr-body">${escHtml(msg)}</div>
  </div>`);
  return await Stage.hold(correct ? 600 : 1800);
}

function dateStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function timestamp() {
  const d = new Date();
  return d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0')
    + '_' + String(d.getHours()).padStart(2, '0') + String(d.getMinutes()).padStart(2, '0') + String(d.getSeconds()).padStart(2, '0');
}
