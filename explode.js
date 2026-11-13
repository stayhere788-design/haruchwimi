/* 하루취미 - 분해해 보기 (가죽 가방). 조립된 가방이 부품별로 펼쳐지는 인터랙티브 SVG */
(function () {
  var root = document.getElementById('explode');
  if (!root) return;
  var MATS = window.BAG_MATS || {};
  var won = function (n) { return n.toLocaleString('ko-KR') + '원'; };

  var LEATHER = [
    { k: '탄', c: '#c08a55' }, { k: '코냑', c: '#9a5b33' }, { k: '다크브라운', c: '#5b3a26' },
    { k: '블랙', c: '#2d2826' }, { k: '버건디', c: '#6d2334' }, { k: '올리브', c: '#6b6b3c' }, { k: '크림', c: '#e3d2b6' }
  ];
  var THREAD = [{ k: '아이보리', c: '#f3ead8' }, { k: '머스타드', c: '#d9a441' }, { k: '브라운', c: '#5a3a22' }, { k: '블랙', c: '#1f1c1a' }];
  var METAL = [{ k: '골드', c: '#d4ae5c', d: '#a8823a' }, { k: '실버', c: '#cfd3d6', d: '#9aa0a6' }, { k: '앤틱', c: '#9c8467', d: '#6f5c45' }];

  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    var f = function (v) { return Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt))); };
    return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
  }

  // 부품 정의: a = 조립 위치, e = 분해 위치 (x, y, 회전)
  var W = 900, H = 640;
  var panel = function (w, h, rb) { return 'M0,0 H' + w + ' V' + (h - rb) + ' Q' + w + ',' + h + ' ' + (w - rb) + ',' + h + ' H' + rb + ' Q0,' + h + ' 0,' + (h - rb) + ' Z'; };
  var inset = function (w, h, rb, d) { return 'M' + d + ',' + d + ' H' + (w - d) + ' V' + (h - rb) + ' Q' + (w - d) + ',' + (h - d) + ' ' + (w - rb) + ',' + (h - d) + ' H' + rb + ' Q' + d + ',' + (h - d) + ' ' + d + ',' + (h - rb) + ' Z'; };
  var flapP = 'M0,0 H240 V64 C240,126 190,142 120,142 C50,142 0,126 0,64 Z';
  var flapI = 'M8,8 H232 V64 C232,118 186,134 120,134 C54,134 8,118 8,64 Z';

  var PARTS = [
    { id: 'strapA', name: '어깨끈', a: [0, 0, 0], e: [0, 0, 0], kind: 'strapCurve', fade: 'out' },
    { id: 'back', name: '뒷판', size: '22 x 17cm', mat: 'leather', a: [330, 236, 0], e: [70, 70, -4], svg: '<path class="lth dk" d="' + panel(240, 190, 34) + '"/><path class="st" d="' + inset(240, 190, 30, 8) + '"/>' },
    { id: 'gusA', name: '옆·바닥판', kind: 'gussetU', fade: 'out', a: [0, 0, 0], e: [0, 0, 0] },
    { id: 'front', name: '앞판', size: '22 x 16cm', mat: 'leather', a: [334, 252, 0], e: [356, 82, 3], svg: '<path class="lth" d="' + panel(232, 176, 30) + '"/><path class="st" d="' + inset(232, 176, 26, 8) + '"/><rect class="metal" x="104" y="96" width="24" height="16" rx="4"/>' },
    { id: 'flap', name: '뚜껑', size: '22 x 13cm', mat: 'leather', a: [330, 230, 0], e: [626, 76, -3], svg: '<path class="lth lt" d="' + flapP + '"/><path class="st" d="' + flapI + '"/><path class="crease" d="M10,22 H230"/>' },
    { id: 'lock', name: '턴락', size: '잠금장치 1세트', mat: 'turn-lock', a: [436, 352, 0], e: [792, 318, 10], svg: '<rect class="metal" x="0" y="0" width="28" height="22" rx="5"/><rect class="metalD" x="9" y="5" width="10" height="12" rx="3"/>' },
    { id: 'dl', name: 'D링', size: '20mm x 2', mat: 'dring-20', a: [318, 244, -20], e: [622, 320, 0], svg: '<path class="metalS" d="M4,0 V22 M4,0 C20,0 22,22 4,22" fill="none"/>' },
    { id: 'dr', name: '', a: [574, 244, 20], e: [652, 320, 0], svg: '<path class="metalS" d="M4,0 V22 M4,0 C20,0 22,22 4,22" fill="none"/>' },
    { id: 'hookL', name: '개고리', size: '20mm x 2', mat: 'snap-hook', a: [322, 210, -30], e: [704, 312, 0], kind: 'appear', svg: '<path class="metalS" d="M6,0 C14,0 16,10 10,14 V34 C10,40 2,40 2,34 V8" fill="none"/>' },
    { id: 'hookR', name: '', a: [566, 210, 30], e: [734, 312, 0], kind: 'appear', svg: '<path class="metalS" d="M6,0 C14,0 16,10 10,14 V34 C10,40 2,40 2,34 V8" fill="none"/>' },
    { id: 'gusE', name: '옆·바닥판', size: '6 x 56cm (한 장)', mat: 'leather', kind: 'gussetStraight', fade: 'in', a: [330, 420, 0], e: [70, 330, 0], svg: '<rect class="lth dk" x="0" y="0" width="500" height="34" rx="6"/><path class="st" d="M8,8 H492 M8,26 H492"/>' },
    { id: 'strapE', name: '어깨끈', size: '2.5 x 120cm', mat: 'leather', kind: 'strapStraight', fade: 'in', a: [330, 140, 0], e: [70, 548, 0], svg: '<rect class="lth" x="0" y="0" width="720" height="22" rx="4"/><path class="st" d="M10,6 H710 M10,16 H710"/><rect class="metal" x="300" y="2" width="22" height="18" rx="3" fill="none" stroke-width="3"/>' },
    { id: 'thread', name: '왁스 실', size: '약 5m', mat: 'leather-thread', kind: 'appear', a: [450, 330, 0], e: [632, 412, 0], svg: '<ellipse class="spool" cx="22" cy="6" rx="22" ry="6"/><rect class="spool" x="4" y="6" width="36" height="42"/><rect class="thr" x="6" y="10" width="32" height="34"/><path class="thrL" d="M6,16 H38 M6,22 H38 M6,28 H38 M6,34 H38 M6,40 H38"/><ellipse class="spool" cx="22" cy="48" rx="22" ry="6"/>' },
    { id: 'edge', name: '엣지코트', size: '30ml', mat: 'edge-coat', kind: 'appear', a: [450, 330, 0], e: [730, 404, 0], svg: '<rect x="6" y="0" width="20" height="12" rx="2" fill="#2f2a25"/><rect x="0" y="10" width="32" height="50" rx="7" fill="#efe9df" stroke="#d8cfc0"/><rect x="5" y="26" width="22" height="16" rx="2" class="lthFlat"/>' }
  ];

  var svg = root.querySelector('svg');
  var stage = svg.querySelector('#stage');
  var labels = svg.querySelector('#labels');

  // 부품 그리기
  PARTS.forEach(function (p) {
    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'part');
    g.setAttribute('data-id', p.id);
    if (p.kind === 'strapCurve') {
      g.innerHTML = '<path class="strapC" d="M340,250 C340,60 560,60 560,250"/><path class="strapCs" d="M340,250 C340,60 560,60 560,250"/>';
    } else if (p.kind === 'gussetU') {
      g.innerHTML = '<path class="gusU" d="M326,250 V392 Q326,430 362,430 H538 Q574,430 574,392 V250"/>';
    } else {
      g.innerHTML = '<g filter="url(#shadow)">' + p.svg + '</g>';
    }
    p.el = g;
    stage.appendChild(g);
  });
  // 조립 상태에서 위에 보이도록 순서 조정
  ['back', 'gusA', 'front', 'flap', 'lock'].forEach(function (id) { var p = PARTS.find(function (x) { return x.id === id; }); stage.appendChild(p.el); });

  // 라벨
  var LABELS = [
    { for: 'back', x: 70, y: 278 }, { for: 'front', x: 356, y: 282 }, { for: 'flap', x: 626, y: 238 },
    { for: 'gusE', x: 70, y: 386 }, { for: 'strapE', x: 70, y: 594 }, { for: 'lock', x: 784, y: 374, small: 1 },
    { for: 'dl', x: 612, y: 374, small: 1 }, { for: 'hookL', x: 696, y: 374, small: 1 }, { for: 'thread', x: 622, y: 490, small: 1 }, { for: 'edge', x: 720, y: 490, small: 1 }
  ];
  LABELS.forEach(function (l) {
    var p = PARTS.find(function (x) { return x.id === l.for; });
    var t = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    t.innerHTML = '<text x="' + l.x + '" y="' + l.y + '" class="lbl">' + p.name + '</text><text x="' + l.x + '" y="' + (l.y + 16) + '" class="lbl2">' + (p.size || '') + '</text>';
    labels.appendChild(t);
  });

  var ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var cur = 0;

  function render(t) {
    cur = t;
    var k = ease(t);
    PARTS.forEach(function (p) {
      var x = lerp(p.a[0], p.e[0], k), y = lerp(p.a[1], p.e[1], k), r = lerp(p.a[2], p.e[2], k);
      if (p.kind === 'strapCurve' || p.kind === 'gussetU') {
        p.el.setAttribute('opacity', Math.max(0, 1 - k * 2.2));
        return;
      }
      p.el.setAttribute('transform', 'translate(' + x + ',' + y + ') rotate(' + r + ')');
      if (p.fade === 'in') p.el.setAttribute('opacity', Math.min(1, Math.max(0, (k - 0.25) * 2.2)));
      if (p.kind === 'appear') p.el.setAttribute('opacity', Math.min(1, Math.max(0, (k - 0.35) * 2)));
    });
    labels.setAttribute('opacity', Math.max(0, (k - 0.7) / 0.3));
    svg.querySelector('#mat').setAttribute('opacity', 0.15 + 0.85 * k);
    slider.value = Math.round(t * 100);
    btn.textContent = t > 0.5 ? '다시 조립하기' : '분해하기';
    caption.textContent = t > 0.5 ? '부품을 펼쳐 놓은 모습이에요. 이 조각들을 꿰매면 가방 하나가 돼요.' : '완성된 가방이에요. 분해하기를 누르면 부품별로 펼쳐져요.';
  }

  var slider = root.querySelector('#exSlider'), btn = root.querySelector('#exBtn'), caption = root.querySelector('#exCaption');
  slider.addEventListener('input', function () { render(slider.value / 100); });
  var anim;
  btn.addEventListener('click', function () {
    cancelAnimationFrame(anim);
    var from = cur, to = cur > 0.5 ? 0 : 1, t0 = performance.now(), dur = 1400;
    (function step(now) {
      var p = Math.min(1, (now - t0) / dur);
      render(from + (to - from) * p);
      if (p < 1) anim = requestAnimationFrame(step);
    })(t0);
  });

  // 색 조합
  function chips(box, list, key) {
    box.innerHTML = list.map(function (o, i) { return '<button class="swatch' + (i ? '' : ' on') + '" data-i="' + i + '" title="' + o.k + '" style="--c:' + o.c + '"><span></span>' + o.k + '</button>'; }).join('');
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      box.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
      state[key] = list[+b.dataset.i]; paint();
    });
  }
  var state = { leather: LEATHER[0], thread: THREAD[0], metal: METAL[0] };
  function paint() {
    var c = state.leather.c;
    svg.style.setProperty('--lth', c);
    svg.style.setProperty('--lthL', shade(c, 0.12));
    svg.style.setProperty('--lthD', shade(c, -0.18));
    svg.style.setProperty('--lthE', shade(c, -0.42));
    svg.style.setProperty('--thr', state.thread.c);
    svg.style.setProperty('--met', state.metal.c);
    svg.style.setProperty('--metD', state.metal.d);
    root.querySelector('#exCombo').textContent = state.leather.k + ' 가죽 · ' + state.thread.k + ' 실 · ' + state.metal.k + ' 장식';
  }
  chips(root.querySelector('#chipLeather'), LEATHER, 'leather');
  chips(root.querySelector('#chipThread'), THREAD, 'thread');
  chips(root.querySelector('#chipMetal'), METAL, 'metal');
  paint();

  // 재료표
  var rows = [], total = 0;
  Object.keys(MATS).forEach(function (id) { var m = MATS[id]; total += m.price; rows.push('<div class="tr"><span class="mname">' + m.name + '</span><span class="muted">' + m.use + '</span><span>' + won(m.price) + '</span><a class="buy" href="' + m.link + '" target="_blank" rel="nofollow noopener">구매처</a></div>'); });
  var tb = document.getElementById('exTable');
  if (tb) tb.innerHTML = '<div class="tr th"><span>재료</span><span>어디에</span><span>참고가</span><span></span></div>' + rows.join('') + '<div class="tr total"><span>재료 합계</span><span></span><span>' + won(total) + '</span><span></span></div>';
  var tt = document.getElementById('exTotal'); if (tt) tt.textContent = won(total);

  render(0);
  // 화면에 보이면 한 번 자동으로 분해 시연
  if ('IntersectionObserver' in window) {
    var once = false;
    new IntersectionObserver(function (en) { if (!once && en[0].isIntersecting) { once = true; setTimeout(function () { btn.click(); }, 700); } }, { threshold: 0.5 }).observe(svg);
  }
})();
