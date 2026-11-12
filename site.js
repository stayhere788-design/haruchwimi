(function () {
  // 예전 주소(#/item/xxx) 로 들어온 경우 새 주소로 보내기
  var h = location.hash;
  if (h.indexOf('#/') === 0) {
    var p = h.slice(2).split('?')[0].split('/');
    var to = p[0] === 'item' || p[0] === 'material' ? (p[0] === 'item' ? '/' + p[1] : '/materials#' + p[1]) : '/' + (p[0] || '');
    location.replace(to);
    return;
  }

  // 모바일 메뉴
  var mb = document.getElementById('menuBtn');
  if (mb) mb.addEventListener('click', function () {
    var open = document.body.classList.toggle('menu-open');
    mb.setAttribute('aria-expanded', open);
  });

  // 목록 필터 (카테고리 + 난이도)
  var catBox = document.querySelector('[data-filter]'), lvBox = document.querySelector('[data-level-filter]');
  if (catBox) {
    var cat = '전체', lv = '전체 난이도';
    var apply = function () {
      var shown = 0;
      document.querySelectorAll('.grid .card').forEach(function (c) {
        var ok = (cat === '전체' || c.dataset.cat === cat) && (lv === '전체 난이도' || c.dataset.level === lv);
        c.hidden = !ok; if (ok) shown++;
      });
      var e = document.querySelector('.empty'); if (e) e.hidden = shown > 0;
    };
    var bind = function (box, attr, set) {
      box.addEventListener('click', function (ev) {
        var b = ev.target.closest('button'); if (!b) return;
        box.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
        set(b.dataset[attr]); apply();
      });
    };
    bind(catBox, 'cat', function (v) { cat = v; });
    if (lvBox) bind(lvBox, 'level', function (v) { lv = v; });
    var qc = new URLSearchParams(location.search).get('cat');
    if (qc) { var t = catBox.querySelector('[data-cat="' + qc + '"]'); if (t) t.click(); }
  }

  // 재료 분해 애니메이션
  var sb = document.querySelector('[data-split]');
  if (sb) sb.addEventListener('click', function (e) {
    e.preventDefault();
    var t = document.getElementById('mats');
    t.classList.remove('pop'); void t.offsetWidth; t.classList.add('pop');
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // 공유
  var sh = document.querySelector('[data-share]');
  if (sh) sh.addEventListener('click', function () {
    var data = { title: document.title, url: location.href.split('#')[0] };
    if (navigator.share) navigator.share(data).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(function () { sh.textContent = '주소 복사됨'; setTimeout(function () { sh.textContent = '공유하기'; }, 1600); });
  });

  // 검색
  var res = document.getElementById('results');
  if (res && window.SEARCH_INDEX) {
    var tpl = document.getElementById('cards').content;
    var cards = {};
    tpl.querySelectorAll('.card').forEach(function (c) { cards[c.getAttribute('href').slice(1)] = c; });
    var input = document.getElementById('q'), info = document.getElementById('searchInfo');
    var run = function (q) {
      q = (q || '').trim().toLowerCase();
      res.innerHTML = '';
      var words = q.split(/\s+/).filter(Boolean);
      var hits = window.SEARCH_INDEX.filter(function (r) {
        var hay = (r.t + ' ' + r.c + ' ' + r.ty + ' ' + r.l + ' ' + r.s + ' ' + r.m).toLowerCase();
        return words.every(function (w) { return hay.indexOf(w) > -1; });
      });
      hits.forEach(function (r) { res.appendChild(cards[r.id].cloneNode(true)); });
      info.textContent = q ? '"' + q + '" 검색 결과 ' + hits.length + '개' : '전체 ' + hits.length + '개 작품';
    };
    var q0 = new URLSearchParams(location.search).get('q') || '';
    input.value = q0; run(q0);
    input.addEventListener('input', function () { run(input.value); history.replaceState(null, '', '/search' + (input.value ? '?q=' + encodeURIComponent(input.value) : '')); });
    input.form.addEventListener('submit', function (e) { e.preventDefault(); run(input.value); });
  }
})();
