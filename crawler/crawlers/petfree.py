"""
PetFree (jpet.jboard.net) 크롤러
난이도: 하 (제로보드 게시판)
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

BASE_URL = "https://jpet.jboard.net"
SHOP_ID = "petfree"
SHOP_NAME = "PetFree"


def crawl_petfree() -> List[Pet]:
    """
    PetFree 사이트 크롤링
    """
    pets = []
    url = f"{BASE_URL}/petfree/pet.php"
    
    try:
        response = requests.get(url, headers=get_default_headers(), timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "lxml")
        
        # 목록 컨테이너: ul#gallery_list_body
        list_container = soup.select_one("ul#gallery_list_body")
        if not list_container:
            return pets
        
        # 개별 아이템: li
        items = list_container.select("li")
        
        for i, item in enumerate(items):
            try:
                # 상세 페이지 링크: div.thumb > a 태그의 href
                link_elem = item.select_one("div.thumb a, .thumb a")
                if not link_elem:
                    continue
                
                detail_url = make_absolute_url(link_elem.get("href", ""), BASE_URL)
                
                # 이미지 URL: div.thumb > a > img 태그의 src
                img_elem = item.select_one("div.thumb img, .thumb img")
                image_url = ""
                if img_elem:
                    image_url = make_absolute_url(img_elem.get("src", ""), BASE_URL)
                
                # 이름: div.subject
                subject_elem = item.select_one("div.subject, .subject")
                name = clean_text(subject_elem.get_text()) if subject_elem else f"이름 없음 {i+1}"
                
                # 품종 추출 시도
                breed = name.split()[0] if " " in name else "품종 미상"
                
                # 가격 정보 추출 시도
                price = 0
                price_elem = item.select_one(".price, [class*='price']")
                if price_elem:
                    price = extract_price(price_elem.get_text())
                
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
                print(f"PetFree 아이템 {i} 처리 중 오류: {e}")
                continue
        
    except Exception as e:
        print(f"PetFree 크롤링 오류: {e}")
    
    return pets
