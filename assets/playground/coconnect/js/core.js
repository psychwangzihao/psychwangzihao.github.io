/* COCOnnect — core: keys, display, timing, trial runners (v4, 2026-08-10).
   exp1 whole-sentence: text stays full duration (RT recorded at keypress).
   exp2 whole-sentence: keypress ENDS trial (H7); auditory has prep-beat lock.
*/
'use strict';

// =====================================================================
// 全局按键缓冲
// =====================================================================
const KeyBuf = {
  _buf: [],
  init() {
    window.addEventListener('keydown', (e) => {
      const k = e.key;
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

/** 1/2 → y/n（备用键，防中文输入法拦截） */
function normalizeKey(k) {
  if (k === CONFIG.KEY_YES_ALT) return CONFIG.KEY_YES;
  if (k === CONFIG.KEY_NO_ALT) return CONFIG.KEY_NO;
  return k;
}

function isYN(k) {
  const n = normalizeKey(k);
  return n === CONFIG.KEY_YES || n === CONFIG.KEY_NO;
}

// =====================================================================
// 显示层
// =====================================================================
const Stage = {
  el() { return document.getElementById('stage'); },
  clear() { this.el().innerHTML = ''; },
  show(html) { this.el().innerHTML = html; },

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
  return `<div class="hint">${escHtml(CONFIG.HINT)}</div>`;
}

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// =====================================================================
// 响应收集
// =====================================================================
/**
 * 收集 Y/N（y/n/1/2，归一化为 y/n）。
 * @param windowMs 窗口时长
 * @param onsetT   RT 起点（performance.now 时间戳）
 * @param endEarly 为 true 时按键即结束（exp2 整句，H7）；为 false 时
 *                 记录首键 RT 但文字显示到窗口结束（exp1）。
 * @returns {key:'y'|'n'|null|'quit', rt:ms|null}
 */
async function pollYN(windowMs, onsetT, endEarly) {
  const start = performance.now();
  let resp = null, rt = null;
  while (performance.now() - start < windowMs) {
    const keys = KeyBuf.take();
    if (keys.includes(CONFIG.KEY_QUIT)) return { key: 'quit', rt: null };
    if (resp == null) {
      for (const k of keys) {
        if (isYN(k)) {
          resp = normalizeKey(k);
          rt = performance.now() - onsetT;
          if (endEarly) return { key: resp, rt };
          break;
        }
      }
    }
    await sleep(20);
  }
  return { key: resp, rt };
}

// =====================================================================
// RSVP 逐字呈现（早按允许）
// =====================================================================
async function rsvpPresent(text, periodMs, textOnset) {
  const marks = dingMarks(text);
  for (let i = 0; i < text.length; i++) {
    Stage.char(text[i], marks.word.has(i), marks.phrase.has(i));
    const t0 = performance.now();
    while (performance.now() - t0 < periodMs) {
      const keys = KeyBuf.take();
      if (keys.includes(CONFIG.KEY_QUIT)) return { key: 'quit', rt: null, early: true };
      for (const k of keys) {
        if (isYN(k)) return { key: normalizeKey(k), rt: performance.now() - textOnset, early: true };
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
// 数据行组装
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
    acc = 0; sk = 'timeout';   // 未作答（非答错）
  }
  return {
    image_id: im.id,
    text_nchar: text.length,
    text,
    correct_answer: answer,
    subject_key: sk,
    accuracy: acc,
    rt: (rt == null ? '' : Math.round(rt) / 1000),
  };
}

async function showPhase(renderFn, durationMs) {
  renderFn();
  return await Stage.hold(durationMs);
}

// =====================================================================
// Exp1 试次（整句，非 RSVP；文字不提前消失）
// =====================================================================
async function runMatchTrial(opts) {
  // opts: { im, text, answer, swapPos }
  if (await showPhase(() => Stage.fixation(), randDur(CONFIG.FIX1_DURATION, CONFIG.FIX1_JITTER))) {
    return baseRow(opts.im, opts.text, opts.answer, 'quit', null);
  }
  if (await showPhase(() => Stage.image(opts.im.path), CONFIG.IMAGE_DURATION * 1000)) {
    return baseRow(opts.im, opts.text, opts.answer, 'quit', null);
  }
  if (await showPhase(() => Stage.fixation(), randDur(CONFIG.FIX2_DURATION, CONFIG.FIX2_JITTER))) {
    return baseRow(opts.im, opts.text, opts.answer, 'quit', null);
  }
  // 整句文字：固定 3 字/秒（max(2, nchar/3)），文字不提前消失
  const durMs = textDuration(opts.text.length, CONFIG.EXP2_WHOLE_CHAR_RATE, false) * 1000;
  const textOnset = performance.now();
  Stage.text(opts.text);
  const r = await pollYN(durMs, textOnset, false);
  const row = baseRow(opts.im, opts.text, opts.answer, r.key, r.rt);
  row.text_duration = Math.round(textDuration(opts.text.length, CONFIG.EXP2_WHOLE_CHAR_RATE, false) * 1000) / 1000;
  return row;
}

// =====================================================================
// Exp2 条件试次（presentation: whole / rsvp_simple / rsvp_ding / auditory）
// =====================================================================
async function runConditionTrial(opts) {
  // opts: { im, text, answer, spec, swapPos }
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
  let respKey = null, rt = null;

  if (pres === 'rsvp_simple') {
    // 呈现速率：字率 = 频率；'?' 窗口按键即结束
    const r = await rsvpPresent(opts.text, 1000 / opts.spec.freq, performance.now());
    if (r.key === 'quit') return { row: baseRow(opts.im, opts.text, opts.answer, 'quit', null), resp: 'quit' };
    respKey = r.key;
    if (respKey == null) {
      Stage.question();
      const qOnset = performance.now();
      const q = await pollYN(CONFIG.RSVP_RESPONSE_WINDOW * 1000, qOnset, true);
      respKey = q.key; rt = q.rt;
    } else {
      rt = r.rt;
    }
  } else if (pres === 'rsvp_ding') {
    // 丁鼐：字固定 4Hz + 词/短语界标记
    const r = await rsvpPresent(opts.text, 1000 / CONFIG.EXP2_DING_CHAR_RATE, performance.now());
    if (r.key === 'quit') return { row: baseRow(opts.im, opts.text, opts.answer, 'quit', null), resp: 'quit' };
    respKey = r.key;
    if (respKey == null) {
      Stage.question();
      const qOnset = performance.now();
      const q = await pollYN(CONFIG.RSVP_RESPONSE_WINDOW * 1000, qOnset, true);
      respKey = q.key; rt = q.rt;
    } else {
      rt = r.rt;
    }
  } else {
    // 整句：对照 / ABAB-A（无辅助）、听觉（预备拍锁相 + 节拍器仅文字期）
    const isAud = (opts.spec.assist === 'auditory' || pres === 'auditory');
    const rate = opts.spec.freq || CONFIG.DEFAULT_METRONOME_FREQ;
    if (isAud) {
      const beats = Math.random() < 0.5 ? 2 : 3;
      const period = 1 / rate;
      const nowSec = performance.now() / 1000;
      const tText = nowSec + beats * period;
      Metronome.start(rate, undefined, { alignTo: tText - beats * period });
      // 等待到 tText（文字在第 beats+1 声出现），2ms 轮询
      while (performance.now() / 1000 < tText) {
        if (KeyBuf.take().includes(CONFIG.KEY_QUIT)) {
          Metronome.stop();
          return { row: baseRow(opts.im, opts.text, opts.answer, 'quit', null), resp: 'quit' };
        }
        await sleep(2);
      }
    }
    const textOnset = performance.now();   // RT 从文字实际出现起算
    Stage.text(opts.text);
    const durMs = textDuration(opts.text.length, CONFIG.EXP2_WHOLE_CHAR_RATE, false) * 1000;
    const r = await pollYN(durMs, textOnset, true);   // 按键即结束
    if (isAud) Metronome.stop();
    respKey = r.key; rt = r.rt;
  }

  const row = baseRow(opts.im, opts.text, opts.answer, respKey, rt);
  const rateWhole = (pres === 'rsvp_simple') ? opts.spec.freq
    : (pres === 'rsvp_ding') ? CONFIG.EXP2_DING_CHAR_RATE : CONFIG.EXP2_WHOLE_CHAR_RATE;
  row.text_duration = Math.round(textDuration(opts.text.length, rateWhole, pres !== 'whole' && pres !== 'auditory') * 1000) / 1000;
  row.swap_pos = (opts.swapPos == null ? '' : opts.swapPos);
  row.ding_veracity = (pres === 'rsvp_ding' ? '' : '');   // 浏览器无 jieba，词界真伪留空
  return { row, resp: respKey };
}

// =====================================================================
// 通用屏
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
  while (true) {
    const keys = KeyBuf.take();
    if (keys.includes(CONFIG.KEY_QUIT)) return 'quit';
    if (keys.includes(CONFIG.KEY_CONTINUE) || keys.includes('Enter')) return 'done';
    if (performance.now() - start > 3600000) return 'timeout';
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
      if (await waitForSpace() === 'quit') return 'quit';
      return 'done';
    }
    await sleep(20);
  }
}

async function showVas(prompt, range, labels) {
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

/** 练习：4 试次（2 正 2 误，真实池图 L12），温和反馈（v4.2）。不记录数据。 */
async function runPractice(subject) {
  let trials;
  try { trials = SessionPool.practiceTrials(subject); }
  catch (e) { return; }   // 池子不足则跳过练习
  if (await showInstruction('先来练习一下',
      '看图片 → 记在心里 → 看文字 → 判断是否一致<br>' +
      '一致按 Y（或 1），不一致按 N（或 2）<br>' +
      '练习阶段会有反馈，正式部分就没有了')) return;
  for (const t of trials) {
    const row = await runMatchTrial({ im: t.im, text: t.text, answer: t.answer });
    if (row.subject_key === 'quit') return;
    if (row.subject_key === 'timeout') {
      await showPracticeFeedback(false, '这一题没有来得及回答，再来看看：要记住图片，再仔细比较文字哦。');
    } else {
      await showPracticeFeedback(row.accuracy === 1);
    }
  }
  await showInstruction('练习结束', '正式部分没有反馈了，按你自己的节奏来');
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
