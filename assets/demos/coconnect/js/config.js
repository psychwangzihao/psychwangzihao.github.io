/* ============================================================
 * COCOnnect — 配置（移植自实验包 config.py，v8「字长阈值 + 节律辅助」）
 *
 * 这个网页版是**行为实验的忠实移植**：所有尺寸、时长、按键、
 * 试次流程都和心理学系跑通的那一版一致，方便对照数据。
 * 唯一的差别是呈现介质（PsychoPy 窗口 → 浏览器），所以：
 *
 *   PsychoPy 的 units='height' —— 位置和尺寸都是**屏高的比例**，
 *   y 轴向上为正。换算到 CSS 就是 vh：
 *       y = -0.30  →  top: calc(50% + 30vh)
 *   下面的 GEO 里y 一律保留 PsychoPy 的原始数值和符号，
 *   由 geoStyle() 统一换算，避免两边各写一套数字走样。
 * ============================================================ */
'use strict';

const CONFIG = {
  // ---- 颜色（对齐 config.py 的 BG_COLOR / FONT_COLOR*）----
  BG_COLOR: '#808080',
  FONT_COLOR: '#333333',
  FONT_COLOR_HINT: '#666666',
  FONT_COLOR_ACCENT: '#1a6d45',
  FONT_FAMILY: '"PingFang SC","Microsoft YaHei","Hiragino Sans GB",' +
               '"Heiti SC","Songti SC","SimHei","SimSun",sans-serif',

  // ---- 几何（单位：屏高比例，同 config.py）----
  // 图片居中、注视点与图片同位（保证中央注视）；文字在图下方；
  // 提示放屏幕底部 —— 提示若放在上方会把视线引开，污染阅读眼动。
  GEO: {
    IMG_W: 0.44, IMG_H: 0.33, IMG_Y: 0.00,
    TEXT_Y: -0.30, HINT_Y: -0.45,
    FONT_TEXT: 0.07, FONT_TITLE: 0.11, FONT_HINT: 0.035,
    FONT_INSTR: 0.045,          // show_instruction 的正文尺寸
    WRAP_TEXT: 0.95,            // 刺激文字的换行宽度
    WRAP_INSTR: 1.4,            // 指导语的换行宽度
  },

  // ---- 按键：Y/N/D 三选；数字键 1/2/3 兜底 ----
  // 中文输入法会吞掉字母键（第 1 键穿透、之后全被拼音组合框吃掉），
  // 所以数字键是必需的备用通道，不能删。
  KEY_YES: 'y', KEY_NO: 'n', KEY_D: 'd',
  KEY_YES_ALT: '1', KEY_NO_ALT: '2', KEY_D_ALT: '3',
  KEY_CONTINUE: ' ',
  KEY_QUIT: 'Escape',
  HINT: '是=Y(1)  否=N(2)  不知道=D(3)',
  SOFT_CAP: 60.0,               // 反应软上限（秒），超时记 timeout

  FIX_DURATION: 0.3,            // 试次前注视点

  // ---- 节拍器（对齐 experiment.py 的 Metronome / audio_test）----
  METRONOME_TONE_HZ: 880.0,
  METRONOME_TICK_S: 0.08,       // 单次滴答 80ms
  METRONOME_DECAY_TAU: 0.015,   // exp(-t/0.015)
  METRONOME_PEAK: 0.7,          // 烘进波形的峰值
  METRONOME_GAIN_DEFAULT: 0.7,
  METRONOME_GAIN_MIN: 0.05,
  METRONOME_GAIN_MAX: 1.0,
  METRONOME_GAIN_STEP: 0.05,
  GAIN_ADJ_GATE: 0.12,          // 长按连续调音的时间门控
  SILENT_AFTER_AUDIO_TEST: 10.0,// 音量测试后的静默秒数（防听觉后效）

  // ---- 五个行为组 ----
  // hz = null 表示无节拍（无辅助组）。顺序 = 站点上的呈现顺序。
  GROUPS: [
    { id: 'unassisted', hz: null, label: '无辅助',
      desc: '按自己的节奏读，没有节拍。这是基准条件。' },
    { id: 'rhythm4', hz: 4.0, label: '4 Hz 节拍',
      desc: '每 250 毫秒一拍，接近自然朗读的字率。' },
    { id: 'rhythm2', hz: 2.0, label: '2 Hz 节拍',
      desc: '每 500 毫秒一拍。' },
    { id: 'rhythm1', hz: 1.0, label: '1 Hz 节拍',
      desc: '每秒一拍。' },
    { id: 'rhythm05', hz: 0.5, label: '0.5 Hz 节拍',
      desc: '每两秒一拍。' },
  ],

  // ---- 数据 ----
  CSV_COLUMNS: ['subject', 'task', 'condition', 'trial_index', 'level', 'text',
                'image_id', 'correct_answer', 'fast_pass', 'volume', 'resp',
                'accuracy', 'rt'],
};

/* PsychoPy 的 y（屏高比例，向上为正）→ CSS 垂直位置字符串。
   y=0 → 屏幕正中；y=-0.30 → 正中往下 30vh。 */
function geoTop(y) {
  const pct = Math.abs(y) * 100;
  return pct < 0.01 ? '50%' : `calc(50% ${y < 0 ? '+' : '-'} ${pct}vh)`;
}

/* 单个定位元素的内联样式：绝对居中 + 按 y 偏移。 */
function geoPos(y) {
  return `position:absolute;left:50%;top:${geoTop(y)};transform:translate(-50%,-50%)`;
}

/* 屏高比例 → vh 长度字符串。 */
function vh(frac) { return (frac * 100) + 'vh'; }

/* show_instruction 的行数自适应：行数多就缩字号，保证不超屏
   （对应 experiment.py 里 0.9 / (n_lines * 1.6) 那一段）。 */
function instrFontSize(text) {
  const n = String(text).split('\n').length;
  const size = CONFIG.GEO.FONT_INSTR;
  return (n * size * 1.6 > 0.9) ? (0.9 / (n * 1.6)) : size;
}

/* ---------- 小组件：把文字套进刺激层的排版 ---------- */
function el(tag, cls, style, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (style) e.setAttribute('style', style);
  if (html !== undefined) e.innerHTML = html;
  return e;
}

const esc = (s) => String(s === undefined || s === null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
