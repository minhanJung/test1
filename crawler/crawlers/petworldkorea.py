"""
펫월드코리아 (m.petworldkorea.com) 크롤러
난이도: 상 (JavaScript 링크, 배경 이미지)
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
    extract_onclick_url,
    get_default_headers,
    sleep_random,
)

BASE_URL = "https://m.petworldkorea.com"
SHOP_ID = "petworldkorea"
SHOP_NAME = "펫월드코리아"


def crawl_petworldkorea() -> List[Pet]:
    """
    펫월드코리아 사이트 크롤링
    """
    pets = []
    url = f"{BASE_URL}/"
    
    try:
        response = requests.get(url, headers=get_default_headers(), timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "lxml")
        
        # 목록 컨테이너: ul.board_list
        list_container = soup.select_one("ul.board_list")
        if not list_container:
            return pets
        
        # 개별 아이템: li
        items = list_container.select("li")
        
        for i, item in enumerate(items):
            try:
                # 상세 페이지 링크: li 태그의 onclick 속성 (location.href='...')
                onclick_attr = item.get("onclick", "")
                detail_url = ""
                if onclick_attr:
                    url_path = extract_onclick_url(onclick_attr)
                    detail_url = make_absolute_url(url_path, BASE_URL)
                
                # a 태그의 href도 확인
                if not detail_url:
                    link_elem = item.select_one("a")
                    if link_elem:
                        detail_url = make_absolute_url(link_elem.get("href", ""), BASE_URL)
                
                # 이미지 URL: li > a > div.thum 태그의 style 속성 (background:url(...))
                thum_elem = item.select_one("div.thum, .thum")
                image_url = ""
                if thum_elem:
                    style_attr = thum_elem.get("style", "")
                    bg_url = extract_background_image_url(style_attr)
                    image_url = make_absolute_url(bg_url, BASE_URL)
                
                # 품종/이름: div.subject
                subject_elem = item.select_one("div.subject, .subject")
                name = clean_text(subject_elem.get_text()) if subject_elem else f"이름 없음 {i+1}"
                
                # 가격: div.price
                price_elem = item.select_one("div.price, .price")
                price = extract_price(price_elem.get_text()) if price_elem else 0
                
                # 품종 추출 시도
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
                print(f"펫월드코리아 아이템 {i} 처리 중 오류: {e}")
                continue
        
    except Exception as e:
        print(f"펫월드코리아 크롤링 오류: {e}")
    
    return pets
