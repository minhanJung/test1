"""
미유펫 광주점 (meyoupet-gwangju.co.kr) 크롤러
난이도: 중 (미유펫과 동일한 구조)
"""
import sys
from pathlib import Path

# 상위 디렉토리를 path에 추가
current_dir = Path(__file__).parent
parent_dir = current_dir.parent
sys.path.insert(0, str(parent_dir))

import requests
from bs4 import BeautifulSoup
from typing import List
from models import Pet
from utils import (
    make_absolute_url,
    extract_price,
    extract_age,
    extract_gender,
    clean_text,
    extract_background_image_url,
    get_default_headers,
    sleep_random,
)

BASE_URL = "https://meyoupet-gwangju.co.kr"
SHOP_ID = "meyoupet-gwangju"
SHOP_NAME = "미유펫 광주점"


def crawl_meyoupet_gwangju() -> List[Pet]:
    """
    미유펫 광주점 사이트 크롤링
    미유펫과 동일한 구조이므로 거의 같은 코드 사용
    """
    pets = []
    url = f"{BASE_URL}/"
    
    try:
        response = requests.get(url, headers=get_default_headers(), timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "lxml")
        
        # 목록 컨테이너: ul.list-gallery
        list_container = soup.select_one("ul.list-gallery")
        if not list_container:
            return pets
        
        # 개별 아이템: li
        items = list_container.select("li")
        
        for i, item in enumerate(items):
            try:
                # 상세 페이지 링크: li > a 태그의 href
                link_elem = item.select_one("a")
                if not link_elem:
                    continue
                
                detail_url = make_absolute_url(link_elem.get("href", ""), BASE_URL)
                
                # 이미지 URL: li > a > div.thumb 태그의 style 속성
                thumb_elem = item.select_one("div.thumb, .thumb")
                image_url = ""
                if thumb_elem:
                    style_attr = thumb_elem.get("style", "")
                    bg_url = extract_background_image_url(style_attr)
                    image_url = make_absolute_url(bg_url, BASE_URL)
                
                # 이름: p.name
                name_elem = item.select_one("p.name, .name")
                name = clean_text(name_elem.get_text()) if name_elem else f"이름 없음 {i+1}"
                
                # 품종: p.product
                product_elem = item.select_one("p.product, .product")
                breed = clean_text(product_elem.get_text()) if product_elem else "품종 미상"
                
                # 가격 정보 추출 시도
                price_elem = item.select_one(".price, [class*='price']")
                price = extract_price(price_elem.get_text()) if price_elem else 0
                
                pet = Pet(
                    id=f"{SHOP_ID}-{i}",
                    name=name,
                    breed=breed,
                    age="나이 미상",
                    gender="수컷",
                    price=price,
                    location="광주",
                    image=image_url or "/placeholder.jpg",
                    shop=SHOP_NAME,
                    shopUrl=BASE_URL,
                    shopId=SHOP_ID,
                    type="dog",
                    description=clean_text(item.get_text()),
                    crawledAt=__import__("datetime").datetime.now().isoformat(),
                )
                
                pets.append(pet)
                sleep_random(0.2, 0.5)
                
            except Exception as e:
                print(f"미유펫 광주점 아이템 {i} 처리 중 오류: {e}")
                continue
        
    except Exception as e:
        print(f"미유펫 광주점 크롤링 오류: {e}")
    
    return pets
