/* ============================================================
 * door.js — 开场 / 收场的「门」（必须在 core.js 之后加载）
 *
 * 两扇门合拢时，门缝上是一块门牌（浙大校徽）：点它开始上课。
 * 门向两侧滑开，露出标题。最后下课的时候门再合上，回到校徽。
 *
 * 用法：
 *   DOOR.html({ open })   —— 门 + 门牌（open:true 表示一开始就是开着的）
 *   DOOR.open(ctx, delay) —— 把门拉开
 *   DOOR.close(ctx, delay)—— 把门合上（门牌会在门快合拢时浮出来）
 *
 * 门是 position:absolute;inset:0，必须放在 .scene 里。
 * ============================================================ */
(function () {
  'use strict';

  /* 幕布是浙大蓝，所以门牌用白色校徽（由蓝色校徽刷白生成） */
  var LOGO     = './media/zju-emblem-white.webp';
  var LOGO_PNG = './media/zju-emblem-white.png';

  PERCEPTION.css('door', `
/* 幕布：浙大蓝。开门 = 舞台亮起来，落在暖白的主背景上 */
.door{position:absolute;inset:0;z-index:20;overflow:hidden;}

.door-panel{
  position:absolute;top:0;height:100%;width:50%;
  background:linear-gradient(160deg,#12498F 0%,#0C3268 60%,#0A2A57 100%);
  transition:transform 1s var(--ease-in-out);
  will-change:transform;
}
.door-l{left:0;box-shadow:inset -2px 0 0 rgba(255,255,255,.14),
                          inset -26px 0 44px -30px rgba(0,0,0,.55);}
.door-r{right:0;box-shadow:inset 2px 0 0 rgba(255,255,255,.14),
                          inset 26px 0 44px -30px rgba(0,0,0,.55);}
.door.open .door-l{transform:translateX(-101%);}
.door.open .door-r{transform:translateX(101%);}

/* 门牌整体居中在屏幕正中；下面那行字是绝对定位挂上去的，
   不参与居中的计算 —— 否则一有字，校徽就被顶到中线上面去。 */
.door-plate{top:50%;}
.door-note{position:absolute;top:100%;left:50%;transform:translateX(-50%);
           margin-top:var(--space-lg);white-space:nowrap;}

/* 门牌：校徽 + 提示语，正好骑在门缝上。
   阴影放在这一层（它不动），呼吸动画放在下面的 img 上 ——
   带 filter 的元素会单独占一个渲染层，进/出全屏时这层会被重建，
   两者放在同一个元素上时，动画就会看起来「卡住不动了」。 */
.door-plate{
  position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  display:flex;flex-direction:column;align-items:center;gap:var(--space-md);
  cursor:pointer;
  filter:drop-shadow(0 12px 40px rgba(0,0,0,.35));
  transition:opacity var(--dur-slower) var(--ease-out),
             transform var(--dur-slower) var(--ease-out);
}
.door.open .door-plate{opacity:0;transform:translate(-50%,-50%) scale(1.06);}
/* 关门：门板走到一半，校徽才浮出来 */
.door.closing .door-plate{transition-delay:.45s;cursor:default;}

/* will-change 让 img 这一层跨全屏切换被保留下来 */
.door-plate img{
  width:26vw;min-width:190px;max-width:380px;height:auto;display:block;
  will-change:transform;
  animation:doorBreathe 4s var(--ease-in-out) infinite;
}
@keyframes doorBreathe{
  0%,100%{transform:scale(1);}
  50%{transform:scale(1.045);}
}
.door-hint{
  font-size:var(--fs-small);color:rgba(255,255,255,.62);letter-spacing:.3em;
  animation:softPulse 3s var(--ease-in-out) infinite;
}
/* 收场时挂在门牌下面的一句话 */
.door-note{
  font-size:var(--fs-subtitle);color:rgba(255,255,255,.9);
  letter-spacing:.06em;text-align:center;
}
`);

  /* 保险丝：万一浏览器在全屏切换时把动画的渲染层丢了（layer 重建，
     动画看起来就停住了），切回来时把动画重启一次。
     强制读一次 offsetWidth 会触发回流，动画才会真的从头开始。 */
  document.addEventListener('fullscreenchange', function () {
    var img = document.querySelector('.door-plate img');
    if (!img) return;
    img.style.animation = 'none';
    void img.offsetWidth;
    img.style.animation = '';
  });

  window.DOOR = {
    html: function (opt) {
      opt = opt || {};
      return '<div class="door' + (opt.open ? ' open' : '') + '" id="door">' +
               '<div class="door-panel door-l"></div>' +
               '<div class="door-panel door-r"></div>' +
               '<div class="door-plate" id="doorPlate">' +
                 '<picture>' +
                   '<source srcset="' + LOGO + '" type="image/webp">' +
                   '<img src="' + LOGO_PNG + '" alt="浙江大学">' +
                 '</picture>' +
                 (opt.hint ? '<div class="door-hint">' + opt.hint + '</div>' : '') +
                 (opt.note ? '<div class="door-note">' + opt.note + '</div>' : '') +
               '</div>' +
             '</div>';
    },

    /* 拉开门：等 delay → 加 .open → 动画走完把门从 DOM 摘掉 */
    open: function (ctx, delay) {
      ctx.after(delay == null ? 60 : delay, function () {
        var d = ctx.q('#door');
        if (!d) return;
        d.classList.add('open');
        ctx.after(1200, function () {
          if (d.parentNode) d.parentNode.removeChild(d);
        });
      });
    },

    /* 合上门：门一开始是开着的，等 delay 之后收回来 */
    close: function (ctx, delay) {
      var d = ctx.q('#door');
      if (!d) return;
      d.classList.add('closing');
      ctx.after(delay == null ? 60 : delay, function () { d.classList.remove('open'); });
    },
  };
})();
