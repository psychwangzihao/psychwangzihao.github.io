/* COCOnnect — app: start screen, fullscreen, task dispatch
   用 addEventListener 绑定事件；防重复启动守卫。
*/
'use strict';

const App = {
  showStart() {
    KeyBuf.clear();
    const levelOpts = CONFIG.LEVELS.map((L) => `<option>${L}</option>`).join('');
    Stage.show(`<div class="screen center panel start-panel">
      <div class="instr-title">COCOnnect · 图文匹配实验</div>
      <div class="instr-sub">看图 → 记图 → 读文字 → 判断一致（Y(1)=是 / N(2)=否）</div>
      <form id="start-form" class="start-form">
        <div class="form-row">
          <label for="f-subject">被试编号</label>
          <input id="f-subject" value="P001" maxlength="12" autocomplete="off">
        </div>
        <div class="form-row">
          <label for="f-task">任务</label>
          <select id="f-task">
            <option value="exp1.1">实验一 · 第一轮（精细曲线）</option>
            <option value="exp1.2">实验一 · 第二轮（精细曲线）</option>
            <option value="exp2.1">实验二 · 会话 1（节律辅助）</option>
            <option value="exp2.2">实验二 · 会话 2（ABAB）</option>
          </select>
        </div>
        <div class="form-row">
          <label for="f-level">实验二目标等级</label>
          <input id="f-level" value="L13" list="level-options">
          <datalist id="level-options">${levelOpts}</datalist>
        </div>
        <div class="done-actions">
          <button class="btn-primary" type="submit" id="btn-start">开始实验</button>
        </div>
        <div class="instr-hint">
          建议使用 Chrome / Edge 浏览器 · 开始后自动全屏 · 全程可用 Esc 退出（数据已保存）<br>
          结果通过浏览器本地下载，不上传任何个人信息
        </div>
      </form>
    </div>`);

    const form = document.getElementById('start-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        App.start();
      });
    }
  },

  async start() {
    if (App._starting) return;
    App._starting = true;
    try {
      const subject = document.getElementById('f-subject').value.trim();
      if (!subject) { alert('请填写被试编号'); return; }
      const task = document.getElementById('f-task').value;
      const level = document.getElementById('f-level').value.trim() || CONFIG.EXP2_TARGET_LEVEL;
      try { await document.documentElement.requestFullscreen(); } catch (e) { /* 非全屏也可运行 */ }
      KeyBuf.clear();

      const cfg = { subject };
      if (task.startsWith('exp1.')) {
        cfg.run = task;
        await runExp1(cfg);
      } else if (task.startsWith('exp2.')) {
        cfg.session = parseInt(task.split('.')[1], 10);
        cfg.targetLevel = level;
        await runExp2(cfg);
      }

      if (document.fullscreenElement) {
        try { await document.exitFullscreen(); } catch (e) { /* ignore */ }
      }
    } catch (err) {
      console.error('[COCOnnect] 运行出错:', err);
      const msg = String((err && err.message) || err);
      Stage.show(`<div class="screen center panel">
        <div class="instr-title no">出错了</div>
        <div class="instr-body">${escHtml(msg)}</div>
        <div class="instr-continue">点击屏幕返回主页</div>
      </div>`);
      const stage = Stage.el();
      const onClick = () => { stage.removeEventListener('click', onClick); App.showStart(); };
      stage.addEventListener('click', onClick);
    } finally {
      App._starting = false;
    }
  },
};

window.addEventListener('DOMContentLoaded', () => {
  KeyBuf.init();
  App.showStart();
});
