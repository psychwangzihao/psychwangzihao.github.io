/* ============================================================
   场景 6：感知的谱  (id: pspectrum · 4 个状态)

   文字规矩同 s01。
   色觉那一屏是**真的模拟**：把色轮的像素按二色视的矩阵重算一遍，
   观众看到的是同一张图被两台不同的机器读出来的两个结果。
   （矩阵是常用近似，在 sRGB 空间里算。够看差多少，不是临床模拟。）
   ============================================================ */
PERCEPTION.css('scene-pspectrum', `
#cvdRow{display:flex;gap:2.4vw;justify-content:center;align-items:flex-start;}
.cvd{display:flex;flex-direction:column;align-items:center;gap:.6vw;}
.cvd canvas{height:32vh;width:auto;display:block;border:1px solid var(--rule);}
.cvd b{font-size:var(--fs-body);font-weight:var(--fw-bold);}
.cvd span{font-size:var(--fs-small);color:var(--text-tertiary);text-align:center;max-width:22vw;}
`);

function hsl2rgb(h, s, l) {
  var c = (1 - Math.abs(2 * l - 1)) * s;
  var x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  var m = l - c / 2, r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function hueWheel(size) {
  var cv = document.createElement('canvas');
  cv.width = cv.height = size;
  var g = cv.getContext('2d');
  var img = g.createImageData(size, size), d = img.data, c = size / 2;
  for (var y = 0; y < size; y++) {
    for (var x = 0; x < size; x++) {
      var dx = (x - c) / c, dy = (y - c) / c;
      var r0 = Math.sqrt(dx * dx + dy * dy), i = (y * size + x) * 4;
      if (r0 > 1) { d[i + 3] = 0; continue; }
      var ang = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
      var rgb = hsl2rgb(ang, 1, 0.5);
      d[i] = rgb[0]; d[i + 1] = rgb[1]; d[i + 2] = rgb[2];
      d[i + 3] = r0 > 0.94 ? Math.round(255 * (1 - (r0 - 0.94) / 0.06)) : 255;
    }
  }
  g.putImageData(img, 0, 0);
  return cv;
}

var CVD = {
  protan: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  deutan: [0.625, 0.375, 0, 0.700, 0.300, 0, 0, 0.300, 0.700]
};

function simulate(canvas, src, key) {
  var m = CVD[key], w = src.width, h = src.height;
  canvas.width = w; canvas.height = h;
  var g = canvas.getContext('2d');
  g.drawImage(src, 0, 0);
  var img = g.getImageData(0, 0, w, h), d = img.data;
  for (var i = 0; i < d.length; i += 4) {
    var r = d[i], gg = d[i + 1], b = d[i + 2];
    d[i]     = m[0] * r + m[1] * gg + m[2] * b;
    d[i + 1] = m[3] * r + m[4] * gg + m[5] * b;
    d[i + 2] = m[6] * r + m[7] * gg + m[8] * b;
  }
  g.putImageData(img, 0, 0);
}

PERCEPTION.scene({
  id: 'pspectrum',
  label: '感知的谱',
  dark: true,
  states: [

    /* ---- 6.0 感知也有谱 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">06 / 感知的谱</div>
          <div class="doc-terms kv" style="width:42vw">
            <div class="anim" style="--d:.12s"><span>缺失</span><i>盲 · 聋</i></div>
            <div class="anim" style="--d:.24s"><span>偏弱</span><i>色盲 · 色弱</i></div>
            <div class="anim" style="--d:.36s"><span>过强</span><i>四色视 · 联觉</i></div>
          </div>
        </div>
      `);
    },

    /* ---- 6.1 色觉：现场看得到 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">06 / 感知的谱</div>
          <div id="cvdRow">
            <!-- ⚠️ 两个 canvas 都要写死 width/height。
                 不写的话默认 300×150，CSS 的 height:32vh;width:auto 会照着 2:1
                 把它拉成一个椭圆 —— 左边那个色轮第一版就是这么歪的。 -->
            <div class="cvd"><canvas id="cvdA" width="420" height="420"></canvas>
              <b>三色视</b></div>
            <div class="cvd"><canvas id="cvdB" width="420" height="420"></canvas>
              <b style="color:var(--mx-yellow)">红绿色盲</b></div>
          </div>
        </div>
      `);
      var src = hueWheel(420);
      MX.paint(ctx.q('#cvdA'), src, 420);
      simulate(ctx.q('#cvdB'), src, 'deutan');
      ctx.steps();
    },

    /* ---- 6.2 过强 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">06 / 感知的谱</div>
          <div class="doc-terms" style="width:52vw">
            <div class="anim" style="--d:.12s">四色视</div>
            <div class="anim" style="--d:.24s">联觉</div>
          </div>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 6.3 可以被练出来 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg mx-grid" style="width:100%;align-items:center">
          <div class="mx-tag anim" style="--d:0s">06 / 感知的谱</div>
          <div class="doc-terms" style="width:52vw">
            <div class="anim" style="--d:.12s">知觉学习</div>
            <div class="anim" style="--d:.24s">品酒师 · 放射科医生</div>
          </div>
        </div>
      `);
      ctx.steps();
    },

  ],
});
