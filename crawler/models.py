"""
데이터 모델 정의
"""
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class Pet(BaseModel):
    id: str
    name: str
    breed: str
    age: str
    gender: str  # "수컷" | "암컷"
    price: int
    location: str
    image: str
    shop: str
    shopUrl: str
    shopId: str
    type: str  # "dog" | "cat"
    description: str
    vaccinated: bool = False
    registered: bool = False
    crawledAt: str


class CrawlResult(BaseModel):
    success: bool
    shopId: str
    shopName: str
    pets: List[Pet]
    count: int
    error: Optional[str] = None


class CrawlRequest(BaseModel):
    shopId: Optional[str] = None
    force: bool = False


class CrawlResponse(BaseModel):
    success: bool
    results: List[CrawlResult]
    failed: List[dict] = []
    total: int = 0
