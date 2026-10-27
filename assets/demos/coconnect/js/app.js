/* ============================================================
 * COCOnnect — 入口：选条件 → 加载 → 跑实验 → 下载数据
 *
 * 实验室版是用命令行参数 --task unassisted/rhythm4/... 选条件的，
 * 网页上换成让访客自己选 —— 这样同一个页面能体验全部 5 个条件，
 * 也正好把「节律辅助」这条自变量摆到台面上。
 * ============================================================ */
'use strict';

const App = {
  _busy: false,
  _choose: 'unassisted',
  _running: false,        // 实验进行中？（区分「我们主动退出全屏」和「用户退出了全屏」）

  /* 条件卡片的点击只绑一次（绑在 stage 上做委托）——
     起始屏会被反复重建，绑在卡片上会一次比一次多绑一层。 */
  init() {
    Input.init();

    /* ⚠️ 全屏下按 Esc 会被浏览器自己吃掉，页面根本收不到 keydown
       （实验室版没这个问题，因为 PsychoPy 是独占窗口）。
       两条退路一起上：
         ① navigator.keyboard.lock(['Escape']) —— Chrome/Edge 支持，
            它把 Esc 从浏览器手里要回给页面；
         ② fullscreenchange —— 不支持 ① 的浏览器里，用户按 Esc 会让
            浏览器退出全屏，那就是他的「我要退出」信号，转成一次 Esc 按键。
       两条都不做的话，指导页上写着「按 Esc 随时退出」却根本退不出去。 */
    document.addEventListener('fullscreenchange', () => {
      /* 页面已经收到过真正的 Esc 就不再补 —— 有的浏览器两件事都会发生
         （既把 Esc 交给页面，又退出全屏），补第二次会把刚弹出的
         结束屏立刻关掉。只有「全屏丢了、页面却没收到 Esc」才需要补。 */
      if (Input.sawEscapeWithin(700)) return;
      if (!document.fullscreenElement && this._running) Input.push('Escape');
    });

    Stage.el().addEventListener('click', (e) => {
      const card = e.target.closest ? e.target.closest('.cond') : null;
      if (!card) return;
      this._choose = card.getAttribute('data-group');
      Stage.el().querySelectorAll('.cond').forEach((c) =>
        c.classList.toggle('on', c.getAttribute('data-group') === this._choose));
    });
    this.showStart();
  },

  async _enterFullscreen() {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (e) { /* 全屏不可用就在窗口里跑 —— 版面全是 vh，一样不会错位 */ }
    try {
      if (navigator.keyboard && navigator.keyboard.lock) {
        await navigator.keyboard.lock(['Escape']);
      }
    } catch (e) { /* 不支持就靠上面那条 fullscreenchange 兜底 */ }
  },

  async _leaveFullscreen() {
    this._running = false;        // 先关掉标志，免得自己退全屏又被当成用户退出
    try { if (navigator.keyboard && navigator.keyboard.unlock) navigator.keyboard.unlock(); }
    catch (e) { /* ignore */ }
    try { if (document.fullscreenElement) await document.exitFullscreen(); }
    catch (e) { /* ignore */ }
  },

  /* ---------- 起始屏 ---------- */
  showStart() {
    Input.clear();
    const cards = CONFIG.GROUPS.map((g) => `
      <label class="cond ${g.id === this._choose ? 'on' : ''}" data-group="${g.id}">
        <input type="radio" name="cond" value="${g.id}" ${g.id === this._choose ? 'checked' : ''}>
        <span class="cond-hz">${g.hz === null ? '无节拍' : g.hz + ' Hz'}</span>
        <span class="cond-name">${esc(g.label)}</span>
        <span class="cond-desc">${esc(g.desc)}</span>
      </label>`).join('');

    Stage.show(`<div class="screen start">
      <h1 class="start-title">COCOnnect</h1>
      <p class="start-sub">图文匹配实验 · 判断文字说的东西在不在图里<br>
        每级 10 试次，文字从 1 个字递增到 10 个字</p>

      <div class="cond-row">${cards}</div>

      <div class="start-form">
        <label for="f-subject">被试编号</label>
        <input id="f-subject" value="P001" maxlength="12" autocomplete="off" spellcheck="false">
      </div>

      <button class="btn btn-primary btn-big" data-key="space">开始实验</button>

      <p class="start-note">
        建议用 Chrome / Edge，开始后自动全屏，按 Esc 可随时退出（已做的数据会保留）<br>
        结果在本地下载成 CSV，不上传任何信息
      </p>
    </div>`);

    Input.wait([' ', 'Escape']).then((k) => { if (k === ' ') this.start(); });
  },

  /* ---------- 开跑 ---------- */
  async start() {
    if (this._busy) return;
    this._busy = true;
    try {
      const input = document.getElementById('f-subject');
      const subject = (input && input.value.trim()) || 'P001';
      const groupId = this._choose;

      /* AudioContext 必须在用户手势里建（浏览器自动播放策略） */
      Metronome.init();

      await this._enterFullscreen();
      this._running = true;
      Input.clear();

      /* 加载页：100 张图全部 decode 完再开始，免得解码时间混进反应时 */
      Stage.show(`<div class="screen">
        <div class="instr" style="font-size:${vh(0.05)}">正在加载刺激…</div>
        <div class="bar"><div class="bar-fill" id="barFill" style="width:0%"></div></div>
        <div class="start-note" id="loadNote">0 / 100</div>
      </div>`);

      const res = await runGroup(
        { subject, groupId },
        (n, total) => {
          const f = document.getElementById('barFill');
          const t = document.getElementById('loadNote');
          if (f) f.style.width = Math.round(n / total * 100) + '%';
          if (t) t.textContent = `${n} / ${total}`;
        });

      if (res) await this.showDone(res);

      await this._leaveFullscreen();
    } catch (err) {
      console.error('[COCOnnect]', err);
      await this._leaveFullscreen();
      Stage.show(`<div class="screen">
        <div class="instr" style="font-size:${vh(0.05)}">
          出错了<br><br>${esc(String((err && err.message) || err))}
        </div>
        <button class="btn btn-primary" data-key="space">返回</button>
      </div>`);
      await Input.waitFresh([' ']);
      this._busy = false;
      this.showStart();
      return;
    }
    this._busy = false;
  },

  /* ---------- 结束屏：给结果 + 下载 ---------- */
  async showDone(res) {
    const stem = DataLog.fileStem;
    const n = DataLog.count();
    const quitNote = res.quit
      ? '<br><span class="warn">中途退出 —— 下面是已经做完的部分。</span>'
      : '';
    Stage.show(`<div class="screen">
      <div class="instr" style="font-size:${vh(0.05)};line-height:1.6">
        实验结束${quitNote}<br><br>
        完成 <b>${n}</b> 试次　正确率 <b>${res.pct}%</b><br>
        <span class="start-note">条件：${esc(res.group)}${res.hz ? '（' + res.hz + ' Hz 节拍）' : '（无节拍）'}　被试：${esc(res.subject)}</span>
      </div>
      <div class="btn-row">
        <button class="btn btn-primary btn-big" id="btn-dl">下载数据（CSV）</button>
        <button class="btn btn-big" data-key="Escape">再跑一次</button>
      </div>
      <p class="start-note">
        数据只在你的浏览器里，下载后请看本地文件。刷新页面就会丢失。
      </p>
    </div>`);

    const dl = document.getElementById('btn-dl');
    if (dl) dl.addEventListener('click', () => DataLog.download(stem + '.csv'));

    await Input.waitFresh(['Escape', ' ']);
    this._busy = false;
    this.showStart();
  },
};

window.addEventListener('DOMContentLoaded', () => App.init());
