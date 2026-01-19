// 베이비몽 전용 크롤러
import { PetShop } from "@/lib/pet-shops"
import { Pet } from "@/lib/pet-types"
import { fetchHTML, extractPrice, extractAge } from "./crawler"
import { load } from "cheerio"

export async function crawlBabymong(shop: PetShop): Promise<Pet[]> {
  try {
    const html = await fetchHTML(shop.url)
    const $ = load(html)
    const pets: Pet[] = []

    // 베이비몽 사이트 구조에 맞게 파싱
    // 실제 사이트 구조를 확인 후 수정 필요
    $(".pet-item, .dog-item, .cat-item, [class*='pet']").each((i, elem) => {
      const $item = $(elem)
      const name = $item.find(".name, h3, h4").first().text().trim()
      const priceText = $item.find(".price").first().text()
      const image = $item.find("img").first().attr("src") || ""

      if (name && priceText) {
        pets.push({
          id: `${shop.id}-${i}`,
          name,
          breed: $item.find(".breed").text().trim() || "품종 미상",
          age: extractAge($item.find(".age").text() || ""),
          gender: $item.find("[class*='gender']").text().includes("암") ? "암컷" : "수컷",
          price: extractPrice(priceText),
          location: "서울",
          image: image.startsWith("http") ? image : new URL(image, shop.url).href,
          shop: shop.name,
          shopUrl: shop.url,
          shopId: shop.id,
          type: "dog",
          description: $item.find(".desc, .description").text().trim() || "",
          vaccinated: false,
          registered: false,
          crawledAt: new Date().toISOString(),
        })
      }
    })

    return pets
  } catch (error) {
    console.error(`Babymong crawl failed:`, error)
    return []
  }
}
