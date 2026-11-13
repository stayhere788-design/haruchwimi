/* 하루취미 - 뜨개 믹서. 무늬를 섞으면 작품이 어떤 모양이 되는지 캔버스로 그려줌 */
(function () {
  var root = document.getElementById('mixer');
  if (!root) return;
  var cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
  var YARN_PRICE = window.YARN_PRICE || 6000; // 100g 한 볼
  var won = function (n) { return n.toLocaleString('ko-KR') + '원'; };

  var COLORS = [
    { k: '오트밀', c: '#e8dcc6' }, { k: '크림', c: '#f5efe3' }, { k: '머스타드', c: '#d9a441' }, { k: '테라코타', c: '#c46a4a' },
    { k: '더스티 핑크', c: '#e1a9a6' }, { k: '세이지', c: '#9fb19a' }, { k: '포레스트', c: '#3f5a45' }, { k: '데님', c: '#5c7896' },
    { k: '네이비', c: '#2d3a55' }, { k: '라벤더', c: '#b7a8cf' }, { k: '차콜', c: '#45413e' }, { k: '버건디', c: '#7a2a38' }
  ];
  var STITCH = {
    stock: { k: '메리야스뜨기', f: 1.0 }, garter: { k: '가터뜨기', f: 1.15 }, rib: { k: '2x2 고무뜨기', f: 1.2 },
    seed: { k: '멍석뜨기', f: 1.1 }, basket: { k: '바구니뜨기', f: 1.15 }, cable: { k: '꽈배기', f: 1.35 },
    stripe: { k: '줄무늬', f: 1.0, two: 1 }, fair: { k: '페어아일', f: 1.5, two: 1 }, lace: { k: '레이스(구멍무늬)', f: 0.85 }, check: { k: '체크', f: 1.45, two: 1 }
  };
  var ITEMS = {
    scarf: { k: '머플러', w: 20, h: 160, sides: 1, needle: '대바늘 6mm' },
    blanket: { k: '블랭킷', w: 80, h: 100, sides: 1, needle: '대바늘 7mm (줄바늘)' },
    tote: { k: '토트백', w: 34, h: 38, sides: 2, extra: 40, needle: '대바늘 5mm' },
    cushion: { k: '쿠션 커버', w: 45, h: 45, sides: 2, needle: '대바늘 6mm' },
    beanie: { k: '비니', w: 50, h: 22, sides: 1, extra: 15, needle: '대바늘 5mm (줄바늘)' }
  };
  var PRESETS = [
    { k: '코티지 머플러', item: 'scarf', bands: [['rib', 3, 2], ['seed', 0, 2], ['cable', 2, 2], ['seed', 0, 2], ['rib', 3, 2]] },
    { k: '노르딕 비니', item: 'beanie', bands: [['stock', 8, 1], ['fair', 8, 1], ['stock', 8, 1]] },
    { k: '세이지 블랭킷', item: 'blanket', bands: [['basket', 5, 1], ['cable', 1, 1], ['basket', 5, 1]] },
    { k: '테라코타 토트', item: 'tote', bands: [['stripe', 3, 1], ['seed', 1, 3]] },
    { k: '체크 쿠션', item: 'cushion', bands: [['check', 7, 1]] }
  ];

  var state = { item: 'scarf', bands: [] };

  // ---------- 그리기 도구 ----------
  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    var f = function (v) { return Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt))); };
    return 'rgb(' + f(r) + ',' + f(g) + ',' + f(b) + ')';
  }
  var SW = 13, SH = 11; // 코 하나 크기(px)

  function knitV(x, y, col, tilt) {
    tilt = tilt || 0;
    var hi = shade(col, 0.22), lo = shade(col, -0.25);
    for (var s = -1; s <= 1; s += 2) {
      ctx.save();
      ctx.translate(x + s * SW * 0.24 + tilt, y);
      ctx.rotate(s * -0.42 + tilt * 0.03);
      var g = ctx.createLinearGradient(-SW * 0.3, -SH * 0.6, SW * 0.3, SH * 0.6);
      g.addColorStop(0, s < 0 ? hi : col); g.addColorStop(1, lo);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(0, 0, SW * 0.27, SH * 0.78, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }
  function purl(x, y, col) {
    var g = ctx.createLinearGradient(x, y - SH * 0.5, x, y + SH * 0.5);
    g.addColorStop(0, shade(col, 0.18)); g.addColorStop(1, shade(col, -0.3));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(x, y, SW * 0.55, SH * 0.36, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = shade(col, -0.12);
    ctx.beginPath(); ctx.ellipse(x + SW * 0.5, y + SH * 0.15, SW * 0.25, SH * 0.3, 0, 0, Math.PI * 2); ctx.fill();
  }
  function hole(x, y, col) {
    ctx.fillStyle = shade(col, -0.55);
    ctx.beginPath(); ctx.ellipse(x, y, SW * 0.28, SH * 0.32, 0, 0, Math.PI * 2); ctx.fill();
  }

  var FAIR = ['00100100', '01011010', '10111101', '01111110', '01111110', '10111101', '01011010', '00100100', '00000000', '10010010'];

  // 한 칸(코)의 종류: [타입, 색, 기울기]
  function cell(st, c, r, A, B, bandRow) {
    switch (st) {
      case 'stock': return ['k', A];
      case 'garter': return [bandRow % 2 ? 'p' : 'k', A];
      case 'rib': return [c % 4 < 2 ? 'k' : 'p', A];
      case 'seed': return [(c + bandRow) % 2 ? 'p' : 'k', A];
      case 'basket': return [(Math.floor(c / 5) + Math.floor(bandRow / 6)) % 2 ? 'p' : 'k', A];
      case 'stripe': return ['k', Math.floor(bandRow / 4) % 2 ? B : A];
      case 'fair': return ['k', FAIR[bandRow % FAIR.length][c % 8] === '1' ? B : A];
      case 'check': return ['k', (Math.floor(c / 6) + Math.floor(bandRow / 7)) % 2 ? B : A];
      case 'lace': return ((c % 8 === 3 && bandRow % 8 === 1) || (c % 8 === 7 && bandRow % 8 === 5)) ? ['o', A] : ['k', A];
      case 'cable':
        var m = c % 12;
        if (m < 3 || m > 8) return ['p', A];
        var phase = bandRow % 10, tilt = 0;
        if (phase >= 2 && phase <= 5) tilt = (m < 6 ? 1 : -1) * (phase - 1.5) * 1.6;
        if (phase > 5 && phase <= 7) tilt = (m < 6 ? 1 : -1) * (8 - phase) * 1.6;
        return ['k', A, tilt, 1];
    }
    return ['k', A];
  }

  // 원단 그리기: 영역 안을 무늬로 채움
  function fabric(x0, y0, w, h, bands, opt) {
    opt = opt || {};
    var cols = Math.ceil(w / SW) + 1, rows = Math.ceil(h / SH) + 1;
    var total = bands.reduce(function (s, b) { return s + b.size; }, 0);
    var edges = [], acc = 0;
    bands.forEach(function (b) { acc += b.size; edges.push(Math.round(rows * acc / total)); });
    var bi = 0, start = 0;
    for (var r = 0; r < rows; r++) {
      while (bi < bands.length - 1 && r >= edges[bi]) { start = edges[bi]; bi++; }
      var b = opt.brimRows && r >= rows - opt.brimRows ? { st: 'rib', a: bands[bands.length - 1].a, b: bands[bands.length - 1].b } : bands[bi];
      var A = COLORS[b.a].c, B = COLORS[b.b].c;
      ctx.fillStyle = shade(A, -0.42); ctx.fillRect(x0, y0 + r * SH, cols * SW, SH + 1);
      var cableTop = [];
      for (var c = 0; c < cols; c++) {
        var cl = cell(b.st, c, r, A, B, r - start);
        var x = x0 + c * SW + SW / 2, y = y0 + r * SH + SH / 2;
        if (cl[0] === 'k') { if (cl[3]) cableTop.push([x, y, cl[1], cl[2]]); else knitV(x, y, cl[1]); }
        else if (cl[0] === 'p') purl(x, y, cl[1]);
        else { purl(x, y, cl[1]); hole(x, y, cl[1]); }
      }
      cableTop.forEach(function (k) { knitV(k[0], k[1], shade(k[2], 0.05).replace('rgb', 'rgb'), k[3]); });
    }
  }
  // shade() 결과가 rgb() 라서 knitV 안 shade 에 넘길 수 있게 hex 로 변환
  var _shade = shade;
  shade = function (c, amt) {
    if (c.charAt(0) === 'r') { var m = c.match(/\d+/g); c = '#' + ((1 << 24) + (+m[0] << 16) + (+m[1] << 8) + (+m[2])).toString(16).slice(1); }
    return _shade(c, amt);
  };

  // ---------- 장면 ----------
  function background(W, H) {
    var g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#f4efe7'); g.addColorStop(1, '#e9e1d4');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // 리넨 결
    ctx.globalAlpha = 0.05; ctx.strokeStyle = '#8a7a66';
    for (var i = 0; i < H; i += 3) { ctx.beginPath(); ctx.moveTo(0, i + Math.sin(i) * 0.5); ctx.lineTo(W, i); ctx.stroke(); }
    for (var j = 0; j < W; j += 4) { ctx.beginPath(); ctx.moveTo(j, 0); ctx.lineTo(j, H); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  function shadowShape(pathFn, blur, oy) {
    ctx.save(); ctx.shadowColor = 'rgba(60,40,20,.28)'; ctx.shadowBlur = blur; ctx.shadowOffsetY = oy;
    ctx.fillStyle = '#ddd2c2'; pathFn(); ctx.fill(); ctx.restore();
  }
  function lighting(pathFn, x, y, w, h, round) {
    ctx.save(); pathFn(); ctx.clip();
    var g = round ? ctx.createRadialGradient(x + w * 0.35, y + h * 0.3, 10, x + w / 2, y + h / 2, Math.max(w, h) * 0.75)
      : ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, 'rgba(255,250,240,.18)'); g.addColorStop(0.6, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(40,25,10,.22)');
    ctx.fillStyle = g; ctx.fillRect(x - 5, y - 5, w + 10, h + 10); ctx.restore();
  }
  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  function draw() {
    var W = cv.width / dpr, H = cv.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    background(W, H);
    var bands = state.bands, it = state.item, p;
    if (!bands.length) return;
    if (it === 'scarf') {
      var w = Math.min(200, W * 0.3), h = H - 110, x = W / 2 - w / 2, y = 40;
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-0.06); ctx.translate(-W / 2, -H / 2);
      p = function () { rr(x, y, w, h, 6); };
      shadowShape(p, 24, 10);
      ctx.save(); p(); ctx.clip(); fabric(x, y, w, h, bands); ctx.restore();
      lighting(p, x, y, w, h);
      // 술
      [y - 2, y + h - 4].forEach(function (yy, i) {
        for (var f = 0; f < 9; f++) {
          var fx = x + 10 + f * (w - 20) / 8, col = COLORS[(i ? bands[bands.length - 1] : bands[0]).a].c;
          ctx.strokeStyle = shade(col, -0.1); ctx.lineWidth = 5; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(fx, yy + (i ? 4 : 2)); ctx.quadraticCurveTo(fx + 3, yy + (i ? 26 : -22), fx - 2, yy + (i ? 42 : -36)); ctx.stroke();
        }
      });
      ctx.restore();
    } else if (it === 'blanket') {
      var bw = Math.min(W - 120, 460), bh = H - 90, bx = W / 2 - bw / 2, by = 45;
      p = function () { ctx.beginPath(); ctx.moveTo(bx, by + 6); ctx.quadraticCurveTo(bx + bw / 2, by - 6, bx + bw, by + 4); ctx.lineTo(bx + bw - 6, by + bh - 70); ctx.lineTo(bx + bw - 70, by + bh); ctx.quadraticCurveTo(bx + bw / 2, by + bh + 8, bx + 4, by + bh - 4); ctx.closePath(); };
      shadowShape(p, 30, 14);
      ctx.save(); p(); ctx.clip(); fabric(bx, by - 8, bw, bh + 16, bands); ctx.restore();
      // 접힌 모서리
      ctx.save(); ctx.beginPath(); ctx.moveTo(bx + bw - 6, by + bh - 70); ctx.lineTo(bx + bw - 70, by + bh); ctx.lineTo(bx + bw - 66, by + bh - 66); ctx.closePath(); ctx.clip();
      fabric(bx + bw - 80, by + bh - 80, 80, 80, [{ st: 'stock', a: bands[bands.length - 1].a, b: 0, size: 1 }]); ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fillRect(bx + bw - 80, by + bh - 80, 80, 80); ctx.restore();
      lighting(p, bx, by, bw, bh);
    } else if (it === 'tote') {
      var tw = 300, th = 320, tx = W / 2 - tw / 2, ty = H - th - 40;
      var hcol = COLORS[bands[0].a].c;
      [tx + 60, tx + tw - 60].forEach(function (hx, i) {
        ctx.strokeStyle = shade(hcol, -0.15); ctx.lineWidth = 16; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(hx - (i ? -0 : 0), ty + 6); ctx.bezierCurveTo(hx, ty - 150, i ? hx - 180 : hx + 180, ty - 150, i ? hx - 180 : hx + 180, ty + 6); ctx.stroke();
      });
      p = function () { ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx + tw, ty); ctx.lineTo(tx + tw - 10, ty + th - 18); ctx.quadraticCurveTo(tx + tw - 12, ty + th, tx + tw - 30, ty + th); ctx.lineTo(tx + 30, ty + th); ctx.quadraticCurveTo(tx + 12, ty + th, tx + 10, ty + th - 18); ctx.closePath(); };
      shadowShape(p, 26, 12);
      ctx.save(); p(); ctx.clip(); fabric(tx, ty, tw, th, bands); ctx.restore();
      lighting(p, tx, ty, tw, th);
      ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fillRect(tx, ty, tw, 10);
    } else if (it === 'cushion') {
      var s = Math.min(W, H) - 110, cx = W / 2 - s / 2, cy = H / 2 - s / 2;
      p = function () { ctx.beginPath(); ctx.moveTo(cx + 10, cy + 14); ctx.quadraticCurveTo(cx + s / 2, cy + 34, cx + s - 10, cy + 10); ctx.quadraticCurveTo(cx + s - 34, cy + s / 2, cx + s - 12, cy + s - 10); ctx.quadraticCurveTo(cx + s / 2, cy + s - 32, cx + 12, cy + s - 12); ctx.quadraticCurveTo(cx + 34, cy + s / 2, cx + 10, cy + 14); ctx.closePath(); };
      shadowShape(p, 34, 16);
      ctx.save(); p(); ctx.clip(); fabric(cx, cy, s, s, bands); ctx.restore();
      lighting(p, cx, cy, s, s, true);
    } else if (it === 'beanie') {
      var bw2 = 300, bh2 = 300, bx2 = W / 2 - bw2 / 2, by2 = H / 2 - bh2 / 2 + 30;
      p = function () { ctx.beginPath(); ctx.moveTo(bx2, by2 + bh2); ctx.lineTo(bx2 + 6, by2 + 150); ctx.bezierCurveTo(bx2 + 10, by2 + 10, bx2 + bw2 - 10, by2 + 10, bx2 + bw2 - 6, by2 + 150); ctx.lineTo(bx2 + bw2, by2 + bh2); ctx.closePath(); };
      shadowShape(p, 26, 12);
      ctx.save(); p(); ctx.clip(); fabric(bx2, by2, bw2, bh2, bands, { brimRows: 7 }); ctx.restore();
      lighting(p, bx2, by2, bw2, bh2, true);
      // 방울
      var pc = COLORS[bands[0].a].c, px = W / 2, py = by2 + 34;
      for (var i = 0; i < 220; i++) { var a = Math.random() * Math.PI * 2, rr2 = Math.random() * 42; ctx.strokeStyle = shade(pc, (Math.random() - 0.5) * 0.5); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(a) * rr2, py + Math.sin(a) * rr2); ctx.stroke(); }
    }
    // 워터마크
    ctx.fillStyle = 'rgba(80,60,40,.45)'; ctx.font = '600 13px Pretendard, sans-serif'; ctx.fillText('haruchwimi.com · 뜨개 믹서', 16, H - 16);
  }

  // ---------- 실 계산 ----------
  function estimate() {
    var it = ITEMS[state.item], area = it.w * it.h * it.sides + (it.extra || 0) * 10;
    var total = state.bands.reduce(function (s, b) { return s + b.size; }, 0), use = {};
    state.bands.forEach(function (b) {
      var st = STITCH[b.st], part = area * b.size / total, grams = part * 0.065 * st.f;
      if (st.two) { use[b.a] = (use[b.a] || 0) + grams * 0.6; use[b.b] = (use[b.b] || 0) + grams * 0.5; }
      else use[b.a] = (use[b.a] || 0) + grams;
    });
    var balls = 0, html = Object.keys(use).map(function (ci) {
      var g = Math.ceil(use[ci] / 10) * 10, n = Math.ceil(use[ci] / 100); balls += n;
      return '<div class="tr"><span class="mname"><i class="dot" style="background:' + COLORS[ci].c + '"></i>' + COLORS[ci].k + '</span><span class="muted">약 ' + g + 'g</span><span>' + n + '볼</span><span>' + won(n * YARN_PRICE) + '</span></div>';
    }).join('');
    document.getElementById('mxYarn').innerHTML = '<div class="tr th"><span>실 색</span><span>필요량</span><span>100g 볼</span><span>참고가</span></div>' + html +
      '<div class="tr"><span class="mname">' + it.needle + '</span><span class="muted">바늘</span><span>1개</span><span>' + won(5000) + '</span></div>' +
      '<div class="tr total"><span>합계</span><span></span><span>' + balls + '볼</span><span>' + won(balls * YARN_PRICE + 5000) + '</span></div>';
    document.getElementById('mxSummary').textContent = it.k + ' · ' + state.bands.map(function (b) { return STITCH[b.st].k; }).join(' + ');
  }

  // ---------- 컨트롤 ----------
  var bandBox = root.querySelector('#mxBands');
  function colorSelect(v, cls) { return '<select class="' + cls + '">' + COLORS.map(function (c, i) { return '<option value="' + i + '"' + (i == v ? ' selected' : '') + '>' + c.k + '</option>'; }).join('') + '</select>'; }
  function renderBands() {
    bandBox.innerHTML = state.bands.map(function (b, i) {
      return '<div class="band" data-i="' + i + '"><span class="band-no">' + (i + 1) + '</span>' +
        '<select class="st">' + Object.keys(STITCH).map(function (k) { return '<option value="' + k + '"' + (k === b.st ? ' selected' : '') + '>' + STITCH[k].k + '</option>'; }).join('') + '</select>' +
        '<span class="sw" style="background:' + COLORS[b.a].c + '"></span>' + colorSelect(b.a, 'ca') +
        (STITCH[b.st].two ? '<span class="sw" style="background:' + COLORS[b.b].c + '"></span>' + colorSelect(b.b, 'cb') : '') +
        '<label class="sz">길이<input type="range" min="1" max="4" value="' + b.size + '"></label>' +
        (state.bands.length > 1 ? '<button class="x" title="삭제">삭제</button>' : '') + '</div>';
    }).join('');
    root.querySelector('#mxAdd').disabled = state.bands.length >= 6;
    update();
  }
  bandBox.addEventListener('change', function (e) {
    var row = e.target.closest('.band'); if (!row) return; var b = state.bands[+row.dataset.i];
    if (e.target.classList.contains('st')) b.st = e.target.value;
    if (e.target.classList.contains('ca')) b.a = +e.target.value;
    if (e.target.classList.contains('cb')) b.b = +e.target.value;
    renderBands();
  });
  bandBox.addEventListener('input', function (e) { if (e.target.type === 'range') { state.bands[+e.target.closest('.band').dataset.i].size = +e.target.value; update(); } });
  bandBox.addEventListener('click', function (e) { if (e.target.classList.contains('x')) { state.bands.splice(+e.target.closest('.band').dataset.i, 1); renderBands(); } });
  root.querySelector('#mxAdd').addEventListener('click', function () { var last = state.bands[state.bands.length - 1]; state.bands.push({ st: 'seed', a: last ? last.a : 0, b: 2, size: 1 }); renderBands(); });
  root.querySelector('#mxRandom').addEventListener('click', function () {
    var keys = Object.keys(STITCH), n = 2 + Math.floor(Math.random() * 3), base = Math.floor(Math.random() * COLORS.length);
    state.bands = []; for (var i = 0; i < n; i++) state.bands.push({ st: keys[Math.floor(Math.random() * keys.length)], a: Math.random() < 0.6 ? base : Math.floor(Math.random() * COLORS.length), b: Math.floor(Math.random() * COLORS.length), size: 1 + Math.floor(Math.random() * 2) });
    renderBands();
  });
  root.querySelector('#mxSave').addEventListener('click', function () {
    var a = document.createElement('a'); a.download = 'haruchwimi-' + state.item + '.png'; a.href = cv.toDataURL('image/png'); a.click();
  });
  var itemBox = root.querySelector('#mxItems');
  itemBox.innerHTML = Object.keys(ITEMS).map(function (k) { return '<button class="chip" data-k="' + k + '">' + ITEMS[k].k + '</button>'; }).join('');
  itemBox.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; state.item = b.dataset.k; update(); });
  var preBox = root.querySelector('#mxPresets');
  preBox.innerHTML = PRESETS.map(function (p, i) { return '<button class="chip" data-i="' + i + '">' + p.k + '</button>'; }).join('');
  preBox.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; load(PRESETS[+b.dataset.i]); });
  function load(p) { state.item = p.item; state.bands = p.bands.map(function (x) { return { st: x[0], a: x[1], b: x[2], size: 1 }; }); renderBands(); }

  var dpr = Math.min(2, window.devicePixelRatio || 1);
  function resize() { var w = cv.clientWidth, h = Math.round(w * (w < 600 ? 1.15 : 0.78)); cv.width = w * dpr; cv.height = h * dpr; cv.style.height = h + 'px'; draw(); }
  function update() { itemBox.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b.dataset.k === state.item); }); draw(); estimate(); }
  window.addEventListener('resize', function () { clearTimeout(window._mxR); window._mxR = setTimeout(resize, 120); });
  load(PRESETS[0]);
  resize();
})();
