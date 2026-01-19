import axios from "axios"
import { load } from "cheerio"
import { PetShop } from "@/lib/pet-shops"
import { Pet, CrawlResult } from "@/lib/pet-types"
import { crawlBabymong } from "./babymong"
import { crawlPetJ } from "./petj"
import { crawlGeneric } from "./generic"

export async function crawlPetShop(shop: PetShop): Promise<CrawlResult> {
  try {
    // 각 샵별 전용 크롤러가 있으면 사용, 없으면 제네릭 크롤러 사용
    let pets: Pet[] = []

    switch (shop.id) {
      case "babymong":
        pets = await crawlBabymong(shop)
        break
      case "petj":
        pets = await crawlPetJ(shop)
        break
      default:
        // 제네릭 크롤러 (기본 시도)
        pets = await crawlGeneric(shop)
    }

    return {
      success: true,
      shopId: shop.id,
      shopName: shop.name,
      pets,
      count: pets.length,
    }
  } catch (error: any) {
    return {
      success: false,
      shopId: shop.id,
      shopName: shop.name,
      pets: [],
      error: error.message || "Crawl failed",
      count: 0,
    }
  }
}

// 공통 헬퍼 함수
export async function fetchHTML(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      timeout: 15000,
      maxRedirects: 5,
    })
    return response.data
  } catch (error: any) {
    throw new Error(`Failed to fetch ${url}: ${error.message}`)
  }
}

export function extractPrice(text: string): number {
  // 가격 추출 (숫자만 추출)
  const match = text.replace(/[^0-9]/g, "")
  return match ? parseInt(match) : 0
}

export function extractAge(text: string): string {
  // 나이 추출 (주, 개월, 년 등)
  const ageMatch = text.match(/(\d+)\s*(주|개월|년|세|일)/)
  return ageMatch ? ageMatch[0] : text.trim()
}
