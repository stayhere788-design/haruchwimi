/* 하루취미 데이터
 * - materials: 재료 사전. 한 재료가 여러 작품에 쓰이면 자동으로 연결됨
 * - items: 작품. type 'make' = 모아서 만들기, 'break' = 완성품 뜯어보기
 *   uses: [재료id, 이 작품 1개에 드는 재료비(원), 사용량 메모]
 *   buyPrice: 완성품을 살 때 시세(원). 가격은 모두 참고가(판매처마다 다름)
 * - link: 지금은 쿠팡 검색 링크. 파트너스 가입 후 제휴 링크로 바꾸면 됨
 */
const MATERIALS = {
  'cotton-rope-5': { name: '면 로프 5mm 50m', price: 9900, cat: '실·끈' },
  'wood-dowel-40': { name: '원목 봉 40cm', price: 3500, cat: '목재' },
  'wood-bead-20': { name: '우드 비즈 20mm (10개)', price: 2500, cat: '비즈' },
  'soy-wax': { name: '소이왁스 1kg', price: 13000, cat: '캔들·석고' },
  'amber-jar': { name: '앰버 유리용기 200ml', price: 2500, cat: '용기' },
  'wood-wick': { name: '우드심지 + 심지탭 (10세트)', price: 5000, cat: '캔들·석고' },
  'fragrance-oil': { name: '프래그런스 오일 30ml', price: 8000, cat: '향료' },
  'dried-flower': { name: '드라이플라워 믹스', price: 3000, cat: '꽃·장식' },
  'cotton-yarn': { name: '면사 100g (3볼)', price: 13500, cat: '실·끈' },
  'crochet-hook-5': { name: '코바늘 5mm', price: 3000, cat: '도구' },
  'stitch-marker': { name: '단수링 (20개)', price: 1000, cat: '도구' },
  'rattan-core': { name: '라탄 환심 2mm 250g', price: 8000, cat: '라탄' },
  'wood-base-20': { name: '원목 원형 바닥판 20cm', price: 3500, cat: '목재' },
  'czech-bead': { name: '체코 유리비즈 믹스', price: 3900, cat: '비즈' },
  'pearl-bead': { name: '담수진주 비즈 1줄', price: 4500, cat: '비즈' },
  'heart-charm': { name: '하트 참 (5개)', price: 3000, cat: '비즈' },
  'key-ring': { name: '키링 고리 (10개)', price: 2000, cat: '부자재' },
  'urethane-line': { name: '우레탄줄 + T핀 세트', price: 2500, cat: '부자재' },
  'plaster-powder': { name: '석고가루 1kg', price: 4000, cat: '캔들·석고' },
  'silicone-mold-round': { name: '원형 실리콘 몰드', price: 6000, cat: '몰드' },
  'linen-string': { name: '린넨끈 10m', price: 2000, cat: '실·끈' },
  'epoxy-resin': { name: '에폭시 레진 1:1 500g', price: 18000, cat: '레진' },
  'coaster-mold': { name: '코스터 실리콘 몰드', price: 7000, cat: '몰드' },
  'gold-flake': { name: '압화 + 금박 세트', price: 5000, cat: '꽃·장식' },
  'resin-tools': { name: '계량컵·스틱·장갑 세트', price: 3000, cat: '도구' },
  'dmc-thread': { name: 'DMC 자수실 6색', price: 7800, cat: '실·끈' },
  'hoop-10': { name: '자수틀 10cm', price: 2500, cat: '도구' },
  'linen-fabric': { name: '린넨 원단 (30x30)', price: 3000, cat: '원단' },
  'brooch-pin': { name: '브로치핀 + 펠트 세트', price: 3000, cat: '부자재' },
  'embroidery-needle': { name: '자수바늘 세트', price: 1500, cat: '도구' }
};

const ITEMS = [
  {
    id: 'macrame-wall', type: 'make', cat: '마크라메', title: '마크라메 월행잉',
    sub: '하얀 벽 하나가 카페처럼', level: '쉬움', time: '2시간', buyPrice: 35000, art: 'macrame', bg: '#efe6d8',
    uses: [['cotton-rope-5', 9900, '50m 전부'], ['wood-dowel-40', 3500, '1개'], ['wood-bead-20', 2500, '10개']],
    steps: ['로프를 1.5m씩 16가닥으로 자른다', '원목 봉에 종달새 매듭으로 16가닥을 건다', '평매듭으로 3단, 아래로 갈수록 한 칸씩 줄여 삼각형을 만든다', '중간중간 우드 비즈를 끼운다', '끝을 사선으로 자르고 빗으로 풀어 마무리']
  },
  {
    id: 'soy-candle', type: 'make', cat: '캔들', title: '앰버자 소이캔들',
    sub: '집들이 선물 1순위', level: '쉬움', time: '1시간 + 굳히기 하루', buyPrice: 25000, art: 'candle', bg: '#f1e2cf',
    uses: [['soy-wax', 2600, '200g'], ['amber-jar', 2500, '1개'], ['wood-wick', 500, '1세트'], ['fragrance-oil', 1600, '6ml (향 8%)'], ['dried-flower', 500, '조금']],
    steps: ['용기를 깨끗이 닦고 심지탭을 바닥 중앙에 붙인다', '소이왁스 200g을 중탕으로 녹인다 (약 80도)', '60도 근처에서 프래그런스 오일을 넣고 2분 저어준다', '55도에서 용기에 붓고 드라이플라워를 올린다', '하루 굳힌 뒤 심지를 5mm 남기고 자른다']
  },
  {
    id: 'net-bag', type: 'make', cat: '뜨개', title: '코바늘 네트백',
    sub: '장바구니로도, 여름 가방으로도', level: '보통', time: '6시간', buyPrice: 39000, art: 'netbag', bg: '#e9ecdc',
    uses: [['cotton-yarn', 13500, '3볼'], ['crochet-hook-5', 3000, '1개'], ['stitch-marker', 100, '2개']],
    steps: ['바닥: 원형 시작 후 짧은뜨기로 지름 15cm까지 늘린다', '몸통: 사슬 5코 + 짧은뜨기 반복으로 그물을 30cm 올린다', '입구: 짧은뜨기 4단으로 단단하게 마감', '손잡이: 사슬 60코 양쪽에 걸고 짧은뜨기 3단', '실 끝을 숨기고 스팀으로 모양을 잡는다'],
    pattern: true
  },
  {
    id: 'rattan-tray', type: 'make', cat: '라탄', title: '라탄 원형 트레이',
    sub: '커피 한 잔 올려두기 좋은 크기', level: '보통', time: '3시간', buyPrice: 28000, art: 'rattan', bg: '#efe3cc',
    uses: [['rattan-core', 4000, '125g'], ['wood-base-20', 3500, '1개']],
    steps: ['라탄을 미지근한 물에 10분 불린다', '바닥판 구멍에 세로대(살)를 꽂는다', '두 가닥 엮기로 바닥에서 5cm까지 올린다', '세로대를 옆 살 뒤로 눕혀 테두리를 마감', '하루 말리면 단단해진다']
  },
  {
    id: 'bead-keyring', type: 'break', cat: '비즈', title: '파스텔 비즈 키링',
    sub: '소품샵에서 18,000원, 재료로 뜯어보면?', level: '쉬움', time: '30분', buyPrice: 18000, art: 'keyring', bg: '#f3e1e4',
    uses: [['czech-bead', 1300, '20알'], ['pearl-bead', 900, '6알'], ['heart-charm', 600, '1개'], ['key-ring', 200, '1개'], ['urethane-line', 300, '20cm']],
    steps: ['우레탄줄 20cm를 자르고 한쪽 끝을 매듭', '체코 비즈와 진주를 원하는 순서로 끼운다', '마지막에 하트 참을 넣는다', '키링 고리에 묶고 매듭을 두 번 지어 잘라낸다'],
    note: '같은 재료로 5~6개를 더 만들 수 있어 친구 선물용으로 좋아요.'
  },
  {
    id: 'plaster-aroma', type: 'break', cat: '석고', title: '드라이플라워 석고 방향제',
    sub: '선물 세트 15,000원, 하나에 드는 재료비는?', level: '쉬움', time: '40분 + 건조 하루', buyPrice: 15000, art: 'plaster', bg: '#ece6e0',
    uses: [['plaster-powder', 400, '100g'], ['silicone-mold-round', 0, '재사용'], ['fragrance-oil', 800, '3ml'], ['dried-flower', 500, '조금'], ['linen-string', 100, '30cm']],
    steps: ['석고가루 100g에 물 40ml를 붓고 저어 섞는다', '프래그런스 오일을 넣고 다시 섞는다', '몰드에 붓고 드라이플라워를 살짝 눌러 올린다', '반쯤 굳었을 때 빨대로 끈 구멍을 낸다', '하루 말려 빼낸 뒤 린넨끈을 건다'],
    note: '몰드는 처음 한 번만 사면 계속 써요. 첫 구입 비용과 1개당 재료비가 다른 이유예요.'
  },
  {
    id: 'resin-coaster', type: 'break', cat: '레진', title: '꽃 레진 코스터 2개',
    sub: '2개 세트 32,000원짜리를 직접', level: '보통', time: '1시간 + 경화 이틀', buyPrice: 32000, art: 'resin', bg: '#e1ebea',
    uses: [['epoxy-resin', 4500, '125g'], ['coaster-mold', 0, '재사용'], ['gold-flake', 1000, '조금'], ['dried-flower', 500, '조금'], ['resin-tools', 300, '1회분']],
    steps: ['장갑을 끼고 레진 주제와 경화제를 1:1로 계량', '3분간 천천히 저어 기포를 줄인다', '몰드에 절반 붓고 압화와 금박을 배치', '나머지를 붓고 토치나 드라이기로 기포 제거', '48시간 경화 후 몰드에서 뺀다'],
    note: '레진은 환기 필수, 장갑 필수.'
  },
  {
    id: 'embroidery-brooch', type: 'break', cat: '자수', title: '꽃 자수 브로치',
    sub: '핸드메이드 마켓 22,000원, 재료는 단출해요', level: '보통', time: '3시간', buyPrice: 22000, art: 'embroidery', bg: '#e6e4ef',
    uses: [['dmc-thread', 600, '조금씩'], ['hoop-10', 0, '재사용'], ['linen-fabric', 300, '10x10'], ['brooch-pin', 400, '1세트'], ['embroidery-needle', 0, '재사용']],
    steps: ['린넨에 지름 4cm 원과 꽃 도안을 옮겨 그린다', '자수틀에 끼우고 프렌치노트, 레이지데이지로 꽃을 수놓는다', '원 바깥 1cm를 남기고 오린다', '펠트를 대고 홈질로 오므려 감싼다', '뒷면에 브로치핀을 꿰매 단다']
  }
];

const PATTERNS = [
  { id: 'net-bag', title: '코바늘 네트백 도안', level: '보통', price: '무료', state: '공개', item: 'net-bag' },
  { id: 'coaster', title: '코바늘 꽃 컵받침 도안', level: '쉬움', price: '2,000원', state: '준비중' },
  { id: 'muffler', title: '대바늘 기본 고무뜨기 목도리', level: '쉬움', price: '3,000원', state: '준비중' },
  { id: 'beanie', title: '대바늘 꽈배기 비니', level: '어려움', price: '5,000원', state: '준비중' }
];
