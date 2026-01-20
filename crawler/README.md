# Python 크롤러 서버

반려동물 펫샵 사이트 크롤링을 위한 Python 서버입니다.

## 지원 사이트 (10개)

1. **주세여** (zooseyo.com) - 난이도: 하
2. **유어펫** (yourpetkr.com) - 난이도: 중
3. **미유펫** (meyoupet.co.kr) - 난이도: 중
4. **미유펫 광주점** (meyoupet-gwangju.co.kr) - 난이도: 중
5. **펫월드코리아** (m.petworldkorea.com) - 난이도: 상
6. **펫아미** (petami.co.kr) - 난이도: 중
7. **아담스펫** (adamspet.co.kr) - 난이도: 하
8. **펫카스** (petkas.co.kr) - 난이도: 하
9. **PetFree** (jpet.jboard.net) - 난이도: 하
10. **도로시펫** (dorothypet.co.kr) - 난이도: 중

## 설치

1. Python 3.8 이상이 필요합니다.

2. 가상환경 생성 및 활성화 (권장):
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

3. 의존성 설치:
```bash
pip install -r requirements.txt
```

## 실행

### 개발 모드 (자동 재시작)
```bash
cd crawler
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 프로덕션 모드
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

서버가 실행되면 `http://localhost:8000`에서 접근 가능합니다.

## API 문서

서버 실행 후 `http://localhost:8000/docs`에서 Swagger UI를 통해 API를 테스트할 수 있습니다.

## API 엔드포인트

### 1. 모든 사이트 크롤링
```
GET /api/crawl
```

### 2. 특정 사이트 크롤링
```
GET /api/crawl/{shop_id}
POST /api/crawl/{shop_id}
```

**사용 가능한 shop_id:**
- `zooseyo`
- `yourpet`
- `meyoupet`
- `meyoupet-gwangju`
- `petworldkorea`
- `petami`
- `adamspet`
- `petkas`
- `petfree`
- `dorothypet`

## 응답 형식

### 성공 응답
```json
{
  "success": true,
  "shopId": "zooseyo",
  "shopName": "주세여",
  "pets": [
    {
      "id": "zooseyo-0",
      "name": "뽀삐",
      "breed": "골든 리트리버",
      "age": "3개월",
      "gender": "수컷",
      "price": 800000,
      "location": "서울",
      "image": "https://...",
      "shop": "주세여",
      "shopUrl": "https://www.zooseyo.com",
      "shopId": "zooseyo",
      "type": "dog",
      "description": "...",
      "vaccinated": false,
      "registered": false,
      "crawledAt": "2024-01-13T06:50:31.498Z"
    }
  ],
  "count": 10
}
```

### 에러 응답
```json
{
  "success": false,
  "shopId": "zooseyo",
  "shopName": "주세여",
  "pets": [],
  "count": 0,
  "error": "Connection timeout"
}
```

## Next.js와 연동

Next.js 앱에서 이 크롤러를 사용하려면:

1. Python 크롤러 서버를 실행합니다.
2. Next.js API Route (`app/api/crawl/route.ts`)가 자동으로 `http://localhost:8000`으로 요청을 프록시합니다.
3. 환경변수 `CRAWLER_API_URL`을 설정하여 다른 URL을 사용할 수 있습니다.

## 주요 기능

### 1. 공통 유틸리티 함수
- `extract_onclick_url()`: JavaScript onclick 속성에서 URL 추출
- `extract_background_image_url()`: CSS background-image에서 URL 추출
- `get_image_url()`: Lazy loading 이미지 지원 (data-src, data-original 등)
- `extract_price()`: 텍스트에서 가격 추출
- `extract_age()`: 나이 정보 추출
- `extract_gender()`: 성별 추출

### 2. 병렬 처리
- 모든 사이트를 동시에 크롤링 (최대 5개 동시)
- ThreadPoolExecutor를 사용하여 성능 최적화

### 3. 오류 처리
- 개별 사이트 크롤링 실패 시에도 다른 사이트는 계속 진행
- 상세한 에러 메시지 제공

### 4. 예의 바른 크롤링
- 각 요청 사이에 랜덤 지연 (0.2~0.5초)
- 적절한 User-Agent 헤더 설정
- 타임아웃 설정 (15초)

## 문제 해결

### 연결 오류 (ECONNREFUSED)
- Python 크롤러 서버가 실행 중인지 확인
- 포트 8000이 다른 프로그램에 의해 사용 중인지 확인

### 크롤링 실패
- 사이트 구조가 변경되었을 수 있음
- 해당 크롤러 파일 (`crawlers/{shop_id}.py`)에서 선택자를 업데이트 필요
- 네트워크 연결 확인

### 이미지가 로드되지 않음
- Lazy loading 이미지의 경우 `data-src` 또는 `data-original` 속성 확인
- 배경 이미지의 경우 style 속성에서 URL 추출 필요

## 개발 가이드

### 새로운 사이트 크롤러 추가

1. `crawlers/` 폴더에 새 파일 생성 (`{shop_id}.py`)
2. 크롤링 함수 작성:
```python
def crawl_{shop_id}() -> List[Pet]:
    # 크롤링 로직
    return pets
```
3. `crawlers/__init__.py`에 import 추가
4. `main.py`의 `CRAWLER_MAP`에 추가

### 크롤러 테스트

```python
from crawlers.zooseyo import crawl_zooseyo

pets = crawl_zooseyo()
print(f"Found {len(pets)} pets")
for pet in pets:
    print(f"- {pet.name}: {pet.price}원")
```

## 라이선스

MIT
