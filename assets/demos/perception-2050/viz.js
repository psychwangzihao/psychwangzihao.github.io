/* ============================================================
   感知 · 画图工具

   这一场里有几件事不能靠"讲"，只能靠**真的算出来**：
   人占电磁波谱的哪一段、二色视到底丢掉了什么、
   以及一组只差色相和一组只差明度的格子分别会变成什么样。

   都用 canvas 现场画，不依赖外部图片。
   ============================================================ */

var PZ = (function () {

  /* ---------------- 电磁波谱 ----------------
     从伽马到无线电，人只占中间极窄的一段。 */
  function spectrum(w, h, marks) {
    var cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    var g = cv.getContext('2d');

    var grad = g.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#2A2438');
    grad.addColorStop(0.30, '#3A3348');
    grad.addColorStop(0.44, '#4A3A60');
    grad.addColorStop(0.50, '#7A4FBF');
    grad.addColorStop(0.56, '#4A6FE0');
    grad.addColorStop(0.62, '#46A98C');
    grad.addColorStop(0.68, '#C9C24A');
    grad.addColorStop(0.73, '#E08A3C');
    grad.addColorStop(0.77, '#D8503C');
    grad.addColorStop(0.84, '#5A3A46');
    grad.addColorStop(1, '#2E2A34');
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h * 0.42);

    var vis0 = w * 0.50, vis1 = w * 0.77;
    g.strokeStyle = '#1A1A1A';
    g.lineWidth = Math.max(1.5, h * 0.012);
    g.strokeRect(vis0, 0, vis1 - vis0, h * 0.42);

    g.fillStyle = '#6B6B6B';
    g.font = (h * 0.10) + 'px ui-monospace,Menlo,monospace';
    g.textBaseline = 'top';
    g.textAlign = 'left';
    g.fillText('γ 射线', 4, h * 0.46);
    g.textAlign = 'center';
    g.fillText('380 nm', vis0, h * 0.46);
    g.fillText('750 nm', vis1, h * 0.46);
    g.textAlign = 'right';
    g.fillText('无线电', w - 4, h * 0.46);

    (marks || []).forEach(function (m, i) {
      var x = w * m.at;
      var y0 = h * (0.62 + i * 0.12);
      g.strokeStyle = m.color || '#FFCD00';
      g.lineWidth = Math.max(1, h * 0.008);
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, y0 + h * 0.07);
      g.stroke();
      g.fillStyle = m.color || '#FFCD00';
      g.beginPath();
      g.arc(x, y0 + h * 0.075, h * 0.018, 0, Math.PI * 2);
      g.fill();
      g.font = (h * 0.095) + 'px -apple-system,"PingFang SC",sans-serif';
      g.textAlign = x > w * 0.75 ? 'right' : 'left';
      g.textBaseline = 'middle';
      g.fillText(m.who + ' · ' + m.label,
                 x + (x > w * 0.75 ? -h * 0.05 : h * 0.05), y0 + h * 0.075);
    });

    return cv;
  }

  /* ---------------- 色轮 / 色相 / 明度 ---------------- */
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

  /* ---------------- 二色视模拟 ----------------
     常用线性近似，在 sRGB 空间里算。够看出差多少，不是临床模拟。 */
  var CVD = {
    protan: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
    deutan: [0.625, 0.375, 0, 0.700, 0.300, 0, 0, 0.300, 0.700]
  };

  function simulate(canvas, src, key) {
    var m = CVD[key] || CVD.deutan, w = src.width, h = src.height;
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

  /* 两组十二格：一组只差色相、一组只差明度。
     结论不写在屏幕上 —— 观众自己看得出哪一组塌了。 */
  function grid(w, h, fill) {
    var cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    var g = cv.getContext('2d');
    var cols = 4, rows = 3;
    var gap = Math.round(Math.min(w / cols, h / rows) * 0.11);
    var cw = (w - gap * (cols + 1)) / cols;
    var ch = (h - gap * (rows + 1)) / rows;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        g.fillStyle = fill(c, r, cols, rows);
        g.fillRect(Math.round(gap + c * (cw + gap)),
                   Math.round(gap + r * (ch + gap)),
                   Math.round(cw), Math.round(ch));
      }
    }
    return cv;
  }

  function hueGrid(w, h) {
    return grid(w, h, function (c, r, cols, rows) {
      var i = r * cols + c;
      return 'rgb(' + hsl2rgb(i * (360 / (cols * rows)), 0.72, 0.50).join(',') + ')';
    });
  }

  function lumaGrid(w, h) {
    return grid(w, h, function (c, r, cols, rows) {
      var i = r * cols + c;
      var l = 0.14 + (i / (cols * rows - 1)) * 0.72;
      return 'rgb(' + hsl2rgb(38, 0.35, l).join(',') + ')';
    });
  }


  /* 四色视的色轮。
     ⚠️ 四维色觉没法在 RGB 屏幕上还原 —— 这是事实，也是这一节要说的东西。
     这里做的是**形象化的写法**：外圈再叠一层更细的色相带，
     读起来是「多一维」，不是「真的还原了它看到的东西」。
     台上要说清楚这一点。 */
  function tetraWheel(size) {
    var cv = hueWheel(size);
    var g = cv.getContext('2d');
    var c = size / 2;
    var inner = c * 0.86, outer = c * 0.995;
    for (var a = 0; a < 1440; a++) {
      var t0 = a / 1440 * Math.PI * 2, t1 = (a + 1) / 1440 * Math.PI * 2;
      /* 外层用半步偏移的色相 + 更高的明度，和内圈错开 */
      var hue = (a / 1440 * 360 * 2 + 15) % 360;
      var rgb = hsl2rgb(hue, 1, 0.66);
      g.beginPath();
      g.arc(c, c, outer, t0, t1);
      g.arc(c, c, inner, t1, t0, true);
      g.closePath();
      g.fillStyle = 'rgb(' + rgb.join(',') + ')';
      g.fill();
    }
    return cv;
  }

  return {
    spectrum: spectrum,
    hueWheel: hueWheel,
    tetraWheel: tetraWheel,
    simulate: simulate,
    hueGrid: hueGrid,
    lumaGrid: lumaGrid
  };
})();
