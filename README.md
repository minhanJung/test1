# 펫파인더 (PetFinder)

반려동물 펫샵 크롤링 및 검색 플랫폼

## 기술 스택

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Crawler**: Python (FastAPI, BeautifulSoup4, Requests)

## 시작하기

### 1. Next.js 앱 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 2. Python 크롤러 서버 실행

```bash
# Python 크롤러 폴더로 이동
cd crawler

# 가상환경 생성 (선택사항, 권장)
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt

# 크롤러 서버 실행
python -m uvicorn main:app --reload --port 8000
```

크롤러 서버는 `http://localhost:8000`에서 실행됩니다.

### 3. 애플리케이션 사용

1. Next.js 앱: `http://localhost:3000`
2. Python 크롤러 서버: `http://localhost:8000` (필수)

Next.js 앱에서 크롤링 버튼을 클릭하면 Python 크롤러 서버로 요청이 전달됩니다.

## 지원 사이트

현재 10개의 펫샵 사이트를 지원합니다:
- 주세여 (zooseyo.com)
- 유어펫 (yourpetkr.com)
- 미유펫 (meyoupet.co.kr)
- 미유펫 광주점 (meyoupet-gwangju.co.kr)
- 펫월드코리아 (m.petworldkorea.com)
- 펫아미 (petami.co.kr)
- 아담스펫 (adamspet.co.kr)
- 펫카스 (petkas.co.kr)
- PetFree (jpet.jboard.net)
- 도로시펫 (dorothypet.co.kr)

자세한 내용은 [crawler/README.md](crawler/README.md)를 참조하세요.

## 문제 해결

### npm install 오류 (date-fns 버전 충돌)

`package.json`에서 `date-fns` 버전을 명시적으로 지정:
```json
"date-fns": "3.6.0"
```

그 다음:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Python 크롤러 서버 연결 오류

- Python 크롤러 서버가 실행 중인지 확인
- 포트 8000이 사용 가능한지 확인
- 환경변수 `CRAWLER_API_URL` 설정 확인

## 라이선스

MIT
