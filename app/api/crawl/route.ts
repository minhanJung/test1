import { NextRequest, NextResponse } from "next/server"

// Python 크롤러 서버 URL (환경변수로 설정 가능)
const CRAWLER_API_URL = process.env.CRAWLER_API_URL || "http://localhost:8000"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const shopId = searchParams.get("shopId")

  try {
    if (shopId) {
      // 특정 샵 크롤링 - Python 크롤러 서버로 요청
      const response = await fetch(`${CRAWLER_API_URL}/api/crawl/${shopId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const error = await response.json()
        return NextResponse.json(
          { error: error.detail || "Crawl failed" },
          { status: response.status }
        )
      }

      const result = await response.json()
      return NextResponse.json(result)
    } else {
      // 모든 샵 크롤링 - Python 크롤러 서버로 요청
      const response = await fetch(`${CRAWLER_API_URL}/api/crawl`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const error = await response.json()
        return NextResponse.json(
          { error: error.detail || "Crawl failed" },
          { status: response.status }
        )
      }

      const data = await response.json()
      
      // Python 서버 응답 형식을 Next.js 형식에 맞게 변환
      return NextResponse.json({
        success: data.success,
        results: data.results || [],
        failed: data.failed || [],
        total: data.total || 0,
      })
    }
  } catch (error: any) {
    // Python 크롤러 서버가 실행되지 않은 경우
    if (error.code === "ECONNREFUSED") {
      return NextResponse.json(
        {
          error: "Crawler service is not running. Please start the Python crawler server on port 8000.",
          details: "Run: cd crawler && python -m uvicorn main:app --reload",
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: error.message || "Crawl failed" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { shopId } = await request.json()

    if (!shopId) {
      return NextResponse.json({ error: "shopId is required" }, { status: 400 })
    }

    // Python 크롤러 서버로 요청
    const response = await fetch(`${CRAWLER_API_URL}/api/crawl/${shopId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.detail || "Crawl failed" },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      return NextResponse.json(
        {
          error: "Crawler service is not running. Please start the Python crawler server on port 8000.",
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: error.message || "Crawl failed" },
      { status: 500 }
    )
  }
}
