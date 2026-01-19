import { NextRequest, NextResponse } from "next/server"
import { petShops } from "@/lib/pet-shops"
import { crawlPetShop } from "@/lib/crawlers/crawler"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const shopId = searchParams.get("shopId")
  const force = searchParams.get("force") === "true"

  try {
    if (shopId) {
      // 특정 샵 크롤링
      const shop = petShops.find((s) => s.id === shopId)
      if (!shop) {
        return NextResponse.json({ error: "Shop not found" }, { status: 404 })
      }

      const result = await crawlPetShop(shop)
      return NextResponse.json(result)
    } else {
      // 모든 샵 크롤링
      const results = await Promise.allSettled(
        petShops.filter((s) => s.enabled).map((shop) => crawlPetShop(shop))
      )

      const successResults = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => (r as PromiseFulfilledResult<any>).value)

      const failedResults = results
        .filter((r) => r.status === "rejected")
        .map((r, i) => ({
          shopId: petShops[i]?.id,
          error: (r as PromiseRejectedResult).reason?.message || "Unknown error",
        }))

      return NextResponse.json({
        success: true,
        results: successResults,
        failed: failedResults,
        total: successResults.reduce((sum, r) => sum + r.count, 0),
      })
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Crawl failed" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { shopId } = await request.json()
    const shop = petShops.find((s) => s.id === shopId)

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 })
    }

    const result = await crawlPetShop(shop)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Crawl failed" },
      { status: 500 }
    )
  }
}
