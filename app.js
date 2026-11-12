/* 하루취미 - 해시 라우팅 정적 사이트 (서버 없이 어떤 호스팅에도 올라감) */
const $app = document.getElementById('app');
const won = n => n.toLocaleString('ko-KR') + '원';
const buyLink = name => 'https://www.coupang.com/np/search?q=' + encodeURIComponent(name.replace(/\(.*?\)/g, '').trim());
const perCost = it => it.uses.reduce((s, u) => s + u[1], 0);
const startCost = it => it.uses.reduce((s, u) => s + MATERIALS[u[0]].price, 0);
const savePct = it => Math.round((1 - perCost(it) / it.buyPrice) * 100);
const itemsUsing = mid => ITEMS.filter(it => it.uses.some(u => u[0] === mid));
const DISCLOSURE = '<p class="disclosure">이 게시물은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</p>';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function card(it) {
  const tag = it.type === 'make' ? '모아서 만들기' : '완성품 뜯어보기';
  return `<a class="card" href="#/item/${it.id}">
    <div class="thumb" style="background:${it.bg}">${artSVG(it)}<span class="badge ${it.type}">${tag}</span></div>
    <div class="card-body">
      <div class="meta">${esc(it.cat)} · ${esc(it.level)} · ${esc(it.time)}</div>
      <h3>${esc(it.title)}</h3>
      <div class="price-line"><span class="strike">사면 ${won(it.buyPrice)}</span><b>만들면 ${won(perCost(it))}</b></div>
    </div></a>`;
}

function grid(list) { return `<div class="grid">${list.map(card).join('')}</div>`; }

function chips(list, active, base) {
  const cats = ['전체', ...new Set(list.map(i => i.cat))];
  return `<div class="chips">${cats.map(c => `<a class="chip ${c === active ? 'on' : ''}" href="#/${base}${c === '전체' ? '' : '?cat=' + encodeURIComponent(c)}">${c}</a>`).join('')}</div>`;
}

const pages = {
  home() {
    const make = ITEMS.filter(i => i.type === 'make'), brk = ITEMS.filter(i => i.type === 'break');
    const avg = Math.round(ITEMS.reduce((s, i) => s + savePct(i), 0) / ITEMS.length);
    return `
    <section class="hero">
      <div class="hero-text">
        <p class="eyebrow">하루 한 가지, 손으로 만드는 취미</p>
        <h1>사면 얼마,<br>만들면 얼마?</h1>
        <p class="lead">흩어진 DIY 재료를 모아 완성품으로 보여주고,<br>예쁜 완성품은 재료로 뜯어서 보여드려요.</p>
        <div class="hero-cta"><a class="btn" href="#/make">모아서 만들기</a><a class="btn ghost" href="#/break">완성품 뜯어보기</a></div>
      </div>
      <div class="hero-flip" aria-hidden="true">
        <div class="flip-col"><div class="flip-label">재료</div>${ITEMS[4].uses.map(u => `<div class="flip-mat">${esc(MATERIALS[u[0]].name)}</div>`).join('')}</div>
        <div class="flip-arrow">⇄</div>
        <div class="flip-col"><div class="flip-label">완성품</div><div class="flip-art" style="background:${ITEMS[4].bg}">${artSVG(ITEMS[4])}</div></div>
      </div>
    </section>
    <section class="stats">
      <div><b>${ITEMS.length}</b><span>작품 레시피</span></div>
      <div><b>${Object.keys(MATERIALS).length}</b><span>재료 사전</span></div>
      <div><b>평균 ${avg}%</b><span>직접 만들면 아끼는 비용</span></div>
    </section>
    <section class="sec">
      <div class="sec-head"><h2>모아서 만들기</h2><a href="#/make">전체 보기</a></div>
      <p class="sec-sub">재료 목록 → 만드는 순서 → 완성품까지 한 페이지에</p>
      ${grid(make)}
    </section>
    <section class="sec">
      <div class="sec-head"><h2>완성품 뜯어보기</h2><a href="#/break">전체 보기</a></div>
      <p class="sec-sub">소품샵에서 본 그 물건, 재료로 나누면 이만큼</p>
      ${grid(brk)}
    </section>
    <section class="sec hub">
      <div class="sec-head"><h2>재료 하나로 여러 개</h2><a href="#/materials">재료 사전</a></div>
      <p class="sec-sub">한 번 산 재료가 다른 작품에도 쓰여요</p>
      <div class="hub-list">${Object.entries(MATERIALS).filter(([id]) => itemsUsing(id).length > 1).map(([id, m]) =>
        `<a class="hub-row" href="#/material/${id}"><span>${esc(m.name)}</span><span class="muted">${itemsUsing(id).map(i => esc(i.title)).join(' · ')}</span></a>`).join('')}</div>
    </section>`;
  },

  make(q) { return listPage('make', '모아서 만들기', '재료를 한곳에 모으고, 완성품까지 보여드려요', q); },
  break(q) { return listPage('break', '완성품 뜯어보기', '예쁜 완성품을 DIY 재료로 나눠드려요', q); },

  item(id) {
    const it = ITEMS.find(i => i.id === id);
    if (!it) return notFound();
    const per = perCost(it), start = startCost(it);
    const related = ITEMS.filter(o => o.id !== it.id && o.uses.some(u => it.uses.some(v => v[0] === u[0])));
    document.title = `${it.title} 재료와 만드는 법 | 하루취미`;
    return `
    ${DISCLOSURE}<nav class="crumb"><a href="#/">홈</a> / <a href="#/${it.type}">${it.type === 'make' ? '모아서 만들기' : '완성품 뜯어보기'}</a> / ${esc(it.title)}</nav>
    <section class="detail">
      <div class="detail-art" style="background:${it.bg}">${artSVG(it)}</div>
      <div class="detail-info">
        <div class="meta">${esc(it.cat)} · 난이도 ${esc(it.level)} · ${esc(it.time)}</div>
        <h1>${esc(it.title)}</h1>
        <p class="lead">${esc(it.sub)}</p>
        <div class="compare">
          <div><span>완성품 사면</span><b class="strike-b">${won(it.buyPrice)}</b></div>
          <div><span>직접 만들면 1개당</span><b class="accent">${won(per)}</b></div>
          <div><span>재료 처음 살 때</span><b>${won(start)}</b></div>
        </div>
        <p class="save">1개당 약 ${savePct(it)}% 아껴요${start > it.buyPrice ? ' · 재료가 남아서 여러 개 만들수록 이득' : ''}</p>
        <button class="btn" id="splitBtn">${it.type === 'break' ? '재료로 뜯어보기' : '재료 한 번에 보기'}</button>
      </div>
    </section>
    <section class="sec" id="mats">
      <h2>재료 분해표</h2>
      <div class="table">
        <div class="tr th"><span>재료</span><span>사용량</span><span>1개당</span><span>구입가</span><span></span></div>
        ${it.uses.map(([mid, cost, amt], i) => { const m = MATERIALS[mid]; return `
        <div class="tr" style="--d:${i * 70}ms">
          <a href="#/material/${mid}" class="mname">${esc(m.name)}</a><span class="muted">${esc(amt)}</span>
          <span>${won(cost)}</span><span class="muted">${won(m.price)}</span>
          <a class="buy" href="${buyLink(m.name)}" target="_blank" rel="nofollow sponsored noopener">구매처</a></div>`; }).join('')}
        <div class="tr total"><span>합계</span><span></span><span>${won(per)}</span><span>${won(start)}</span><span></span></div>
      </div>
      ${it.note ? `<p class="note">${esc(it.note)}</p>` : ''}
    </section>
    <section class="sec">
      <h2>만드는 순서</h2>
      <ol class="steps">${it.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      ${it.pattern ? `<p class="note">자세한 도안은 <a href="#/knit">뜨개 도안</a>에서 볼 수 있어요.</p>` : ''}
    </section>
    ${related.length ? `<section class="sec"><h2>남은 재료로 더 만들기</h2>${grid(related)}</section>` : ''}`;
  },

  materials() {
    const byCat = {};
    Object.entries(MATERIALS).forEach(([id, m]) => (byCat[m.cat] = byCat[m.cat] || []).push([id, m]));
    return `<section class="page-head"><h1>재료 사전</h1><p class="lead">재료를 누르면 그 재료로 만들 수 있는 작품이 모두 나와요</p></section>
    ${Object.entries(byCat).map(([c, list]) => `<section class="sec"><h2 class="h-sm">${esc(c)}</h2><div class="hub-list">
      ${list.map(([id, m]) => `<a class="hub-row" href="#/material/${id}"><span>${esc(m.name)}</span><span class="muted">${won(m.price)} · 작품 ${itemsUsing(id).length}개</span></a>`).join('')}</div></section>`).join('')}`;
  },

  material(id) {
    const m = MATERIALS[id];
    if (!m) return notFound();
    document.title = `${m.name}로 만들 수 있는 것 | 하루취미`;
    return `${DISCLOSURE}<nav class="crumb"><a href="#/">홈</a> / <a href="#/materials">재료 사전</a> / ${esc(m.name)}</nav>
    <section class="page-head"><div class="meta">${esc(m.cat)}</div><h1>${esc(m.name)}</h1>
    <p class="lead">참고가 ${won(m.price)}</p><a class="btn" href="${buyLink(m.name)}" target="_blank" rel="nofollow sponsored noopener">구매처 보기</a></section>
    <section class="sec"><h2>이 재료로 만들 수 있는 것</h2>${grid(itemsUsing(id))}</section>`;
  },

  knit() {
    return `<section class="page-head"><h1>뜨개 도안</h1><p class="lead">코바늘·대바늘 도안과 필요한 실, 바늘을 한 번에</p></section>
    <section class="sec"><div class="hub-list">${PATTERNS.map(p => `
      <${p.item ? `a href="#/item/${p.item}"` : 'div'} class="hub-row pattern"><span>${esc(p.title)} <span class="muted">· ${esc(p.level)}</span></span>
      <span class="pill ${p.state === '공개' ? 'on' : ''}">${esc(p.price)} · ${esc(p.state)}</span></${p.item ? 'a' : 'div'}>`).join('')}</div>
    <p class="note">도안 PDF는 순차 공개 예정이에요.</p></section>`;
  },

  about() {
    return `<section class="page-head"><h1>하루취미 소개</h1>
    <p class="lead">하루취미는 DIY 재료와 완성품을 양쪽에서 보여주는 취미 안내 사이트예요.</p></section>
    <section class="sec prose">
      <h2 class="h-sm">이렇게 봐 주세요</h2>
      <p><b>모아서 만들기</b>는 여러 곳에 흩어진 재료를 한 페이지에 모으고, 만드는 순서와 완성된 모습을 보여줘요.</p>
      <p><b>완성품 뜯어보기</b>는 소품샵에서 파는 예쁜 완성품과 비슷한 작품을 직접 만들려면 어떤 재료가 얼마나 드는지 나눠서 보여줘요.</p>
      <p>가격은 작성 시점의 참고가이며 판매처와 시기에 따라 달라질 수 있어요.</p>
      <h2 class="h-sm">제휴 안내</h2>
      <p>이 게시물은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다. 구매하시는 가격은 똑같아요.</p>
    </section>`;
  }
};

function listPage(type, title, sub, q) {
  const cat = q.get('cat') || '전체';
  const all = ITEMS.filter(i => i.type === type);
  const list = cat === '전체' ? all : all.filter(i => i.cat === cat);
  document.title = `${title} | 하루취미`;
  return `<section class="page-head"><h1>${title}</h1><p class="lead">${sub}</p>${chips(all, cat, type)}</section>${grid(list)}`;
}

function notFound() { return `<section class="page-head"><h1>페이지를 찾을 수 없어요</h1><a class="btn" href="#/">홈으로</a></section>`; }

function route() {
  const [path, qs] = (location.hash.slice(1) || '/').split('?');
  const parts = path.split('/').filter(Boolean);
  const q = new URLSearchParams(qs || '');
  document.title = '하루취미 | 사면 얼마, 만들면 얼마';
  const name = parts[0] || 'home';
  const fn = pages[name];
  $app.innerHTML = fn ? fn(parts[1] ? decodeURIComponent(parts[1]) : q) : notFound();
  document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#/' + (parts[0] || '')));
  window.scrollTo(0, 0);
  const sb = document.getElementById('splitBtn');
  if (sb) sb.onclick = () => { const t = document.getElementById('mats'); t.classList.remove('pop'); void t.offsetWidth; t.classList.add('pop'); t.scrollIntoView({ behavior: 'smooth' }); };
}

window.addEventListener('hashchange', route);
document.getElementById('menuBtn').onclick = () => document.body.classList.toggle('menu-open');
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));
route();



