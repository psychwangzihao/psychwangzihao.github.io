/* ============================================================
 * 场景 4：大脑模型  (id: brain · 5 个状态)
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
/* 整脑：底色由 SVG 里的径向渐变给（左上亮、右下沉），这里只管描边 */
.brain .hull{stroke:var(--brain-line);stroke-width:2.4;stroke-linejoin:round;}
/* 外轮廓描边单独再压一层，保证线条完整 */
.brain .outline{fill:none;stroke:var(--brain-line);stroke-width:2.4;
  stroke-linejoin:round;pointer-events:none;}
/* 小脑 / 脑干：轮廓之外的两个独立结构（先画，上半被大脑盖住） */
.brain .stem{fill:var(--brain-deep);stroke:none;}
.brain .stem-outline{fill:none;stroke:var(--brain-line);stroke-width:2.2;
  stroke-linejoin:round;pointer-events:none;}
/* 脑叶：**不填色**，只用来接指针 —— 高亮时给整块脑面上层蓝，
   脑回仍然画在它上面，于是蓝色是「透过褶皱透出来」的。
   fill:none 的元素默认不响应指针，所以必须 pointer-events:all。 */
.brain .lobe{
  fill:none;pointer-events:all;
  transition:fill var(--dur-normal) var(--ease-out);
}
.brain .lobe.on{fill:var(--accent-blue-light);}
.brain .lobe.err{fill:var(--error);fill-opacity:.55;}
/* 脑回：流线，细而密，比大沟淡一档 —— 它是「质感」不是「结构」 */
.brain .gyri{
  fill:none;stroke:rgba(122,100,78,.34);stroke-width:1.5;
  stroke-linecap:round;stroke-linejoin:round;pointer-events:none;
}
/* 三条大沟：中央沟 / 外侧裂 / 顶枕沟 —— 比脑回更重、更深 */
.brain .sulcus{
  fill:none;stroke:rgba(100,78,58,.58);stroke-width:3;
  stroke-linecap:round;pointer-events:none;
}
/* 小脑叶片 */
.brain .folia{fill:none;stroke:rgba(122,100,78,.32);stroke-width:1.5;
  stroke-linecap:round;pointer-events:none;}

/* 脑叶说明文字：默认隐藏，高亮时淡入。
   文字描了一圈脑底色（paint-order:stroke），压在褶皱上也读得清 ——
   不然「边缘叶」这种落在一堆流线上的标签会糊掉。 */
.brain .cap{opacity:0;pointer-events:none;
  transition:opacity var(--dur-slow) var(--ease-out);}
.brain .cap.on{opacity:1;}
.brain .cap text{
  paint-order:stroke;stroke:#EFE8DE;stroke-width:6;
  stroke-linejoin:round;
}
.brain .cap .t{fill:var(--text-primary);font-size:17px;font-weight:var(--fw-bold);}
.brain .cap .s{fill:var(--text-secondary);font-size:12.5px;}
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
#labBrainWrap.armed .brain .lobe:hover{
  fill:var(--accent-blue-light);stroke:var(--accent-blue);
}

/* ---------- 4.2 幻肢痛 ---------- */
#phWrap{
  display:flex;align-items:center;justify-content:center;
  gap:var(--space-2xl);width:100%;
}
#phFig{width:15vw;min-width:140px;flex:none;}
#phFig svg{display:block;width:100%;height:auto;overflow:visible;}
#phFig path,#phFig circle{
  fill:none;stroke:var(--text-tertiary);stroke-width:2;
  stroke-linecap:round;stroke-linejoin:round;
}
#phFig .dash{stroke-dasharray:6 6;}
#phFig .cut{stroke:var(--accent-pink);stroke-width:2.5;stroke-dasharray:5 5;}
#phFig .leader{stroke:var(--accent-pink);stroke-width:1.5;stroke-dasharray:2 4;}
#phFig .fig-lab{
  fill:var(--accent-pink);stroke:none;
  font-family:var(--font-sans);font-size:14px;font-weight:var(--fw-bold);
}
#phBrain{width:34vw;min-width:240px;flex:none;}
#phBrain .brain{pointer-events:none;}
`);

/* ============================================================
 * 脑几何：viewBox 0 0 620 450，左半球面朝左。
 *
 * 画法：先定一条完整的人脑侧视「外轮廓」，所有脑叶都用它
 * 做 clipPath 裁剪 —— 这样脑叶之间永远不会有空洞，脑叶图形
 * 也可以放心地画大一圈，由轮廓来收边。
 *   · 额叶在前（左）、枕叶在后（右）
 *   · 颞叶向前下方突出（与额叶之间那道缝＝外侧裂）
 *   · 小脑在后下（带横纹）、脑干自底部中央垂下
 * ============================================================ */
/* 大脑外轮廓（不含小脑/脑干）：额极在左，顶点偏前，枕极在右，
   颞叶向前下方鼓出 —— 这是整张图读起来「像脑」的关键。 */
/* 把一串点连成平滑曲线（Catmull-Rom 转三次贝塞尔）。
   closed=true 时首尾相接。 */
function smoothPath(pts, closed) {
  var n = pts.length, s, i, j;
  function at(k) { return pts[closed ? (k + n) % n : Math.max(0, Math.min(n - 1, k))]; }
  s = 'M' + pts[0][0].toFixed(1) + ',' + pts[0][1].toFixed(1);
  var last = closed ? n : n - 1;
  for (j = 1; j <= last; j++) {
    var p0 = at(j - 1), p1 = at(j), q0 = at(j - 2), q1 = at(j + 1);
    s += 'C' + (p0[0] + (p1[0] - q0[0]) / 6).toFixed(1) + ',' +
               (p0[1] + (p1[1] - q0[1]) / 6).toFixed(1) + ' ' +
               (p1[0] - (q1[0] - p0[0]) / 6).toFixed(1) + ',' +
               (p1[1] - (q1[1] - p0[1]) / 6).toFixed(1) + ' ' +
               p1[0].toFixed(1) + ',' + p1[1].toFixed(1);
  }
  return s + (closed ? 'Z' : '');
}

/* 大脑外轮廓。手画的贝塞尔总是收成一个规规矩矩的蛋，而真正的
   脑轮廓是「坑坑洼洼」的 —— 脑回在边上顶出一个个小鼓包。所以这里
   改用极坐标生成：椭圆 + 三组不同频率的径向起伏 + 颞叶处的额外鼓出。 */
function brainOutlinePath() {
  var cx = 312, cy = 176;          /* 脑的中心 */
  var rx = 250;                    /* 前后半径 */
  var ryTop = 145, ryBot = 114;    /* 上下半径不同：顶是穹窿，底要平一些 */
  var N = 120, d = [], i;
  for (i = 0; i < N; i++) {
    var a = i / N * Math.PI * 2;   /* 0 → 右 · π/2 → 下 · π → 左 · 3π/2 → 上 */
    var u = Math.cos(a), v = Math.sin(a);
    /* 脑回造成的轮廓起伏（三个互质频率，避免出现明显周期） */
    var k = 1
      + 0.030 * Math.sin(a * 9 + 0.7)
      + 0.021 * Math.sin(a * 17 + 2.1)
      + 0.013 * Math.sin(a * 29 + 4.4);
    /* 颞叶：左下方（≈140°）额外鼓出一块 */
    var ta = a - Math.PI * 0.78;
    k *= 1 + 0.14 * Math.exp(-(ta * ta) / 0.22);
    var ry = v < 0 ? ryTop : ryBot;
    d.push([cx + rx * u * k, cy + ry * v * k]);
  }
  return smoothPath(d, true);
}

/* 小脑：后下，扁而宽，上半被大脑盖住，只露出下面一小截 */
var BRAIN_CEREBELLUM =
  'M400,244 C452,232 512,242 546,266 C572,286 570,316 542,330 ' +
  'C506,348 442,344 404,320 C388,310 388,270 400,244 Z';

/* 脑干：自大脑底部中央垂下的一小截短柄 */
var BRAIN_BRAINSTEM =
  'M306,268 C328,280 346,310 354,338 C360,360 356,376 348,386 ' +
  'C334,394 320,390 314,378 C304,358 300,326 300,300 ' +
  'C301,284 303,272 306,268 Z';

var BRAIN_LOBES = {
  /* 枕叶：顶枕沟以后的后端楔形 */
  'lobe-occipital':
    'M464,20 L640,20 L640,320 L486,252 C480,190 470,110 464,20 Z',

  /* 顶叶：中央沟与顶枕沟之间，下界外侧裂 */
  'lobe-parietal':
    'M344,20 L464,20 C470,110 480,190 488,250 L288,248 ' +
    'C308,190 330,110 344,20 Z',

  /* 颞叶：外侧裂以下，向前下方突出 */
  'lobe-temporal':
    'M10,250 C130,224 300,220 440,238 L462,250 L462,460 L10,460 Z',

  /* 额叶：前上方大区，后界即中央沟 */
  'lobe-frontal':
    'M10,20 L344,20 C330,110 308,190 288,248 L10,248 Z',

  /* 前额叶：额叶最前面的一块 */
  'lobe-prefrontal':
    'M10,20 L178,20 C174,106 164,182 150,250 L10,250 Z',

  /* 边缘叶：脑内侧面的 C 形（情绪 · 记忆） */
  'lobe-limbic':
    'M178,262 C164,176 228,118 316,114 C388,110 444,146 472,196 ' +
    'C458,212 440,204 430,190 C406,154 364,138 316,142 ' +
    'C248,148 204,192 214,262 C218,278 182,280 178,262 Z',
};

/* 脑回：用「流线」画，不要用一排行波。
   行波永远是一道道等宽的平行线，看起来像等高线 / 木纹。
   做法：定义一个方向场，再从很多起点沿场走线 —— 流线不相交、
   会一起拐弯、间距有疏有密，正好是脑回的样子。

   场是 8 个不同方向的正弦叠出来的（Gabor 噪声的思路）：
   成分少了会退化成一个大漩涡，整张图就变成木纹带结疤；
   成分多了方向才「一块一块地」变，像真的脑回那样打补丁。
   流线还要短 —— 走太长就会把整个漩涡描出来。 */
var GYRI_WAVES = [
  [ 0.031,  0.014, 1.00, 0.0],
  [-0.019,  0.028, 0.90, 1.7],
  [ 0.041, -0.023, 0.75, 3.1],
  [ 0.012,  0.037, 0.80, 4.6],
  [-0.034, -0.016, 0.70, 0.9],
  [ 0.026,  0.033, 0.62, 2.4],
  [-0.043,  0.011, 0.55, 5.2],
  [ 0.017, -0.039, 0.50, 3.8],
];

function gyriField(x, y) {
  var a = 0;
  for (var i = 0; i < GYRI_WAVES.length; i++) {
    var w = GYRI_WAVES[i];
    a += w[2] * Math.sin(x * w[0] + y * w[1] + w[3]);
  }
  return a * 0.82;
}

function brainGyriPaths() {
  var out = [], i, j;
  for (j = 0; j < 14; j++) {
    for (i = 0; i < 20; i++) {
      /* 起点铺满包围盒 + 抖动，免得流线排成整齐的行、也避免秃斑 */
      var x = 34 + i * 28 + (j % 2 ? 14 : 0) + Math.sin(i * 2.3 + j * 1.7) * 11;
      var y = 10 + j * 23 + Math.sin(i * 1.3 + j * 2.9) * 12;

      var pts = [[x, y]], px = x, py = y;
      var steps = 9 + (i * 5 + j * 3) % 9;        /* 短：4–9 段，断口才不齐整 */
      for (var t = 0; t < steps; t++) {
        var a = gyriField(px, py);
        px += Math.cos(a) * 4.5;
        py += Math.sin(a) * 4.5;
        if (px < 20 || px > 620 || py < 0 || py > 440) break;
        pts.push([px, py]);
      }
      if (pts.length > 2) out.push(smoothPath(pts, false));
    }
  }
  return out;
}

/* 小脑叶片：按小脑的椭圆轮廓算出一排横纹，保证不会戳出轮廓外 ——
   之前那三条手写横纹有两条跑到小脑外面去了。 */
function brainFoliaPaths() {
  var cx = 478, cy = 290, rx = 92, ry = 58;
  var out = [], k, i;
  for (k = 0; k < 9; k++) {
    var y = 248 + k * 11.5;
    var dy = (y - cy) / ry;
    if (Math.abs(dy) > 0.9) continue;
    var hw = rx * Math.sqrt(1 - dy * dy) * 0.9;
    var d = [], n = 7;
    for (i = 0; i <= n; i++) {
      var t = i / n;
      d.push([cx - hw + 2 * hw * t, y + Math.sin(t * Math.PI) * 7]);
    }
    out.push(smoothPath(d, false));
  }
  return out;
}

var BRAIN_OUTLINE = brainOutlinePath();
var BRAIN_GYRI = brainGyriPaths();
var BRAIN_FOLIA = brainFoliaPaths();

/* 几条大沟：这三条线比什么都重要 —— 它们才是「一眼认出是脑」的原因。
   中央沟分出额叶/顶叶，外侧裂分出颞叶，顶枕沟分出枕叶。 */
var BRAIN_SULCI = [
  /* 中央沟 */
  'M356,48 C344,110 322,182 300,246',
  /* 外侧裂 */
  'M124,258 C204,238 300,232 390,238 C428,240 452,244 468,250',
  /* 顶枕沟 */
  'M476,86 C486,150 494,206 500,252',
];

/* 脑叶说明：标题 + 一行小字（高亮时淡入） */
var BRAIN_CAPS = [
  { id: 'lobe-frontal',    x: 240, y: 96,  t: '额叶',   s: '运动 · 计划 · 语言' },
  { id: 'lobe-parietal',   x: 400, y: 104, t: '顶叶',   s: '触觉 · 痛觉 · 空间' },
  { id: 'lobe-temporal',   x: 238, y: 262, t: '颞叶',   s: '听觉 · 记忆' },
  { id: 'lobe-occipital',  x: 520, y: 168, t: '枕叶',   s: '视觉' },
  { id: 'lobe-limbic',     x: 332, y: 186, t: '边缘叶', s: '情绪 · 记忆' },
  { id: 'lobe-prefrontal', x: 122, y: 150, t: '前额叶', s: '自我 · 决策' },
];

/* 大脑内部的绘制顺序（后画的盖住先画的） */
var BRAIN_ORDER = [
  'lobe-occipital', 'lobe-parietal', 'lobe-temporal',
  'lobe-frontal', 'lobe-prefrontal', 'lobe-limbic',
];

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
  var clip = 'brainclip' + uid;
  var clipCb = 'braincb' + uid;
  var grad = 'braingrad' + uid;   /* id 必须唯一：同页会先后存在两张脑图 */
  var s = '';

  /* 小脑与脑干先画：上半截随后被大脑盖住，只露出下半，位置才对 */
  s += '<path class="stem" id="lobe-cerebellum" d="' + BRAIN_CEREBELLUM + '"></path>';
  /* 小脑叶片裁在小脑轮廓里，保证一条都不会戳出去 */
  s += '<g class="folia" clip-path="url(#' + clipCb + ')">' + BRAIN_FOLIA.map(function (d) {
    return '<path d="' + d + '"></path>';
  }).join('') + '</g>';
  s += '<path class="stem-outline" d="' + BRAIN_CEREBELLUM + '"></path>';
  s += '<path class="stem" id="lobe-brainstem" d="' + BRAIN_BRAINSTEM + '"></path>';
  s += '<path class="stem-outline" d="' + BRAIN_BRAINSTEM + '"></path>';

  /* 大脑：底色是一层柔和的体积渐变（左上亮、右下沉），
     脑叶本身不填色，高亮时才上一层蓝 —— 顺序见下面 */
  s += '<defs>' +
         '<clipPath id="' + clip + '"><path d="' + BRAIN_OUTLINE + '"></path></clipPath>' +
         '<clipPath id="' + clipCb + '"><path d="' + BRAIN_CEREBELLUM + '"></path></clipPath>' +
         '<radialGradient id="' + grad + '" cx="34%" cy="26%" r="86%">' +
           '<stop offset="0%" stop-color="#F6F1EA"/>' +
           '<stop offset="58%" stop-color="#EDE5D9"/>' +
           '<stop offset="100%" stop-color="#DCD0BF"/>' +
         '</radialGradient>' +
       '</defs>';
  s += '<path class="hull" d="' + BRAIN_OUTLINE + '" fill="url(#' + grad + ')"></path>';

  s += '<g clip-path="url(#' + clip + ')">';
  /* 脑叶是透明的、只负责接指针（CSS 里给了 pointer-events:all），
     所以高亮时是给整块脑面上一层蓝，而不会盖掉下面的脑回 */
  BRAIN_ORDER.forEach(function (id) {
    s += '<path class="lobe" id="' + id + '" d="' + BRAIN_LOBES[id] + '"></path>';
  });
  /* 脑回画在脑叶之上：这样高亮的蓝色是「透过褶皱透出来的」，
     而不是把褶皱整块盖住 —— 顺序反了就会变成一块塑料贴纸 */
  s += '<g class="gyri">' + BRAIN_GYRI.map(function (d) {
    return '<path d="' + d + '"></path>';
  }).join('') + '</g>';
  /* 三条大沟压在脑回之上，一眼就能认出这是脑 */
  s += '<g class="sulcus">' + BRAIN_SULCI.map(function (d) {
    return '<path d="' + d + '"></path>';
  }).join('') + '</g>';
  s += '</g>';

  /* 轮廓描边压在最上层，避免被脑叶的填色吃掉 */
  s += '<path class="outline" d="' + BRAIN_OUTLINE + '"></path>';

  /* 手区（中央沟后缘的感觉手区；幻肢痛讲的正是这里的重映射） */
  s += '<circle class="spot" cx="344" cy="116" r="24"></circle>';
  s += '<text class="spot-cap" x="344" y="80" text-anchor="middle">手区</text>';

  /* 说明文字 */
  s += '<g class="caps">' + BRAIN_CAPS.map(function (c) {
    return '<g class="cap" data-cap="' + c.id + '">' +
             '<text class="t" x="' + c.x + '" y="' + c.y + '" text-anchor="middle">' + c.t + '</text>' +
             '<text class="s" x="' + c.x + '" y="' + (c.y + 17) + '" text-anchor="middle">' + c.s + '</text>' +
           '</g>';
  }).join('') + '</g>';

  if (o.idle) s = '<g class="drift"><g class="breath">' + s + '</g></g>';

  return '<svg class="brain ' + (o.cls || '') + '" viewBox="0 0 620 450" ' +
         'xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + s + '</svg>';
}

/* 4.2 用的简笔人体：右臂虚线 + 截断线 */
var PHANTOM_FIGURE =
  '<svg viewBox="0 0 240 340" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<circle cx="100" cy="44" r="26"></circle>' +
    '<path d="M100 70 L100 196"></path>' +
    '<path d="M64 100 L136 100"></path>' +
    /* 完好的那条手臂 */
    '<path d="M64 100 L48 156 L46 206"></path>' +
    /* 被截掉的那条：虚线轮廓 */
    '<path class="dash" d="M136 100 L152 150"></path>' +
    '<path class="dash" d="M152 150 L158 200 L156 228"></path>' +
    /* 截断线 + 引出线 + 标注 */
    '<path class="cut" d="M138 148 L166 142"></path>' +
    '<path class="leader" d="M170 140 L182 126"></path>' +
    '<text class="fig-lab" x="186" y="122">截肢</text>' +
    /* 骨盆与双腿 */
    '<path d="M84 196 L116 196"></path>' +
    '<path d="M84 196 L78 266 L76 322"></path>' +
    '<path d="M116 196 L122 266 L124 322"></path>' +
  '</svg>';

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
        '<div class="brain-hint small faint anim fade" style="--d:.8s">拖拽旋转，滚轮缩放</div>'
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
              '先点一个标签，再点你觉得它该在的地方<br>猜错也没关系 —— 我们一起来找' +
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
          '<div id="phFig" class="anim fade" style="--d:.1s">' + PHANTOM_FIGURE + '</div>' +
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

    /* ---- 4.3 平衡觉：让大家站起来一次
       前面连着三幕都是坐着的「听讲」，这里插一个 20 秒的集体动作换换气。
       顺带补上一个前面没提的感官 —— 平衡，而它住的地方就在这张图上。 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg">
          <h2 class="title center anim" style="--d:0s">先站起来，活动一下。</h2>

          <p class="subtitle center anim" style="--d:.4s">
            单脚站立，坚持 10 秒。别扶桌子。
          </p>

          <div id="balNum" class="hero mono c-green anim pop" style="--d:.7s">10</div>

          <p class="body muted center anim fade" style="--d:2.6s;max-width:56vw">
            你刚才靠的是<b class="c-green">平衡觉</b> —— 它也是一种感觉，<br>
            而管它的是小脑。小脑一直画在刚才那张图里，只是没轮到它贴标签。
          </p>
        </div>
      `);

      var num = ctx.q('#balNum');
      var left = 10;
      ctx.every(1000, function () {
        if (left <= 0) return;
        left--;
        num.textContent = left;
        num.animate([{ transform: 'scale(1.2)' }, { transform: 'scale(1)' }],
                    { duration: 200, easing: 'cubic-bezier(.16,1,.3,1)' });
        if (left === 0) num.textContent = '好';
      });
    },

    /* ---- 4.4 过渡 ---- */
    function (ctx) {
      ctx.set(
        '<h2 class="title bold center anim fade" style="--d:.1s">' +
          '如果大脑构建感觉的能力本身不同呢？' +
        '</h2>'
      );
    },

  ],
});
