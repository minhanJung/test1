"""
Python 크롤러 메인 서버 (FastAPI)
Next.js에서 HTTP API로 호출 가능
"""
import sys
import os
from pathlib import Path

# crawler 폴더를 Python path에 추가
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import asyncio
from concurrent.futures import ThreadPoolExecutor

from models import CrawlResult, CrawlRequest, CrawlResponse, Pet
from crawlers import (
    crawl_zooseyo,
    crawl_yourpet,
    crawl_meyoupet,
    crawl_meyoupet_gwangju,
    crawl_petworldkorea,
    crawl_petami,
    crawl_adamspet,
    crawl_petkas,
    crawl_petfree,
    crawl_dorothypet,
)

app = FastAPI(title="Pet Crawler API", version="1.0.0")

# CORS 설정 (Next.js에서 호출 가능하도록)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 크롤러 매핑
CRAWLER_MAP = {
    "zooseyo": crawl_zooseyo,
    "yourpet": crawl_yourpet,
    "meyoupet": crawl_meyoupet,
    "meyoupet-gwangju": crawl_meyoupet_gwangju,
    "petworldkorea": crawl_petworldkorea,
    "petami": crawl_petami,
    "adamspet": crawl_adamspet,
    "petkas": crawl_petkas,
    "petfree": crawl_petfree,
    "dorothypet": crawl_dorothypet,
}


def run_crawler(crawler_func, shop_id: str, shop_name: str) -> CrawlResult:
    """
    크롤러 함수 실행 (동기 함수를 스레드에서 실행)
    """
    try:
        pets = crawler_func()
        # pets가 이미 Pet 객체 리스트이므로 그대로 사용
        # 만약 dict 리스트인 경우에만 Pet 객체로 변환
        pet_list = []
        for pet in pets:
            if isinstance(pet, Pet):
                pet_list.append(pet)
            elif isinstance(pet, dict):
                pet_list.append(Pet(**pet))
            else:
                # Pet 모델이 아닌 경우 dict로 변환 시도
                pet_list.append(Pet(**pet.dict() if hasattr(pet, 'dict') else pet))
        
        return CrawlResult(
            success=True,
            shopId=shop_id,
            shopName=shop_name,
            pets=pet_list,
            count=len(pet_list),
        )
    except Exception as e:
        import traceback
        error_msg = f"{str(e)}\n{traceback.format_exc()}"
        return CrawlResult(
            success=False,
            shopId=shop_id,
            shopName=shop_name,
            pets=[],
            count=0,
            error=error_msg,
        )


@app.get("/")
async def root():
    return {"message": "Pet Crawler API", "version": "1.0.0"}


@app.get("/api/crawl")
async def crawl_all():
    """
    모든 사이트 크롤링
    """
    executor = ThreadPoolExecutor(max_workers=5)
    loop = asyncio.get_event_loop()
    
    # 모든 크롤러를 병렬로 실행
    tasks = []
    for shop_id, crawler_func in CRAWLER_MAP.items():
        shop_name = shop_id.replace("-", " ").title()
        task = loop.run_in_executor(executor, run_crawler, crawler_func, shop_id, shop_name)
        tasks.append(task)
    
    results = await asyncio.gather(*tasks)
    
    # 성공/실패 분리
    success_results = [r for r in results if r.success]
    failed_results = [
        {"shopId": r.shopId, "error": r.error} for r in results if not r.success
    ]
    
    total = sum(r.count for r in success_results)
    
    return CrawlResponse(
        success=True,
        results=success_results,
        failed=failed_results,
        total=total,
    )


@app.get("/api/crawl/{shop_id}")
async def crawl_shop(shop_id: str):
    """
    특정 사이트 크롤링
    """
    if shop_id not in CRAWLER_MAP:
        raise HTTPException(status_code=404, detail=f"Shop {shop_id} not found")
    
    crawler_func = CRAWLER_MAP[shop_id]
    shop_name = shop_id.replace("-", " ").title()
    
    executor = ThreadPoolExecutor(max_workers=1)
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(executor, run_crawler, crawler_func, shop_id, shop_name)
    
    if not result.success:
        raise HTTPException(status_code=500, detail=result.error)
    
    return result


@app.post("/api/crawl/{shop_id}")
async def crawl_shop_post(shop_id: str):
    """
    POST로 특정 사이트 크롤링
    """
    return await crawl_shop(shop_id)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
