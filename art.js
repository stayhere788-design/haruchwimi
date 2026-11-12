/* 작품 일러스트 (실제 사진이 생기면 ITEMS[].photo 에 이미지 경로를 넣으면 사진이 우선 표시됨) */
const INK = '#4a3f35';
const ART = {
  macrame: () => {
    let s = `<line x1="40" y1="45" x2="160" y2="45" stroke="#a9805a" stroke-width="7" stroke-linecap="round"/>`;
    for (let i = 0; i < 8; i++) {
      const x = 52 + i * 13.7;
      s += `<path d="M${x} 48 Q${x + 3} 90 ${100 + (x - 100) * 0.55} 125 L${100 + (x - 100) * 0.55} 165" stroke="#f7f1e6" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    }
    for (let r = 0; r < 4; r++) for (let i = 0; i < 4 - r; i++) {
      const x = 66 + r * 10 + i * 22, y = 68 + r * 16;
      s += `<ellipse cx="${x + 6}" cy="${y}" rx="8" ry="5" fill="#fffaf0" stroke="#d9cbb3"/>`;
    }
    s += `<circle cx="78" cy="105" r="5" fill="#c49a6c"/><circle cx="122" cy="105" r="5" fill="#c49a6c"/><circle cx="100" cy="132" r="5" fill="#c49a6c"/>`;
    return s;
  },
  candle: () => `
    <rect x="62" y="70" width="76" height="92" rx="12" fill="#b9732f" opacity=".9"/>
    <rect x="62" y="70" width="76" height="20" rx="8" fill="#8c531f"/>
    <rect x="70" y="96" width="60" height="52" rx="6" fill="#f6ead7"/>
    <text x="100" y="126" font-size="11" text-anchor="middle" fill="${INK}" font-family="serif">soy</text>
    <line x1="100" y1="70" x2="100" y2="54" stroke="${INK}" stroke-width="3"/>
    <path d="M100 26 C112 40 110 52 100 54 C90 52 88 40 100 26Z" fill="#f2b84b"/>
    <path d="M100 38 C105 45 104 51 100 52 C96 51 95 45 100 38Z" fill="#fff3c4"/>
    <circle cx="80" cy="74" r="4" fill="#d58ea0"/><circle cx="118" cy="76" r="3" fill="#e9c46a"/>`,
  netbag: () => {
    let s = `<path d="M70 70 Q70 30 100 30 Q130 30 130 70" stroke="#d6c8a4" stroke-width="7" fill="none"/>`;
    s += `<path d="M48 70 H152 L140 165 Q100 178 60 165Z" fill="#f4eedb" stroke="#d6c8a4" stroke-width="3"/>`;
    for (let y = 82; y < 165; y += 14) s += `<path d="M${52 + (y - 70) * 0.12} ${y} H${148 - (y - 70) * 0.12}" stroke="#cdbd92" stroke-width="2"/>`;
    for (let x = 56; x < 150; x += 14) s += `<line x1="${x}" y1="70" x2="${100 + (x - 100) * 0.8}" y2="168" stroke="#cdbd92" stroke-width="2"/>`;
    s += `<ellipse cx="88" cy="128" rx="16" ry="13" fill="#f2d14b"/><ellipse cx="114" cy="138" rx="15" ry="12" fill="#e9c234"/>`;
    return s;
  },
  rattan: () => {
    let s = `<ellipse cx="100" cy="120" rx="78" ry="40" fill="#c99a5b"/><ellipse cx="100" cy="112" rx="70" ry="33" fill="#e7c48d"/>`;
    for (let i = 0; i < 5; i++) s += `<ellipse cx="100" cy="${118 + i * 2}" rx="${76 - i}" ry="${38 - i}" fill="none" stroke="#a87a3f" stroke-width="1.5" opacity=".6"/>`;
    s += `<ellipse cx="100" cy="108" rx="24" ry="9" fill="#fff"/><rect x="78" y="80" width="44" height="28" rx="6" fill="#fff"/><ellipse cx="100" cy="82" rx="22" ry="6" fill="#6b4226"/>`;
    s += `<path d="M122 88 q14 2 0 14" stroke="#fff" stroke-width="5" fill="none"/>`;
    return s;
  },
  keyring: () => {
    let s = `<circle cx="100" cy="40" r="20" fill="none" stroke="#b9b9c2" stroke-width="5"/>`;
    const cols = ['#f6c6d0', '#fff6ea', '#c9e4f2', '#f9e1a8', '#fff6ea', '#d8c9f2', '#f6c6d0', '#fff6ea'];
    cols.forEach((c, i) => { s += `<circle cx="100" cy="${70 + i * 11}" r="${c === '#fff6ea' ? 5.5 : 6.5}" fill="${c}" stroke="#e2d6d8"/>`; });
    s += `<path d="M100 168 C88 158 82 150 88 144 C93 139 99 143 100 147 C101 143 107 139 112 144 C118 150 112 158 100 168Z" fill="#ef8fa5"/>`;
    return s;
  },
  plaster: () => `
    <path d="M100 30 L100 62" stroke="#b8a07c" stroke-width="3"/>
    <path d="M85 30 Q100 18 115 30" stroke="#b8a07c" stroke-width="3" fill="none"/>
    <circle cx="100" cy="112" r="56" fill="#fbf8f3" stroke="#e1d8cc" stroke-width="3"/>
    <circle cx="100" cy="68" r="5" fill="#ece6e0" stroke="#d3c8ba"/>
    <path d="M78 140 Q90 110 102 92" stroke="#7d9a6b" stroke-width="2.5" fill="none"/>
    <circle cx="102" cy="92" r="7" fill="#d58ea0"/><circle cx="90" cy="110" r="6" fill="#e9c46a"/><circle cx="114" cy="118" r="5" fill="#a9b8e0"/>
    <ellipse cx="118" cy="104" rx="8" ry="4" fill="#9db58a" transform="rotate(-30 118 104)"/>`,
  resin: () => `
    <rect x="34" y="70" width="80" height="80" rx="16" fill="#cfe7e6" opacity=".85" stroke="#9fc7c4" stroke-width="2"/>
    <rect x="88" y="52" width="80" height="80" rx="16" fill="#e7f3f2" opacity=".9" stroke="#9fc7c4" stroke-width="2"/>
    <circle cx="70" cy="110" r="9" fill="#d58ea0"/><circle cx="58" cy="96" r="5" fill="#e9c46a"/>
    <circle cx="124" cy="90" r="8" fill="#a9b8e0"/><circle cx="142" cy="106" r="5" fill="#d58ea0"/>
    <rect x="112" y="72" width="6" height="3" fill="#d4af37"/><rect x="134" y="80" width="4" height="4" fill="#d4af37" transform="rotate(30 136 82)"/>
    <rect x="80" y="124" width="5" height="3" fill="#d4af37"/>
    <path d="M100 60 L118 60" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/>`,
  embroidery: () => `
    <circle cx="100" cy="100" r="62" fill="#f7f2e8" stroke="#c4a27a" stroke-width="7"/>
    <rect x="94" y="30" width="12" height="14" rx="3" fill="#a9805a"/>
    <path d="M100 150 Q98 125 100 100" stroke="#7d9a6b" stroke-width="2.5" fill="none"/>
    <path d="M100 130 Q84 124 80 112" stroke="#7d9a6b" stroke-width="2" fill="none"/>
    <path d="M100 120 Q116 116 120 104" stroke="#7d9a6b" stroke-width="2" fill="none"/>
    ${[[100, 92, '#d58ea0'], [80, 106, '#e9c46a'], [120, 98, '#a9b8e0'], [88, 84, '#f2b0a1'], [114, 82, '#e9c46a']].map(([x, y, c]) =>
      [0, 72, 144, 216, 288].map(a => `<ellipse cx="${x + Math.cos(a * Math.PI / 180) * 5}" cy="${y + Math.sin(a * Math.PI / 180) * 5}" rx="4" ry="3" fill="${c}" transform="rotate(${a} ${x + Math.cos(a * Math.PI / 180) * 5} ${y + Math.sin(a * Math.PI / 180) * 5})"/>`).join('') + `<circle cx="${x}" cy="${y}" r="2.2" fill="#fff6d0"/>`).join('')}`
};

function artSVG(item) {
  if (item.photo) return `<img src="${item.photo}" alt="${item.title}" loading="lazy">`;
  const f = ART[item.art];
  return `<svg viewBox="0 0 200 200" role="img" aria-label="${item.title}">${f ? f() : ''}</svg>`;
}
