# 하루취미 (haruchwimi.com)

GitHub Pages로 운영하는 정적 사이트예요. 저장소: https://github.com/stayhere788-design/haruchwimi

## 폴더
- src/      원본 (여기만 수정)
  - data.js   작품(ITEMS) / 재료(MATERIALS) / 뜨개 도안(PATTERNS) / 설정(CONFIG)
  - art.js    작품 일러스트(SVG). 실제 사진이 생기면 작품에 photo: '/img/파일.jpg' 추가
  - style.css 디자인
  - site.js   메뉴, 필터, 검색, 공유 버튼
  - build.js  사이트 생성기
  - og.png    링크 공유 시 보이는 대표 이미지
- site/     업로드용 결과물 (build.js 가 만듦). 이 폴더 안 파일을 GitHub 저장소에 그대로 올리면 반영됨

## 작품 추가
1. data.js 의 MATERIALS 에 새 재료 추가
2. ITEMS 에 작품 추가 (type: 'make' 모아서 만들기 / 'break' 완성품 뜯어보기)
   uses: [재료id, 1개당 재료비, 사용량 메모]
3. art 에 맞는 그림이 없으면 art.js 에 추가하거나 photo 사용
4. node build.js 실행 -> site/ 를 저장소에 업로드

## 쿠팡 파트너스 가입 후
- data.js 의 CONFIG.affiliate 를 true 로 -> 대가성 문구가 작품/재료 페이지 맨 위와 푸터에 표시됨
- 재료마다 link: '파트너스 링크' 를 넣으면 구매처 버튼이 제휴 링크로 바뀜
- 쿠팡 파트너스 '내 정보'에 https://haruchwimi.com 등록

## 주소
- / 홈, /make, /break, /materials, /knit, /search, /about, /privacy
- 작품: /작품id (예: /bead-keyring)
- sitemap.xml, robots.txt 포함 (구글 서치콘솔, 네이버 서치어드바이저에 sitemap 제출)
