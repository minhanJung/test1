"""
공통 유틸리티 함수들
"""
import re
import time
from urllib.parse import urljoin, urlparse


def extract_onclick_url(onclick_attr: str) -> str:
    """
    onclick 속성에서 URL 추출
    예: onclick="location.href='view.php?id=123'" -> "view.php?id=123"
    """
    if not onclick_attr:
        return ""
    
    # location.href='...' 패턴 찾기
    pattern = r"location\.href\s*=\s*['\"]([^'\"]+)['\"]"
    match = re.search(pattern, onclick_attr)
    if match:
        return match.group(1)
    
    # window.open('...') 패턴
    pattern = r"window\.open\s*\(\s*['\"]([^'\"]+)['\"]"
    match = re.search(pattern, onclick_attr)
    if match:
        return match.group(1)
    
    return ""


def extract_background_image_url(style_attr: str) -> str:
    """
    style 속성에서 배경 이미지 URL 추출
    예: style="background-image:url('image.jpg')" -> "image.jpg"
    """
    if not style_attr:
        return ""
    
    # background-image:url(...) 패턴 찾기
    patterns = [
        r"background-image\s*:\s*url\s*\(\s*['\"]?([^)'\"]+)['\"]?\s*\)",
        r"background\s*:\s*url\s*\(\s*['\"]?([^)'\"]+)['\"]?\s*\)",
    ]
    
    for pattern in patterns:
        match = re.search(pattern, style_attr, re.IGNORECASE)
        if match:
            return match.group(1)
    
    return ""


def get_image_url(img_element, base_url: str, lazy_attrs: list = None) -> str:
    """
    이미지 URL 추출 (lazy loading 지원)
    lazy_attrs: ["data-src", "data-original", "data-lazy"] 등
    """
    if lazy_attrs is None:
        lazy_attrs = ["data-src", "data-original", "data-lazy", "data-url"]
    
    # Lazy loading 속성 확인
    for attr in lazy_attrs:
        url = img_element.get(attr)
        if url:
            return make_absolute_url(url, base_url)
    
    # 기본 src 속성
    url = img_element.get("src")
    if url:
        return make_absolute_url(url, base_url)
    
    return ""


def make_absolute_url(url: str, base_url: str) -> str:
    """
    상대 URL을 절대 URL로 변환
    """
    if not url:
        return ""
    
    if url.startswith(("http://", "https://")):
        return url
    
    return urljoin(base_url, url)


def extract_price(text: str) -> int:
    """
    텍스트에서 가격 숫자 추출
    """
    if not text:
        return 0
    
    # 숫자만 추출
    numbers = re.sub(r"[^0-9]", "", text)
    return int(numbers) if numbers else 0


def extract_age(text: str) -> str:
    """
    텍스트에서 나이 정보 추출
    """
    if not text:
        return "나이 미상"
    
    # 나이 패턴 찾기 (주, 개월, 년 등)
    pattern = r"(\d+)\s*(주|개월|년|세|일|week|month|year|old|age)"
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        return match.group(0).strip()
    
    return text.strip() or "나이 미상"


def extract_gender(text: str) -> str:
    """
    텍스트에서 성별 추출
    """
    if not text:
        return "수컷"
    
    text_lower = text.lower()
    if any(keyword in text_lower for keyword in ["암컷", "암", "여", "female", "f"]):
        return "암컷"
    
    return "수컷"


def clean_text(text: str) -> str:
    """
    텍스트 정리 (공백 제거, 줄바꿈 정리)
    """
    if not text:
        return ""
    
    # 여러 공백을 하나로, 줄바꿈 정리
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def sleep_random(min_sec: float = 0.5, max_sec: float = 2.0):
    """
    랜덤한 시간 대기 (서버 부담 감소)
    """
    import random
    time.sleep(random.uniform(min_sec, max_sec))


def get_default_headers() -> dict:
    """
    기본 HTTP 헤더 (봇 차단 회피)
    """
    return {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
    }
