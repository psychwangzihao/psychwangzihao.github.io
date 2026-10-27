/* ============================================================
 * COCOnnect — 各种屏幕（对应 experiment.py 的 show_instruction /
 * fixate / _draw_stim / audio_test / silent_wait）
 *
 * 排版全部按屏高比例（vh），窗口多大都不会变形 —— 这是 Python 那边
 * units='height' 的等价物。注意 PsychoPy 的 height 参数是**字母高度**，
 * 而 CSS 的 font-size 是 em 高度，两者差一个约 1.4 的系数；
 * 这里按 1:1 取（0.07 → 7vh），和上一版网页实验保持一致，
 * 绝对字号略小于实验室版，但版面关系完全一样。
 * ============================================================ */
'use strict';

/* 等到「这一帧真的画出来了」。rAF 回调跑在绘制**之前**，
   所以要等两帧，第二帧的回调才是第一帧已经上屏之后。 */
function nextPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

const Screens = {

  /* ---- 指导页 / 休息页 / 结束页：一整块居中文字，行多自动缩字号 ----
     buttons: 可选的按钮（网页上给鼠标用户一个入口，键盘一样能用） */
  async instruction(title, body, footer, keys, buttons) {
    const txt = `${title}\n\n${body}\n\n${footer || '按空格键继续'}`;
    const size = instrFontSize(txt);
    const btnHtml = (buttons || []).map((b) =>
      `<button class="btn ${b.primary ? 'btn-primary' : ''}" data-key="${esc(b.key)}">` +
      `${esc(b.label)}</button>`).join('');

    Stage.show(`<div class="screen">
      <div class="instr" style="font-size:${vh(size)};line-height:1.5;
           max-width:${vh(CONFIG.GEO.WRAP_INSTR)}">${escLines(txt)}</div>
      ${btnHtml ? `<div class="btn-row">${btnHtml}</div>` : ''}
    </div>`);

    /* 键盘和鼠标不用分开处理：点按钮会经由 Input 的委托变成一次按键 */
    return Input.waitFresh(keys || [' ', 'Escape']);
  },

  /* ---- 注视点：一个「+」加底部提示，停 FIX_DURATION 秒 ----
     + 用的是 FONT_TITLE(0.11)，和图片同位（保证中央注视）。 */
  async fixate(ms) {
    Stage.show(`<div class="screen">
      <div class="fix" style="${geoPos(CONFIG.GEO.IMG_Y)};font-size:${vh(CONFIG.GEO.FONT_TITLE)}">+</div>
      ${hintHtml()}
    </div>`);
    await Input.sleep(ms === undefined ? CONFIG.FIX_DURATION * 1000 : ms);
  },

  /* ---- 刺激屏：图 + 文字 + 底部提示，同时出现 ----
     img 是**已经 decode 过**的 <img> 元素（见 preload），
     所以这里插进 DOM 就能立刻画出来，不会把解码时间算进反应时。
     返回真正上屏的时刻（performance.now()）。 */
  async stimulus(imgEl, text, label) {
    Stage.show(`<div class="screen">
      ${label ? `<div class="stim-label" style="top:calc(50% - 42vh)">${esc(label)}</div>` : ''}
      <div class="stim-img-box" style="${geoPos(CONFIG.GEO.IMG_Y)};
           width:${vh(CONFIG.GEO.IMG_W)};height:${vh(CONFIG.GEO.IMG_H)}"></div>
      <div class="stim-text" style="${geoPos(CONFIG.GEO.TEXT_Y)};
           font-size:${vh(CONFIG.GEO.FONT_TEXT)};max-width:${vh(CONFIG.GEO.WRAP_TEXT)}">${esc(text)}</div>
      ${hintHtml()}
    </div>`);
    const box = Stage.el().querySelector('.stim-img-box');
    box.appendChild(imgEl);
    await nextPaint();
    return performance.now();
  },

  /* ---- 音量测试（对应 audio_test）----
     循环响 hz 节拍，↑/W 增大、↓/S 减小，空格确认，Esc 退出。
     返回所选增益；Esc → null。 */
  async audioTest(hz) {
    if (!Metronome.available) {
      await this.instruction('音量测试', '音频不可用（静音继续）。', '按空格键开始本组',
                             [' ', 'Escape']);
      return CONFIG.METRONOME_GAIN_DEFAULT;
    }
    Metronome.setGain(CONFIG.METRONOME_GAIN_DEFAULT);
    Metronome.startLoop(hz);

    const lastAdj = { t: -1 };
    const keys = [' ', 'Escape', 'ArrowUp', 'ArrowDown', 'w', 's'];
    const up = ['ArrowUp', 'w'], down = ['ArrowDown', 's'];
    try {
      for (;;) {
        Stage.show(audioTestHtml(hz));
        /* 120ms 轮询一次：按键、点按钮、或时间到重画音量数字。
           音量只改共享的 GainNode，已经排好的拍会立刻跟着变，
           不用重排 —— 重排反而会把节拍打断。 */
        const k = await Promise.race([
          Input.wait(keys),
          new Promise((r) => setTimeout(() => r('__tick__'), 120)),
        ]);

        if (k === 'Escape') return null;
        if (k === ' ') return Metronome.gainValue;
        if (up.indexOf(k) >= 0 || down.indexOf(k) >= 0) {
          const now = performance.now() / 1000;
          if (now - lastAdj.t < CONFIG.GAIN_ADJ_GATE) continue;  // 时间门控：长按也能连续调
          lastAdj.t = now;
          Metronome.setGain(Metronome.gainValue
            + (up.indexOf(k) >= 0 ? 1 : -1) * CONFIG.METRONOME_GAIN_STEP);
          Input.clear();          // 丢掉轮询间隙里积压的重复按键，避免一次跳好几格
        }
      }
    } finally {
      Metronome.stop();
    }
  },

  /* ---- 音量测试后的静默期：让连续滴答声消退，防听觉后效 ---- */
  async silentWait(seconds) {
    let left = seconds;
    while (left > 0) {
      Stage.show(`<div class="screen">
        <div class="instr" style="font-size:${vh(0.05)}">
          ${esc(`节拍已就绪，静默 ${Math.floor(left) + 1} 秒后开始…`)}
        </div>
      </div>`);
      const k = await Promise.race([
        Input.wait(['Escape']),
        new Promise((r) => setTimeout(() => r('__tick__'), 200)),
      ]);
      if (k === 'Escape') return false;
      left -= 0.2;
    }
    return true;
  },
};

/* ---------- 小工具 ---------- */

/* 底部按键提示（HINT_Y = 屏幕下方 45% 处） */
function hintHtml() {
  return `<div class="hint" style="${geoPos(CONFIG.GEO.HINT_Y)};` +
         `font-size:${vh(CONFIG.GEO.FONT_HINT)}">${esc(CONFIG.HINT)}</div>`;
}

/* 保留空行（指导语靠空行分段），其余转义 */
function escLines(txt) {
  return esc(txt).replace(/\n/g, '<br>');
}

/* 音量测试屏的 HTML（音量数字要跟着刷新，所以单独拎出来） */
function audioTestHtml(hz) {
  return `<div class="screen">
    <div class="instr" style="font-size:${vh(CONFIG.GEO.FONT_INSTR)};line-height:1.6">
      ${escLines(`${hz}Hz 节拍 · 音量 ${Math.round(Metronome.gainValue * 100)}%\n\n`
               + '↑ / W  增大音量\n↓ / S  减小音量\n'
               + '调到舒服后按 空格 继续\n按 Esc 退出')}
    </div>
    <div class="btn-row">
      <button class="btn btn-big" data-key="ArrowUp">音量 +</button>
      <button class="btn btn-big btn-primary" data-key="space">就是这个音量</button>
      <button class="btn btn-big" data-key="ArrowDown">音量 −</button>
    </div>
  </div>`;
}

/* ---- 预加载：把本组 100 张图全部 decode 完再开始 ----
   目的是不让图片解码时间混进反应时；顺带避免试次中途卡一下。 */
async function preloadImages(paths, onProgress) {
  let done = 0;
  const imgs = new Map();
  await Promise.all(paths.map(async (p) => {
    const img = new Image();
    img.src = p;
    try { await img.decode(); } catch (e) { /* 解码失败也放进 DOM，让 img 自己重试 */ }
    imgs.set(p, img);
    done++;
    if (onProgress) onProgress(done, paths.length);
  }));
  return imgs;
}
