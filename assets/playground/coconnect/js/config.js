/* COCOnnect — config (ported from config.py, v4.0) */
'use strict';

const CONFIG = {
  // ---- 窗口 / 颜色 / 字体 ----
  WIN_COLOR: '#808080',
  FONT_COLOR: '#333333',
  FONT_COLOR_HINT: '#666666',
  FONT_COLOR_ACCENT: '#1a6d45',
  FONT_FAMILY: '"PingFang SC","Songti SC","Heiti SC","STHeiti","Hiragino Sans GB","Microsoft YaHei","SimHei","SimSun",sans-serif',
  FONT_SIZE_TEXT_PT: 30,

  // ---- 按键（Y/N 优先；数字键 1/2 备用，防中文输入法拦截字母键） ----
  KEY_YES: 'y',
  KEY_NO: 'n',
  KEY_YES_ALT: '1',
  KEY_NO_ALT: '2',
  KEY_CONTINUE: ' ',
  KEY_QUIT: 'Escape',
  KEY_PAUSE: 'q',
  HINT: '是=Y(1) 否=N(2)',

  // ---- 试次时序（§5.1/§5.2） ----
  FIX1_DURATION: 1.0,
  FIX1_JITTER: 0.2,
  IMAGE_DURATION: 1.5,
  FIX2_DURATION: 0.5,
  FIX2_JITTER: 0.2,
  TEXT_FLOOR: 2.0,
  RSVP_RESPONSE_WINDOW: 3.0,

  // ---- 文本长度等级 L1-L19（§4.2） ----
  LEVEL_CHAR_TARGETS: {
    L1: 1, L2: 2, L3: 3, L4: 4, L5: 5, L6: 6, L7: 7, L8: 8,
    L9: 10, L10: 12, L11: 14, L12: 16, L13: 18, L14: 20,
    L15: 24, L16: 28, L17: 32, L18: 36, L19: 40,
  },
  LEVELS: ['L1','L2','L3','L4','L5','L6','L7','L8','L9','L10',
           'L11','L12','L13','L14','L15','L16','L17','L18','L19'],

  // ---- 节拍器（§7.1；v4 改 660Hz 钟形叮） ----
  METRONOME_PRESETS: [0.5, 1.0, 2.0, 4.0, 6.0],
  DEFAULT_METRONOME_FREQ: 4.0,
  METRONOME_VOLUME: 0.9,
  METRONOME_TONE_HZ: 660.0,
  METRONOME_TICK_S: 0.35,           // 每拍 350ms 钟形衰减；高频时自动缩短
  METRONOME_DECAY_TAU: 0.09,        // 指数衰减时间常数（s）
  METRONOME_ATTACK_S: 0.002,        // 2ms 线性起音
  METRONOME_SAMPLE_RATE: 44100,
  FREQ_MIN: 0.25,
  FREQ_MAX: 12.0,

  // ---- Exp 1 精细曲线（v4.0 K1） ----
  TRIALS_PER_LENGTH: 10,          // 每级试次数（正误各半）
  FINE_CURVE_RUNS: ['exp1.1', 'exp1.2'],
  IN_BLOCK_BREAK_EVERY: 38,       // 每 38 试次可选休息
  FINE_CURVE_FREQ: 4.0,           // Exp1 无节拍器（freq 仅占位）

  // ---- Exp 2 单长度节律测试（v4.0 K2） ----
  EXP2_TRIALS_PER_CONDITION: 25,  // 每条件上限
  EXP2_TARGET_LEVEL: 'L13',
  EXP2_FREQS: [0.5, 1.0, 2.0, 4.0, 6.0],
  EXP2_DING_CHAR_RATE: 4.0,       // 丁鼐版字率固定 4Hz
  EXP2_DING_WORD_LEN: 2,
  EXP2_DING_PHRASE_LEN: 4,
  EXP2_WHOLE_CHAR_RATE: 3.0,      // 整句条件固定 3 字/秒（max(2, nchar/3)）
  EXP2_SWAP_TOLERANCE: 3,         // 错误试次：|swap_pos+1-目标| ≤ 3
  EXP2_LEN_TOLERANCE: 4,          // 正确试次：|文本长度-目标| ≤ 4
  EXP2_DYNAMIC_MARGIN: 0.95,      // 动态试次余量（5% 缓冲）
  EXP2_ABAB_B_FREQ: 4.0,          // 会话2 ABAB-B 段频率（rsvp_ding 恒用 DING_CHAR_RATE）

  // ---- 休息 / VAS / 练习 ----
  BREAK_DURATION: 120.0,
  BREAK_AFTER_BASELINE: 300.0,
  ENABLE_VAS: true,
  VAS_PRE: true,
  VAS_POST: true,
  PRACTICE_TRIALS: 4,             // 练习 4 试次（2 正 2 误，真实池图 L12）

  // ---- 图片 ----
  IMG_W: 800,
  IMG_H: 600,

  // ---- 数据 / 去重 ----
  DATA_DIR: 'data',
  POOL_JSON: 'data/pool_images.json',
  IMG_DIR: 'images/pool/',
};

// =====================================================================
// 时长公式（移植 config.py；tests/test_timing.py 锁定这些数学）
// =====================================================================
function textDuration(nchar, freq, rsvp) {
  // 非 RSVP: max(2s, 字符数/频率)；RSVP: 字符数/频率（不含 "?" 窗口）
  const dur = nchar / freq;
  return rsvp ? dur : Math.max(CONFIG.TEXT_FLOOR, dur);
}

function levelDurationTable(freq, rsvp) {
  const t = {};
  for (const L of CONFIG.LEVELS) t[L] = textDuration(CONFIG.LEVEL_CHAR_TARGETS[L], freq, rsvp);
  return t;
}

function meanTextDuration(freq, rsvp) {
  const durs = Object.values(levelDurationTable(freq, rsvp));
  return durs.reduce((a, b) => a + b, 0) / durs.length;
}

function trialMeanDuration(freq, rsvp) {
  return (CONFIG.FIX1_DURATION + CONFIG.IMAGE_DURATION + CONFIG.FIX2_DURATION)
    + meanTextDuration(freq, rsvp);
}

function formatDurationMin(mins) {
  return `约 ${Math.round(mins)} 分钟`;
}

// =====================================================================
// 多行文本断行（移植 utils.wrap_text_lines：≤20字/行，在最后一个逗号处断）
// =====================================================================
function wrapTextLines(text, maxLen) {
  maxLen = maxLen || 20;
  const textStr = String(text);
  if (textStr.length <= maxLen) return [textStr];
  const lines = [];
  let rest = textStr;
  while (rest.length > maxLen) {
    const slice = rest.slice(0, maxLen);
    // 在 slice 内找最后一个中文逗号/顿号/分号；找不到则硬切
    let cut = -1;
    for (const ch of ['，', '、', '；', ',', ';']) {
      const idx = slice.lastIndexOf(ch);
      if (idx > cut) cut = idx;
    }
    if (cut >= 0) cut += 1;          // 包含标点
    else cut = maxLen;               // 硬切
    lines.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  if (rest.length > 0) lines.push(rest);
  return lines;
}

// =====================================================================
// 确定性伪随机（移植 python random.Random(seed) 不现实，用 mulberry32；
// 抽样只需"看起来随机 + 可复现"，无需与 Python 序列一致）
// =====================================================================
function seededRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
