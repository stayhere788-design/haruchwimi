# 하루취미 (haruchwimi.com) 첫 버전

서버 없이 돌아가는 정적 사이트예요. 이 폴더를 그대로 올리면 됩니다.

## 파일
- index.html : 뼈대 (메뉴, 푸터, SEO 문구)
- style.css  : 디자인
- data.js    : 재료 사전(MATERIALS), 작품(ITEMS), 뜨개 도안(PATTERNS)  <- 콘텐츠는 여기만 고치면 됨
- art.js     : 작품 일러스트. 실제 사진이 생기면 ITEMS 항목에 photo: 'img/파일명.jpg' 추가
- app.js     : 화면 전환(홈/모아서 만들기/완성품 뜯어보기/재료 사전/뜨개 도안/상세)
- CNAME      : GitHub Pages로 올릴 때 도메인 연결용

## 작품 추가하는 법 (data.js)
1. MATERIALS 에 새 재료 추가: 'id': { name, price, cat }
2. ITEMS 에 작품 추가: type 'make'(모아서 만들기) 또는 'break'(완성품 뜯어보기)
   uses: [재료id, 1개당 재료비, 사용량 메모]
3. 같은 재료id를 쓰면 재료 사전과 '남은 재료로 더 만들기'에 자동 연결

## 제휴 링크
app.js 의 buyLink 함수가 지금은 쿠팡 검색 링크를 만들어요.
쿠팡 파트너스 승인 후 MATERIALS 에 link: '제휴링크' 를 넣는 방식으로 바꾸면 됩니다.

## 올리는 법 (가비아 도메인 그대로 사용, 무료)
### GitHub Pages
1. GitHub 새 저장소에 이 폴더 파일 업로드 -> Settings > Pages > main 브랜치 배포
2. 가비아 My가비아 > 도메인 > DNS 관리 > haruchwimi.com 레코드 수정
   - A  @  185.199.108.153 / 185.199.109.153 / 185.199.110.153 / 185.199.111.153
   - CNAME  www  <깃허브아이디>.github.io.
   - 기존 A 레코드(172.237.21.13)는 삭제
3. Pages 설정에서 Enforce HTTPS 체크
