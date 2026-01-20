"""
펫아미 (petami.co.kr) 크롤러
난이도: 중 (onclick, 배경 이미지)
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

BASE_URL = "https://petami.co.kr"
SHOP_ID = "petami"
SHOP_NAME = "펫아미"


def crawl_petami() -> List[Pet]:
    """
    펫아미 사이트 크롤링
    """
    pets = []
    url = f"{BASE_URL}/"
    
    try:
        response = requests.get(url, headers=get_default_headers(), timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "lxml")
        
        # 목록 컨테이너: #zboard_list > ul
        list_container = soup.select_one("#zboard_list > ul")
        if not list_container:
            # 다른 선택자 시도
            list_container = soup.select_one("ul.board_list, ul[class*='list']")
        
        if not list_container:
            return pets
        
        # 개별 아이템: li
        items = list_container.select("li")
        
        for i, item in enumerate(items):
            try:
                # 상세 페이지 링크: li 태그의 onclick 속성
                onclick_attr = item.get("onclick", "")
                detail_url = ""
                if onclick_attr:
                    url_path = extract_onclick_url(onclick_attr)
                    detail_url = make_absolute_url(url_path, BASE_URL)
                
                # 이미지 URL: div.zbl_thumb_box 태그의 style 속성
                thumb_elem = item.select_one("div.zbl_thumb_box, .thumb")
                image_url = ""
                if thumb_elem:
                    style_attr = thumb_elem.get("style", "")
                    bg_url = extract_background_image_url(style_attr)
                    image_url = make_absolute_url(bg_url, BASE_URL)
                
                # 정보: .zbl_info_title, .zbl_info_sub, .zbl_info_price
                title_elem = item.select_one(".zbl_info_title, .title")
                name = clean_text(title_elem.get_text()) if title_elem else f"이름 없음 {i+1}"
                
                sub_elem = item.select_one(".zbl_info_sub, .sub")
                breed = clean_text(sub_elem.get_text()) if sub_elem else "품종 미상"
                
                price_elem = item.select_one(".zbl_info_price, .price, [class*='price']")
                price = extract_price(price_elem.get_text()) if price_elem else 0
                
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
                print(f"펫아미 아이템 {i} 처리 중 오류: {e}")
                continue
        
    except Exception as e:
        print(f"펫아미 크롤링 오류: {e}")
    
    return pets
