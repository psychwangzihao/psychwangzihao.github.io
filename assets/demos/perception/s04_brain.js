/* ============================================================
 * 场景 4：大脑  (id: brain · 4 个状态)
 * 目的：建立「感觉在大脑」的空间感。
 *
 * 说明：本 demo 无构建步骤、零外部依赖，也没有 .glb 模型，
 *       所以放弃 Three.js，改为手写一张「侧视人脑」内联 SVG
 *       （左半球 · 面朝左）：额叶 / 顶叶 / 颞叶 / 枕叶 / 小脑 /
 *       脑干 + 边缘叶 / 前额叶，全部由贝塞尔曲线拼成，
 *       每个脑叶都是一个独立 <path id="lobe-*">，可单独高亮。
 * ============================================================ */

PERCEPTION.css('scene-brain', `
/* ---------- 大脑 SVG 通用皮肤 ---------- */
.brain{
  display:block;width:100%;height:auto;
  font-family:var(--font-sans);overflow:visible;
}
/* ---- Gray 版画的线稿（三层，都不接指针）---- */

/* 粗块面：外轮廓和几条大沟 */
.plate-mass{fill:var(--brain-ink);stroke:none;pointer-events:none;}

/* 细线：脑回、小脑叶片、脑干。整张图「像脑」全靠这一层 */
.plate-line{
  fill:none;stroke:var(--brain-ink);stroke-width:2.6;
  stroke-linecap:round;stroke-linejoin:round;pointer-events:none;
}

/* 虚线：原图用来表示被遮住的内侧面，保留 */
.plate-dash{
  fill:none;stroke:var(--brain-ink);stroke-width:2.6;
  stroke-dasharray:6 8;stroke-linecap:round;pointer-events:none;
}

/* ---- 可点击的脑区，全部**不填色**，只在高亮时上色 ----
   fill:none 的元素默认不响应指针，所以必须 pointer-events:all。
   它们画在线稿下面，于是蓝色是「从褶皱下面透出来」的。 */
.lobe{
  fill:none;pointer-events:all;
  transition:fill var(--dur-normal) var(--ease-out),
             stroke var(--dur-normal) var(--ease-out);
}
.lobe.on{fill:var(--accent-blue-light);}
.lobe.err{fill:var(--error);fill-opacity:.42;}

/* 边缘叶：内侧结构，外侧观看不见，用虚线带表示（和原图同一套语言） */
.lobe-band{
  fill:none;stroke:rgba(139,126,200,.16);stroke-width:26;
  stroke-linecap:round;stroke-dasharray:9 9;
  pointer-events:stroke;
}
.lobe-band.on{stroke:var(--accent-purple);stroke-opacity:.62;}
.lobe-band.err{stroke:var(--error);stroke-opacity:.6;}

/* ---- 手区（4.2 幻肢痛用）---- */
.brain .spot{
  fill:var(--accent-pink);stroke:var(--accent-pink);stroke-width:1.5;
  opacity:0;pointer-events:none;
  transition:opacity var(--dur-slower) var(--ease-out);
}
.brain .spot.on{opacity:.85;animation:softPulse 1s var(--ease-in-out) infinite;}
.brain .spot-cap{
  fill:var(--accent-pink);font-size:24px;font-weight:var(--fw-bold);
  paint-order:stroke;stroke:var(--bg-primary);stroke-width:7;
  opacity:0;pointer-events:none;
  transition:opacity var(--dur-slower) var(--ease-out);
}
.brain .spot-cap.on{opacity:1;}

/* 脑叶说明文字：默认隐藏，高亮时淡入。
   文字描了一圈脑底色（paint-order:stroke），压在褶皱上也读得清 ——
   不然「边缘叶」这种落在一堆流线上的标签会糊掉。 */
.brain .cap{opacity:0;pointer-events:none;
  transition:opacity var(--dur-slow) var(--ease-out);}
.brain .cap.on{opacity:1;}
.brain .cap text{
  paint-order:stroke;stroke:var(--bg-primary);stroke-width:9;
  stroke-linejoin:round;
}
.brain .cap .t{fill:var(--text-primary);font-size:30px;font-weight:var(--fw-bold);}
.brain .cap .s{fill:var(--text-secondary);font-size:21px;}
/* 放对了标签，就顺手把那个脑叶的说明浮出来（4.1 用，不必改 JS） */
.brain:has(#lobe-frontal.on)    .cap[data-cap="lobe-frontal"],
.brain:has(#lobe-parietal.on)   .cap[data-cap="lobe-parietal"],
.brain:has(#lobe-temporal.on)   .cap[data-cap="lobe-temporal"],
.brain:has(#lobe-occipital.on)  .cap[data-cap="lobe-occipital"],
.brain:has(#lobe-limbic.on)     .cap[data-cap="lobe-limbic"],
.brain:has(#lobe-prefrontal.on) .cap[data-cap="lobe-prefrontal"],
.brain .cap.on{opacity:1;}

/* 手区（4.2 幻肢痛用） */
.brain .spot{
  fill:var(--accent-pink);stroke:var(--accent-pink);stroke-width:1.5;
  opacity:0;pointer-events:none;
  transition:opacity var(--dur-slower) var(--ease-out);
}
.brain .spot.on{opacity:.9;animation:softPulse 1s var(--ease-in-out) infinite;}
.brain .spot-cap{
  fill:var(--accent-pink);font-size:12px;font-weight:var(--fw-bold);
  opacity:0;pointer-events:none;
  transition:opacity var(--dur-slower) var(--ease-out);
}
.brain .spot-cap.on{opacity:1;}

/* ---------- 4.0 待机动画：替身版「自动旋转」 ---------- */
.brain .drift,.brain .breath{transform-box:fill-box;transform-origin:center;}
.brain .drift{animation:brainDrift 9s var(--ease-in-out) infinite;}
.brain .breath{animation:brainBreath 6s var(--ease-in-out) infinite;}
.brain.no-drift .drift{animation:none;}
@keyframes brainDrift{
  0%{transform:translateX(-.6vw);}
  50%{transform:translateX(.6vw);}
  100%{transform:translateX(-.6vw);}
}
@keyframes brainBreath{
  0%,100%{transform:scale(1);}
  50%{transform:scale(1.015);}
}

/* ---------- 4.0 舞台 ---------- */
#brainStage{width:100%;display:flex;align-items:center;justify-content:center;}
#brainTilt{
  width:46vw;min-width:280px;max-width:920px;
  transform-origin:center;transform-style:preserve-3d;
  transition:transform 140ms linear;will-change:transform;
}
#brainZoom{transform-origin:center;
  transition:transform var(--dur-fast) var(--ease-out);}
.brain-hint{
  position:absolute;left:0;right:0;bottom:5vw;
  text-align:center;pointer-events:none;
}

/* ---------- 4.1 贴标签 ---------- */
#labWrap{
  display:flex;align-items:center;justify-content:center;
  gap:var(--space-xl);width:100%;
}
#labRail{
  width:20vw;min-width:170px;flex:none;
  display:flex;flex-direction:column;gap:var(--space-sm);
}
#labProg{color:var(--text-secondary);font-variant-numeric:tabular-nums;}
#labPills{display:flex;flex-direction:column;gap:1vw;}

.tag{
  background:var(--bg-card);color:var(--text-primary);
  border:1px solid var(--border-subtle);border-radius:var(--radius-full);
  padding:.55vw 1.2vw;font-size:var(--fs-small);line-height:1.5;
  box-shadow:var(--shadow-sm);text-align:center;white-space:nowrap;
  cursor:grab;user-select:none;-webkit-user-select:none;touch-action:none;
  transition:transform var(--dur-fast) var(--ease-out),
             box-shadow var(--dur-fast) var(--ease-out),
             border-color var(--dur-fast) var(--ease-out),
             background var(--dur-fast) var(--ease-out),
             color var(--dur-fast) var(--ease-out),
             font-size var(--dur-fast) var(--ease-out);
}
.tag:hover{transform:translateY(-2px);box-shadow:var(--shadow-md);
  border-color:var(--accent-blue);}
.tag.selected{
  border-color:var(--accent-blue);background:var(--accent-blue-light);
  color:var(--accent-blue);font-weight:var(--fw-bold);transform:translateY(-2px);
  box-shadow:0 0 0 4px rgba(74,144,217,.16),var(--shadow-md);
}
.tag.dragging{opacity:.32;}
.tag.done{
  background:var(--bg-secondary);color:var(--text-tertiary);
  border-color:transparent;box-shadow:none;cursor:default;
  font-size:var(--fs-tiny);padding:.3vw 1vw;transform:none;
}
.tag.done::before{content:'✓ ';color:var(--success);font-weight:var(--fw-bold);}
.tag.done:hover{transform:none;box-shadow:none;border-color:transparent;}

/* 跟随指针的克隆体 */
.tag-ghost{
  position:fixed;left:0;top:0;z-index:70;margin:0;
  pointer-events:none;
  transform:translate(-50%,-50%) rotate(-4deg);
  background:var(--bg-card);color:var(--accent-blue);
  border:1px solid var(--accent-blue);border-radius:var(--radius-full);
  padding:.55vw 1.2vw;font-size:var(--fs-small);line-height:1.5;
  white-space:nowrap;box-shadow:var(--shadow-lg);opacity:.96;
}

#labBrainWrap{
  width:46vw;min-width:260px;flex:none;
  display:flex;align-items:center;justify-content:center;
}
#labBrainWrap.armed .brain .lobe{cursor:pointer;}
#labBrainWrap.armed .brain .lobe:hover{fill:var(--accent-blue-light);}
#labBrainWrap.armed .brain .lobe-band:hover{stroke:var(--accent-purple);stroke-opacity:.62;}

/* ---------- 4.2 幻肢痛 ---------- */
#phWrap{
  display:flex;align-items:center;justify-content:center;
  gap:var(--space-2xl);width:100%;
}
#phFig{width:17vw;min-width:150px;flex:none;}
#phFig svg{display:block;width:100%;height:auto;}
/* 身体：和大脑同一套墨色，两件东西才像一套图 */
#phFig .fig-body{
  fill:none;stroke:var(--brain-ink);stroke-width:5.2;
  stroke-linecap:round;stroke-linejoin:round;
}
/* 幽灵手臂：被截掉的那条，用虚线留在原地 */
#phFig .fig-ghost{
  fill:none;stroke:var(--accent-pink);stroke-width:5;
  stroke-linecap:round;stroke-dasharray:9 9;
}
#phFig .fig-cut{stroke:var(--accent-pink);stroke-width:4;stroke-linecap:round;}
#phFig .fig-leader{stroke:var(--accent-pink);stroke-width:2;stroke-dasharray:3 5;}
#phFig .fig-lab{
  fill:var(--accent-pink);stroke:none;
  font-family:var(--font-sans);font-size:34px;font-weight:var(--fw-bold);
}
#phBrain{width:34vw;min-width:240px;flex:none;}
#phBrain .brain{pointer-events:none;}
`);


/* ============================================================
 * 大脑图形：直接用 Gray's Anatomy 的矢量线稿（见 brain-art.js）
 *
 * 这个文件里没有一条脑回是「画」出来的 —— 脑回、小脑叶片、脑干、
 * 外轮廓全部来自那张公有领域的解剖图。s04 只负责三件事：
 *   · 把线稿上色成设计系统里的暖色
 *   · 把四个脑叶做成透明、可点击的区域
 *   · 补两个图上没有、但讲稿需要的区域：前额叶、边缘叶
 * ============================================================ */

/* 前额叶：额叶最前面的一块。原图没有单独分区，
   用 clipPath 把额叶切一刀 —— 是裁剪，不是重画。 */
var BRAIN_PF_CUT = 252;

/* 边缘叶：内侧面的结构，外侧观本来就看不见。原图已经用虚线
   表示被遮住的部位，这里沿用同一套画法，画一条虚线 C 带 ——
   顺便讲一句「它在大脑内侧面，从外面看不见」。 */
var BRAIN_LIMBIC =
  'M300,352 C312,232 428,186 566,192 C672,198 742,256 758,340';

/* 脑叶说明：标题 + 一行小字（高亮时淡入）。坐标是原图坐标系 */
var BRAIN_CAPS = [
  { id: 'lobe-frontal',    x: 288, y: 248, t: '额叶',   s: '运动 · 计划 · 语言' },
  { id: 'lobe-parietal',   x: 636, y: 208, t: '顶叶',   s: '触觉 · 痛觉 · 空间' },
  { id: 'lobe-temporal',   x: 592, y: 470, t: '颞叶',   s: '听觉 · 记忆' },
  { id: 'lobe-occipital',  x: 858, y: 372, t: '枕叶',   s: '视觉' },
  { id: 'lobe-prefrontal', x: 146, y: 300, t: '前额叶', s: '自我 · 决策' },
  { id: 'lobe-limbic',     x: 508, y: 296, t: '边缘叶', s: '情绪 · 记忆' },
];

/* 脑叶的绘制顺序（后画的盖住先画的）。前额叶压在额叶上，
   所以点额叶最前面那一块时命中的是前额叶。 */
var BRAIN_ORDER = [
  'lobe-occipital', 'lobe-parietal', 'lobe-temporal', 'lobe-frontal',
  'lobe-prefrontal', 'lobe-limbic',
];

/* 四个脑叶的路径（来自 Gray 图 728 的矢量版），按 id 对上 */
var BRAIN_LOBE_PATH = {
  'lobe-frontal':    BRAIN_PLATE_LOBES.frontal,
  'lobe-parietal':   BRAIN_PLATE_LOBES.parietal,
  'lobe-temporal':   BRAIN_PLATE_LOBES.temporal,
  'lobe-occipital':  BRAIN_PLATE_LOBES.occipital,
};


/* clipPath 的 id 需要唯一（同页可能先后存在两张脑图） */
var brainUid = 0;

/**
 * 生成一张人脑侧视 SVG。
 * @param {{idle?:boolean, cls?:string}} o
 *   idle = true 时套上「缓慢平移 + 呼吸」的待机动画分组
 */
function brainSVG(o) {
  o = o || {};
  var uid = ++brainUid;
  var pfClip = 'brainpf' + uid;    /* id 必须唯一：同页会先后存在两张脑图 */
  var s = '';
  function paths(arr, cls) {
    return '<g class="' + cls + '">' + arr.map(function (d) {
      return '<path d="' + d + '"></path>';
    }).join('') + '</g>';
  }

  /* 前额叶 = 额叶裁掉后半部分，用 clipPath 切，不重画 */
  s += '<defs><clipPath id="' + pfClip + '">' +
         '<rect x="0" y="0" width="' + BRAIN_PF_CUT + '" height="740"/>' +
       '</clipPath></defs>';

  /* ---- 第一层：可点击的脑区。全部透明，只负责接指针 ----
     它们压在**线稿下面**，所以高亮时是「蓝色从褶皱下面透出来」，
     而不是盖上去一块蓝色贴纸。fill:none 的元素默认不接指针，
     所以 CSS 里给了 pointer-events:all。 */
  BRAIN_ORDER.forEach(function (id) {
    if (id === 'lobe-limbic') {
      /* 边缘叶：虚线 C 带，靠描边接指针（pointer-events:stroke） */
      s += '<path class="lobe lobe-band" id="' + id + '" d="' + BRAIN_LIMBIC + '"></path>';
    } else if (id === 'lobe-prefrontal') {
      s += '<path class="lobe" id="' + id + '" clip-path="url(#' + pfClip + ')" d="' +
           BRAIN_PLATE_LOBES.frontal + '"></path>';
    } else {
      s += '<path class="lobe" id="' + id + '" d="' + BRAIN_LOBE_PATH[id] + '"></path>';
    }
  });

  /* ---- 第二层：Gray 版画的线稿，一点没改 ----
     粗块面（外轮廓 + 几条大沟）→ 细线（脑回、小脑叶片、脑干）→ 虚线
     这三层都不接指针，点击会穿过它们落到下面的脑区上 */
  s += paths(BRAIN_PLATE_MASS, 'plate-mass');
  s += paths(BRAIN_PLATE_SOLID, 'plate-line');
  s += paths(BRAIN_PLATE_DASHED, 'plate-dash');

  /* 手区：中央沟后缘的感觉手区，幻肢痛讲的正是这里的重映射。
     位置是按这张图量的 —— 中央沟顶端往后再往下一点。 */
  s += '<circle class="spot" cx="602" cy="196" r="32"></circle>';
  s += '<text class="spot-cap" x="602" y="122" text-anchor="middle">手区</text>';

  /* 说明文字 */
  s += '<g class="caps">' + BRAIN_CAPS.map(function (c) {
    return '<g class="cap" data-cap="' + c.id + '">' +
             '<text class="t" x="' + c.x + '" y="' + c.y + '" text-anchor="middle">' + c.t + '</text>' +
             '<text class="s" x="' + c.x + '" y="' + (c.y + 20) + '" text-anchor="middle">' + c.s + '</text>' +
           '</g>';
  }).join('') + '</g>';

  if (o.idle) s = '<g class="drift"><g class="breath">' + s + '</g></g>';

  return '<svg class="brain ' + (o.cls || '') + '" viewBox="16 26 976 706" ' +
         'xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + s + '</svg>';
}


/* 4.2 用的幻肢图：NASA 先驱者号人像（公有领域），腰部以上。
   抬起的那条手臂在下层被裁掉、再用虚线描一遍 —— 这就是幻肢本身。
   几何来自 figure-art.js，一点没改。 */
function phantomFigureSVG() {
  var c = FIGURE_ARM_CUT;
  var cut = '<rect x="' + c.x + '" y="' + c.y + '" width="' + c.w + '" height="' + c.h + '"/>';
  return '<svg viewBox="' + FIGURE_VIEWBOX + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<defs>' +
      '<clipPath id="figArm">' + cut + '</clipPath>' +
      '<mask id="figCut">' +
        '<rect x="-40" y="-40" width="640" height="1420" fill="#fff"/>' +
        '<rect x="' + c.x + '" y="' + c.y + '" width="' + c.w + '" height="' + c.h + '" fill="#000"/>' +
      '</mask>' +
    '</defs>' +
    '<path class="fig-body" d="' + FIGURE_BODY + '" mask="url(#figCut)"/>' +
    '<path class="fig-ghost" d="' + FIGURE_BODY + '" clip-path="url(#figArm)"/>' +
    FIGURE_EYES.map(function (d) { return '<path class="fig-body" d="' + d + '"/>'; }).join('') +
    /* 截断处 + 标注 */
    '<path class="fig-cut" d="M132,392 L186,436"/>' +
    '<path class="fig-leader" d="M182,430 L232,478"/>' +
    '<text class="fig-lab" x="240" y="500">截肢</text>' +
  '</svg>';
}


/* 本场景在 PERCEPTION.scenes 里的下标（4.1 全部放好后要自动跳到 4.2） */
function brainSceneIndex() {
  var list = PERCEPTION.scenes || [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === 'brain') return i;
  }
  return 4;
}

PERCEPTION.scene({
  id: 'brain',
  label: '大脑模型',
  noClick: true,          /* 本场景全是交互，误点不该翻页 */
  states: [

    /* ---- 4.0 模型展示：待机漂移 + 视差拖拽 + 滚轮缩放 ---- */
    function (ctx, wrap) {
      ctx.set(
        '<div id="brainStage">' +
          '<div id="brainTilt" class="anim fade" style="--d:.05s">' +
            '<div id="brainZoom">' + brainSVG({ idle: true }) + '</div>' +
          '</div>' +
        '</div>' +
        ''
      );

      var stage = ctx.q('#brainStage');
      var tilt = ctx.q('#brainTilt');
      var zoom = ctx.q('#brainZoom');
      var svg = ctx.q('#brainTilt .brain');

      var scale = 1;
      var drifting = true;

      /* 用户一上手就停掉待机漂移（呼吸保留，脑还活着） */
      function stopDrift() {
        if (!drifting) return;
        drifting = false;
        if (svg) svg.classList.add('no-drift');
      }

      /* 视差：指针在脑上移动 → 轻微 3D 倾斜 */
      ctx.on(stage, 'pointermove', function (e) {
        var r = stage.getBoundingClientRect();
        if (!r.width || !r.height) return;
        var nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        var ny = ((e.clientY - r.top) / r.height) * 2 - 1;
        nx = Math.max(-1, Math.min(1, nx));
        ny = Math.max(-1, Math.min(1, ny));
        tilt.style.transform =
          'perspective(1200px) rotateY(' + (nx * 7).toFixed(2) + 'deg)' +
          ' rotateX(' + (-ny * 5).toFixed(2) + 'deg)';
        stopDrift();
      });

      /* 滚轮缩放：夹在 0.8× ~ 1.4× */
      ctx.on(wrap, 'wheel', function (e) {
        e.preventDefault();
        scale = Math.max(0.8, Math.min(1.4, scale - e.deltaY * 0.0008));
        zoom.style.transform = 'scale(' + scale.toFixed(3) + ')';
        stopDrift();
      }, { passive: false });

      /* 脑叶名字依次亮起，先认识一下这张图 */
      ctx.after(700, function () {
        ctx.each('.brain .cap', function (el, i) {
          ctx.after(i * 130, function () { el.classList.add('on'); });
        });
      });
    },

    /* ---- 4.1 贴标签：把 6 个感觉拖到对应脑区 ---- */
    function (ctx, wrap) {
      var TARGETS = [
        ['视觉', 'lobe-occipital'],
        ['听觉', 'lobe-temporal'],
        ['触觉', 'lobe-parietal'],
        ['痛觉', 'lobe-parietal'],   /* 触觉与痛觉同落顶叶，允许一个脑区被两个标签命中 */
        ['情绪', 'lobe-limbic'],
        ['自我', 'lobe-prefrontal'],
      ];
      var TOTAL = TARGETS.length;

      ctx.set(
        '<div id="labWrap">' +
          '<div id="labRail" class="anim fade" style="--d:.05s">' +
            '<div id="labProg" class="small">已放置 0/6</div>' +
            '<div id="labPills">' +
              TARGETS.map(function (t) {
                return '<div class="tag" data-target="' + t[1] + '">' + t[0] + '</div>';
              }).join('') +
            '</div>' +
            '<div class="small faint" style="margin-top:var(--space-xs)">' +
              '' +
            '</div>' +
          '</div>' +
          '<div id="labBrainWrap" class="anim fade" style="--d:.2s">' +
            brainSVG({}) +
          '</div>' +
        '</div>'
      );

      var prog = ctx.q('#labProg');
      var rail = ctx.q('#labBrainWrap');
      var sel = null;
      var placed = 0;

      /* ---- 命中检测：从落点往上找最近的 lobe-* ---- */
      function lobeAt(x, y) {
        var el = document.elementFromPoint(x, y);
        if (!el || !el.closest) return null;
        return el.closest('[id^="lobe-"]');
      }

      function capOf(id) {
        return ctx.q('.brain .cap[data-cap="' + id + '"]');
      }

      /* ---- 点击选中 / 取消选中 ---- */
      function select(el) {
        if (sel === el) {
          el.classList.remove('selected');
          sel = null;
          rail.classList.remove('armed');
          return;
        }
        if (sel) sel.classList.remove('selected');
        sel = el;
        el.classList.add('selected');
        rail.classList.add('armed');
      }

      /* ---- 弹回（标签抖动，位置不变） ---- */
      function spring(el) {
        el.classList.remove('shake');
        void el.offsetWidth;                 /* 重启动画 */
        el.classList.add('shake');
        ctx.after(560, function () { el.classList.remove('shake'); });
      }

      /* ---- 目标脑区红闪 400ms ---- */
      function flash(lobe) {
        if (!lobe) return;
        lobe.classList.add('err');
        ctx.after(400, function () { lobe.classList.remove('err'); });
      }

      /* ---- 放对了 ---- */
      function accept(el, lobe) {
        el.classList.add('done');
        el.classList.remove('selected');
        if (sel === el) sel = null;
        rail.classList.remove('armed');

        lobe.classList.add('on');
        if (lobe.animate) {
          lobe.animate([{ opacity: .3 }, { opacity: 1 }],
                       { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' });
        }
        var cap = capOf(lobe.id);
        if (cap) cap.classList.add('on');

        placed++;
        prog.textContent = '已放置 ' + placed + '/6';

        if (placed >= TOTAL) {
          ctx.toast('六个感觉，全都回到大脑里了');
          ctx.after(700, function () { ctx.goto(brainSceneIndex(), 2); });
        }
      }

      /* ---- 一次判定 ---- */
      function judge(el, lobe) {
        if (!lobe) { spring(el); return; }            /* 落在空白处：弹回 */
        if (lobe.id === el.dataset.target) accept(el, lobe);
        else { spring(el); flash(lobe); }
      }

      /* ---- 每个标签：点击选中 + 指针拖拽（Pointer Events） ---- */
      ctx.each('.tag', function (el) {
        var sx = 0, sy = 0, down = false, moved = false, ghost = null;

        function killGhost() {
          if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
          ghost = null;
        }

        ctx.on(el, 'pointerdown', function (e) {
          if (el.classList.contains('done')) return;
          e.preventDefault();
          down = true;
          moved = false;
          sx = e.clientX;
          sy = e.clientY;
          if (el.setPointerCapture) {
            try { el.setPointerCapture(e.pointerId); } catch (err) {}
          }
        });

        ctx.on(el, 'pointermove', function (e) {
          if (!down || el.classList.contains('done')) return;
          var dx = e.clientX - sx, dy = e.clientY - sy;

          if (!moved) {
            /* 位移 < 6px 当成点击，不算拖拽 */
            if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
            moved = true;
            el.classList.add('dragging');
            ghost = el.cloneNode(true);
            ghost.className = 'tag-ghost';           /* 跟着指针飞的克隆体 */
            document.body.appendChild(ghost);
          }
          ghost.style.left = e.clientX + 'px';
          ghost.style.top = e.clientY + 'px';
        });

        ctx.on(el, 'pointerup', function (e) {
          if (!down) return;
          down = false;
          if (el.releasePointerCapture) {
            try { el.releasePointerCapture(e.pointerId); } catch (err) {}
          }
          el.classList.remove('dragging');
          killGhost();
          if (el.classList.contains('done')) return;

          if (!moved) { select(el); return; }        /* 没动 = 点击选中 */

          judge(el, lobeAt(e.clientX, e.clientY));   /* 动了 = 放到落点的脑区 */
        });

        ctx.on(el, 'pointercancel', function () {
          down = false;
          moved = false;
          el.classList.remove('dragging');
          killGhost();
        });
      });

      /* ---- 点了标签之后，再点脑区 ---- */
      ctx.on(rail, 'click', function (e) {
        var lobe = e.target.closest ? e.target.closest('[id^="lobe-"]') : null;
        if (!lobe || !sel) return;
        judge(sel, lobe);
      });

      /* 离场时清掉可能残留的克隆体 */
      return function () {
        Array.prototype.forEach.call(
          document.querySelectorAll('.tag-ghost'),
          function (g) { if (g.parentNode) g.parentNode.removeChild(g); }
        );
      };
    },

    /* ---- 4.2 幻肢痛 ---- */
    function (ctx) {
      ctx.set(
        '<div id="phWrap">' +
          '<div id="phFig" class="anim fade" style="--d:.1s">' + phantomFigureSVG() + '</div>' +
          '<div id="phBrain" class="anim fade" style="--d:.3s">' +
            brainSVG({ cls: 'brain-static' }) +
          '</div>' +
        '</div>' +
        '<div class="brain-hint subtitle bold center anim fade" style="--d:.9s">' +
          '手不在了，痛还在。因为感觉不在手，在大脑。' +
        '</div>'
      );

      /* 对应的手区亮起来、轻轻脉动 */
      ctx.after(700, function () {
        var spot = ctx.q('#phBrain .spot');
        var lab = ctx.q('#phBrain .spot-cap');
        if (spot) spot.classList.add('on');
        if (lab) lab.classList.add('on');
      });
    },

    /* ---- 4.3 过渡：从「感觉在大脑」推到「线路能不能改」 ---- */
    function (ctx) {
      ctx.set(
        '<h2 class="title bold center anim fade" style="--d:.1s;max-width:70vw">' +
          '感觉在哪里，由大脑决定。<br>那这条线路，是天生固定、不能改的吗？' +
        '</h2>'
      );
    },

  ],
});
