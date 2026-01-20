"""
펫카스 (petkas.co.kr) 크롤러
난이도: 하 (Bootstrap 카드 구조)
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
    sleep_random,
)

BASE_URL = "https://www.petkas.co.kr"
SHOP_ID = "petkas"
SHOP_NAME = "펫카스"


def crawl_petkas() -> List[Pet]:
    """
    펫카스 사이트 크롤링
    """
    pets = []
    url = f"{BASE_URL}/"
    
    try:
        response = requests.get(url, headers=get_default_headers(), timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "lxml")
        
        # 목록 컨테이너: div.card-deck
        list_container = soup.select_one("div.card-deck")
        if not list_container:
            # 다른 선택자 시도
            list_container = soup.select_one("[class*='card-deck'], [class*='card-group']")
        
        if not list_container:
            return pets
        
        # 개별 아이템: div.card
        items = list_container.select("div.card, [class*='card']")
        
        for i, item in enumerate(items):
            try:
                # 상세 페이지 링크: div.card > a 태그의 href
                link_elem = item.select_one("a")
                if not link_elem:
                    continue
                
                detail_url = make_absolute_url(link_elem.get("href", ""), BASE_URL)
                
                # 이미지 URL: div.card > a > img 태그의 src
                img_elem = item.select_one("img")
                image_url = ""
                if img_elem:
                    image_url = make_absolute_url(img_elem.get("src", ""), BASE_URL)
                
                # 이름: div.card-body > h5.card-title
                title_elem = item.select_one("h5.card-title, .card-title, h5")
                name = clean_text(title_elem.get_text()) if title_elem else f"이름 없음 {i+1}"
                
                # 정보: p.card-text
                text_elem = item.select_one("p.card-text, .card-text")
                description = clean_text(text_elem.get_text()) if text_elem else ""
                
                # 품종 추출 시도
                breed = name.split()[0] if " " in name else "품종 미상"
                
                # 가격 정보 추출 시도
                price = 0
                if description:
                    price = extract_price(description)
                
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
                    description=description,
                    crawledAt=__import__("datetime").datetime.now().isoformat(),
                )
                
                pets.append(pet)
                sleep_random(0.2, 0.5)
                
            except Exception as e:
                print(f"펫카스 아이템 {i} 처리 중 오류: {e}")
                continue
        
    except Exception as e:
        print(f"펫카스 크롤링 오류: {e}")
    
    return pets
