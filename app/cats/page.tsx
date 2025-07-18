"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Grid3X3, List } from "lucide-react"
import Link from "next/link"
import { PetFilters } from "@/components/pet-filters"
import { PetCard } from "@/components/pet-card"

const catListings = [
  {
    id: 2,
    name: "맥스",
    breed: "브리티시 숏헤어",
    age: "12주",
    gender: "수컷",
    price: 800000,
    location: "부산광역시 해운대구",
    image: "/placeholder.svg?height=300&width=300",
    shop: "고양이 친구들",
    shopUrl: "https://catfriends.co.kr/max",
    type: "cat" as const,
    description: "멋진 블루-그레이 털을 가진 사랑스러운 브리티시 숏헤어 새끼고양이입니다.",
    vaccinated: true,
    registered: true,
  },
  {
    id: 4,
    name: "수염이",
    breed: "메인쿤",
    age: "16주",
    gender: "수컷",
    price: 1000000,
    location: "대구광역시 수성구",
    image: "/placeholder.svg?height=300&width=300",
    shop: "대구 고양이 천국",
    shopUrl: "https://daegucats.co.kr/whiskers",
    type: "cat" as const,
    description: "아름다운 긴 털과 온순한 성격을 가진 장엄한 메인쿤 새끼고양이입니다.",
    vaccinated: true,
    registered: false,
  },
  {
    id: 6,
    name: "공주",
    breed: "페르시안",
    age: "14주",
    gender: "암컷",
    price: 1200000,
    location: "울산광역시 남구",
    image: "/placeholder.svg?height=300&width=300",
    shop: "이국적 펫샵",
    shopUrl: "https://exoticpets.co.kr/princess",
    type: "cat" as const,
    description: "고급스러운 털과 달콤한 성격을 가진 멋진 페르시안 새끼고양이입니다.",
    vaccinated: true,
    registered: true,
  },
  {
    id: 10,
    name: "그림자",
    breed: "벵갈",
    age: "10주",
    gender: "수컷",
    price: 1500000,
    location: "경기도 용인시",
    image: "/placeholder.svg?height=300&width=300",
    shop: "경기 벵갈",
    shopUrl: "https://gyeonggibengals.co.kr/shadow",
    type: "cat" as const,
    description: "아름다운 점무늬와 장난기 많은 성격을 가진 이국적인 벵갈 새끼고양이입니다.",
    vaccinated: true,
    registered: true,
  },
  {
    id: 11,
    name: "장갑이",
    breed: "랙돌",
    age: "18주",
    gender: "암컷",
    price: 900000,
    location: "경기도 성남시",
    image: "/placeholder.svg?height=300&width=300",
    shop: "경기 고양이",
    shopUrl: "https://gyeonggicat.co.kr/mittens",
    type: "cat" as const,
    description: "아름다운 파란 눈과 온순한 성격을 가진 부드러운 랙돌 새끼고양이입니다.",
    vaccinated: true,
    registered: false,
  },
  {
    id: 12,
    name: "스모키",
    breed: "러시안 블루",
    age: "8주",
    gender: "수컷",
    price: 700000,
    location: "대전광역시 유성구",
    image: "/placeholder.svg?height=300&width=300",
    shop: "대전 고양이",
    shopUrl: "https://daejeoncat.co.kr/smokey",
    type: "cat" as const,
    description: "은빛 털과 조용한 성격을 가진 아름다운 러시안 블루 새끼고양이입니다.",
    vaccinated: false,
    registered: true,
  },
]

export default function CatsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")

  const sortedCats = [...catListings].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "age":
        return Number.parseInt(a.age) - Number.parseInt(b.age)
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            전체 반려동물로 돌아가기
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                🐱 분양 고양이
                <Badge className="ml-3 bg-purple-100 text-purple-800">{catListings.length}개 리스팅</Badge>
              </h1>
              <p className="text-muted-foreground">신뢰할 수 있는 브리더로부터 완벽한 반려묘를 찾아보세요</p>
            </div>
          </div>
        </div>

        {/* 필터 */}
        <div className="mb-8">
          <PetFilters />
        </div>

        {/* 도구모음 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">{sortedCats.length}마리 고양이 발견</span>
          </div>

          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">추천순</SelectItem>
                <SelectItem value="price-low">가격: 낮은순</SelectItem>
                <SelectItem value="price-high">가격: 높은순</SelectItem>
                <SelectItem value="age">나이: 어린순</SelectItem>
                <SelectItem value="name">이름: 가나다순</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 고양이 그리드 */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
          {sortedCats.map((cat) => (
            <PetCard key={cat.id} pet={cat} />
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            <Button variant="outline" disabled>
              이전
            </Button>
            <Button variant="default">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">다음</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
