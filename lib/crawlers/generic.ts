// 제네릭 크롤러 - 일반적인 HTML 구조를 파싱
import { PetShop } from "@/lib/pet-shops"
import { Pet } from "@/lib/pet-types"
import { fetchHTML, extractPrice, extractAge } from "./crawler"
import { load } from "cheerio"

export async function crawlGeneric(shop: PetShop): Promise<Pet[]> {
  try {
    const html = await fetchHTML(shop.url)
    const $ = load(html)
    const pets: Pet[] = []

    // 일반적인 구조 시도
    // 이미지가 있는 카드 형태의 리스트 찾기
    $("img").each((i, elem) => {
      const $img = $(elem)
      const src = $img.attr("src") || $img.attr("data-src") || ""
      
      // 반려동물 이미지로 보이는 것만 (크기가 있고, 부모 요소에 텍스트가 있는 경우)
      if (src && (src.includes("pet") || src.includes("dog") || src.includes("cat") || src.includes("animal"))) {
        const $card = $img.closest("div, article, li, .item, .card, .pet")
        
        if ($card.length > 0) {
          const name = $card.find("h1, h2, h3, h4, .title, .name").first().text().trim() || "이름 없음"
          const priceText = $card.find(".price, .cost, [class*='price']").first().text() || ""
          const price = extractPrice(priceText)
          
          // 가격이 있고, 이름이 있는 경우만 추가
          if (price > 0 && name !== "이름 없음") {
            pets.push({
              id: `${shop.id}-${i}`,
              name,
              breed: $card.find(".breed, [class*='breed']").first().text().trim() || "품종 미상",
              age: extractAge($card.find(".age, [class*='age']").first().text() || "나이 미상"),
              gender: $card.find("[class*='gender'], [class*='sex']").first().text().includes("암") ? "암컷" : "수컷",
              price,
              location: shop.name,
              image: src.startsWith("http") ? src : new URL(src, shop.url).href,
              shop: shop.name,
              shopUrl: shop.url,
              shopId: shop.id,
              type: shop.type === "cat" ? "cat" : shop.type === "dog" ? "dog" : "dog",
              description: $card.find(".description, .desc, p").first().text().trim() || "",
              vaccinated: false,
              registered: false,
              crawledAt: new Date().toISOString(),
            })
          }
        }
      }
    })

    return pets.slice(0, 20) // 최대 20개만
  } catch (error) {
    console.error(`Generic crawl failed for ${shop.name}:`, error)
    return []
  }
}
