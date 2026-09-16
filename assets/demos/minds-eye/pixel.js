/* ============================================================
   心的眼睛 · 像素工具

   整场演示的核心动作只有一件事：**把一张图用不够多的方块重画一遍**。
   观众仍然认得出它 —— 补上其余部分的是他们自己。
   这就是这场分享要讲的东西，所以它不该只是一个比喻，
   而应该是观众亲眼看见发生的事情。

   做法就是两步，没有依赖：
     ① 把原图画进一张很小的离屏画布（缩小，要开平滑，否则会丢细节）
     ② 再把它放大画回大画布（放大，**必须关掉 imageSmoothingEnabled** ——
        开着就是「模糊」，关掉才是「像素」）
   ============================================================ */

var MX = (function () {

  /* 把 source 用 blocks 个横向方块重画到 canvas 上。
     source 可以是 <img>、<canvas>、<svg>，或 canvas 本身。
     smoothDown：缩小时是否平滑。图很小时关掉可以保留更硬的块。 */
  function paint(canvas, source, blocks, smoothDown) {
    var sw = source.naturalWidth || source.width;
    var sh = source.naturalHeight || source.height;
    if (!sw || !sh) return;

    var aspect = sh / sw;
    var bw = Math.max(2, Math.round(blocks));
    var bh = Math.max(2, Math.round(blocks * aspect));

    var off = document.createElement('canvas');
    off.width = bw; off.height = bh;
    var o = off.getContext('2d');
    o.imageSmoothingEnabled = smoothDown !== false;
    try { o.drawImage(source, 0, 0, bw, bh); } catch (e) { return; }

    var c = canvas.getContext('2d');
    /* 只在**放大**方块时关掉平滑（那才是「像素」）；
       方块数超过画布宽度时其实是在缩小，这时得开平滑，否则会锯齿。
       解析动画的最后一帧方块数等于画布宽度，正好落在这条线之后，收在清晰上。 */
    c.imageSmoothingEnabled = (bw >= canvas.width);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(off, 0, 0, bw, bh, 0, 0, canvas.width, canvas.height);
  }

  /* 从 from 块解析到 to 块，历时 ms。用 rAF 推进，
     返回一个取消函数（切场景时调用，避免残留的动画帧）。 */
  function resolve(canvas, source, from, to, ms, onDone) {
    var t0 = performance.now();
    var alive = true;
    /* 方块数按指数增长 —— 线性增长的话前半程几乎看不出变化 */
    var ease = function (t) { return 1 - Math.pow(1 - t, 3); };

    function step(now) {
      if (!alive) return;
      var t = Math.min(1, (now - t0) / ms);
      var blocks = from * Math.pow(to / from, ease(t));
      paint(canvas, source, blocks);
      if (t < 1) requestAnimationFrame(step);
      else if (onDone) onDone();
    }
    requestAnimationFrame(step);
    return function () { alive = false; };
  }

  /* 载入图片。离线可用 —— 路径就是本地的 media/ 文件。 */
  function load(src, onReady) {
    var img = new Image();
    img.onload = function () { onReady(img); };
    img.src = src;
    return img;
  }

  /* 画一个 Kanizsa 三角（「不存在的三角形」）。
     三个圆盘，每个切掉朝向另外两个圆盘的 60° 扇形。
     关键在几何：**切口的直边正好落在三角形三条边上** ——
     所以相邻两个圆盘的切口边缘是共线的，大脑就把中间连成了一条边。
     中间那块三角形，四条边一条都没画。 */
  function kanizsa(w, h) {
    var cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    var g = cv.getContext('2d');
    g.fillStyle = '#0B0B0C';
    g.fillRect(0, 0, w, h);

    var R = Math.min(w, h) * 0.175;              /* 圆盘半径 */
    var L = R * 2.35;                            /* 等边三角形边长 */
    var hh = L * Math.sqrt(3) / 2;
    var cx = w / 2, cy = h / 2;
    var tri = [                                  /* 尖朝上的等边三角形 */
      { x: cx,           y: cy - hh * 2 / 3 },
      { x: cx - L / 2,   y: cy + hh / 3 },
      { x: cx + L / 2,   y: cy + hh / 3 }
    ];
    var colors = ['#FFCD00', '#78B4FA', '#FFE6BE'];

    /* 切口直接**以「指向重心」为中心**开 60°，而不是去判断两个方向谁减谁 ——
       等边三角形的顶角正好 60°，所以切口的直边就落在指向另外两个顶点的方向上，
       和三角形的两条边严格共线。相邻两个圆盘的切口边缘因此连成一条直线，
       中间那块三角形才会"出现"。之前用角度差的正负来判断方向，下面两个圆盘切反了。 */
    tri.forEach(function (P, i) {
      var toC = Math.atan2(cy - P.y, cx - P.x);
      var half = Math.PI / 6;                      /* 60° 的一半 */

      g.save();
      g.beginPath();
      g.arc(P.x, P.y, R, 0, Math.PI * 2);          /* 整圆 */
      g.moveTo(P.x, P.y);                          /* 再叠一个扇形 */
      /* 半径必须**正好等于圆盘半径**。开成 2R 的话，扇形落在圆盘外面的那一块
         只会被穿过一次，even-odd 会把它**填上**——整个三角形区域就被糊住了。
         （这个 bug 眼睛看不出来，是逐点采样才抓到的：重心本该是背景色，却是奶油色。）
         取 R*0.999 是为了避开两条圆弧完全重合时的接缝。 */
      g.arc(P.x, P.y, R * 0.999, toC - half, toC + half);
      g.closePath();
      g.fillStyle = colors[i];
      g.fill('evenodd');                           /* 叠到的地方被挖掉 */
      g.restore();
    });
    return cv;
  }

  return { paint: paint, resolve: resolve, load: load, kanizsa: kanizsa };
})();
