"""
주세여 (zooseyo.com) 크롤러
난이도: 하
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

BASE_URL = "https://www.zooseyo.com"
SHOP_ID = "zooseyo"
SHOP_NAME = "주세여"


def crawl_zooseyo() -> List[Pet]:
    """
    주세여 사이트 크롤링
    """
    pets = []
    url = f"{BASE_URL}/main/main.php"
    
    try:
        response = requests.get(url, headers=get_default_headers(), timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "lxml")
        
        # 목록 컨테이너: ul.ani-list
        list_container = soup.select_one("ul.ani-list")
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
                
                # 이미지 URL: li > a > dl > dt.thumb > img 태그의 src
                img_elem = item.select_one("dt.thumb img")
                image_url = ""
                if img_elem:
                    image_url = make_absolute_url(img_elem.get("src", ""), BASE_URL)
                
                # 품종: li > a > dl > dd > dl > dt
                breed_elem = item.select_one("dd > dl > dt")
                breed = clean_text(breed_elem.get_text()) if breed_elem else "품종 미상"
                
                # 지역/성별 등: li > a > dl > dd > dl > dd span
                info_spans = item.select("dd > dl > dd span")
                location = "지역 미상"
                gender = "수컷"
                age = "나이 미상"
                
                for span in info_spans:
                    text = clean_text(span.get_text())
                    if "지역" in text or "서울" in text or "경기" in text:
                        location = text
                    elif "수컷" in text or "암컷" in text:
                        gender = extract_gender(text)
                    elif "개월" in text or "주" in text or "년" in text:
                        age = extract_age(text)
                
                # 이름은 링크 텍스트나 특정 요소에서
                name = clean_text(link_elem.get_text()) or f"{breed} {i+1}"
                
                # 가격은 상세 페이지에서 가져와야 할 수도 있음 (목록에 없는 경우)
                price = 0
                price_elem = item.select_one(".price, [class*='price']")
                if price_elem:
                    price = extract_price(price_elem.get_text())
                
                pet = Pet(
                    id=f"{SHOP_ID}-{i}",
                    name=name,
                    breed=breed,
                    age=age,
                    gender=gender,
                    price=price,
                    location=location,
                    image=image_url or "/placeholder.jpg",
                    shop=SHOP_NAME,
                    shopUrl=BASE_URL,
                    shopId=SHOP_ID,
                    type="dog",  # 기본값, 상세 페이지에서 확인 필요
                    description=clean_text(item.get_text()),
                    crawledAt=__import__("datetime").datetime.now().isoformat(),
                )
                
                pets.append(pet)
                sleep_random(0.1, 0.3)
                
            except Exception as e:
                print(f"주세여 아이템 {i} 처리 중 오류: {e}")
                continue
        
    except Exception as e:
        print(f"주세여 크롤링 오류: {e}")
    
    return pets
