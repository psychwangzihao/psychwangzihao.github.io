/* COCOnnect — app: start screen, fullscreen, task dispatch (v4.0.3)
   用 addEventListener 绑定事件（避免内联 handler 作用域问题）；
   全局错误横幅显示任何未捕获错误，便于诊断。
*/
'use strict';

const APP_VERSION = 'v4.0.3';

const App = {
  showStart() {
    KeyBuf.clear();
    const levelOpts = CONFIG.LEVELS.map((L) => `<option>${L}</option>`).join('');
    Stage.show(`<div class="screen center panel start-panel">
      <div class="instr-title">COCOnnect · 图文匹配实验 <span class="version-badge">${APP_VERSION}</span></div>
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

    // 用 addEventListener 绑定提交（避免内联 handler 的作用域/异常问题）
    const form = document.getElementById('start-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        App.start();
      });
    }
    const btn = document.getElementById('btn-start');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        App.start();
      });
    }
    // 回车/空格在输入框外时也能启动
    const stage = Stage.el();
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && document.activeElement && document.activeElement.id !== 'f-subject'
          && document.activeElement.tagName !== 'INPUT') {
        App.start();
      }
    });
  },

  async start() {
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
    }
  },
};

// 全局错误横幅：任何未捕获错误都显示出来（诊断用）
function initErrorBanner() {
  window.addEventListener('error', (e) => {
    const msg = String((e && e.message) || e);
    console.error('[COCOnnect] 未捕获错误:', e);
    let banner = document.getElementById('err-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'err-banner';
      banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#8a1f1f;color:#fff;padding:8px 12px;z-index:99999;font-size:14px;font-family:sans-serif;white-space:pre-wrap;';
      document.body.appendChild(banner);
    }
    banner.textContent = '⚠ 错误: ' + msg + ' （复制此信息发给开发者）';
  });
}

window.addEventListener('DOMContentLoaded', () => {
  KeyBuf.init();
  initErrorBanner();
  App.showStart();
});
