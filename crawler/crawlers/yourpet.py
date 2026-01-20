"""
유어펫 (yourpetkr.com) 크롤러
난이도: 중 (Lazy Loading 가능성)
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
    get_default_headers,
    get_image_url,
    sleep_random,
)

BASE_URL = "https://yourpetkr.com"
SHOP_ID = "yourpet"
SHOP_NAME = "유어펫"


def crawl_yourpet() -> List[Pet]:
    """
    유어펫 사이트 크롤링
    """
    pets = []
    url = f"{BASE_URL}/"
    
    try:
        response = requests.get(url, headers=get_default_headers(), timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "lxml")
        
        # 목록 컨테이너: div.grid-container
        grid_container = soup.select_one("div.grid-container")
        if not grid_container:
            # 다른 가능한 선택자 시도
            grid_container = soup.select_one("[class*='grid']")
        
        if not grid_container:
            return pets
        
        # 개별 아이템: div.grid-item
        items = grid_container.select("div.grid-item, [class*='grid-item'], [class*='item']")
        
        for i, item in enumerate(items):
            try:
                # 상세 페이지 링크: div.grid-item > a 태그의 href
                link_elem = item.select_one("a")
                if not link_elem:
                    continue
                
                detail_url = make_absolute_url(link_elem.get("href", ""), BASE_URL)
                
                # 이미지 URL: div.grid-item > a > img 태그 (lazy loading 주의)
                img_elem = item.select_one("img")
                image_url = ""
                if img_elem:
                    image_url = get_image_url(img_elem, BASE_URL)
                
                # 이름/품종: p.title
                title_elem = item.select_one("p.title, .title, h3, h4")
                name = clean_text(title_elem.get_text()) if title_elem else f"이름 없음 {i+1}"
                
                # 가격: p.price
                price_elem = item.select_one("p.price, .price, [class*='price']")
                price = extract_price(price_elem.get_text()) if price_elem else 0
                
                # 품종 정보 추출 시도
                breed = name.split()[0] if " " in name else "품종 미상"
                
                pet = Pet(
                    id=f"{SHOP_ID}-{i}",
                    name=name,
                    breed=breed,
                    age="나이 미상",
                    gender="수컷",
                    price=price,
                    location="지역 미상",
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
                print(f"유어펫 아이템 {i} 처리 중 오류: {e}")
                continue
        
    except Exception as e:
        print(f"유어펫 크롤링 오류: {e}")
    
    return pets
