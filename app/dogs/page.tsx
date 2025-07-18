"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Grid3X3, List } from "lucide-react"
import Link from "next/link"
import { PetFilters } from "@/components/pet-filters"
import { PetCard } from "@/components/pet-card"

const dogListings = [
  {
    id: 1,
    name: "벨라",
    breed: "골든 리트리버",
    age: "8주",
    gender: "암컷",
    price: 1200000,
    location: "서울특별시 강남구",
    image: "/placeholder.svg?height=300&width=300",
    shop: "해피펫 애완동물샵",
    shopUrl: "https://happypet.co.kr/bella",
    type: "dog" as const,
    description: "아름다운 골든 리트리버 강아지, 사회화가 잘 되어 있고 평생 가족을 기다리고 있습니다.",
    vaccinated: true,
    registered: true,
  },
  {
    id: 3,
    name: "루나",
    breed: "프렌치 불독",
    age: "10주",
    gender: "암컷",
    price: 2500000,
    location: "인천광역시 연수구",
    image: "/placeholder.svg?height=300&width=300",
    shop: "프리미엄 퍼피",
    shopUrl: "https://premiumpuppy.co.kr/luna",
    type: "dog" as const,
    description: "희귀한 블루 프렌치 불독으로 훌륭한 성격과 건강 검진을 완료했습니다.",
    vaccinated: true,
    registered: true,
  },
  {
    id: 5,
    name: "록키",
    breed: "저먼 셰퍼드",
    age: "6주",
    gender: "수컷",
    price: 1500000,
    location: "광주광역시 서구",
    image: "/placeholder.svg?height=300&width=300",
    shop: "산악견사",
    shopUrl: "https://mountainkennels.co.kr/rocky",
    type: "dog" as const,
    description: "챔피언 혈통의 강하고 똑똑한 저먼 셰퍼드 강아지입니다.",
    vaccinated: false,
    registered: true,
  },
  {
    id: 7,
    name: "찰리",
    breed: "래브라도 리트리버",
    age: "12주",
    gender: "수컷",
    price: 1000000,
    location: "경기도 성남시",
    image: "/placeholder.svg?height=300&width=300",
    shop: "경기 퍼피",
    shopUrl: "https://gyeonggipuppy.co.kr/charlie",
    type: "dog" as const,
    description: "친근하고 활발한 래브라도 강아지, 아이들과 다른 반려동물과 잘 어울립니다.",
    vaccinated: true,
    registered: false,
  },
  {
    id: 8,
    name: "데이지",
    breed: "비글",
    age: "14주",
    gender: "암컷",
    price: 800000,
    location: "경기도 고양시",
    image: "/placeholder.svg?height=300&width=300",
    shop: "경기 도그하우스",
    shopUrl: "https://gyeonggidoghouse.co.kr/daisy",
    type: "dog" as const,
    description: "클래식한 삼색 무늬와 온순한 성격을 가진 달콤한 비글 강아지입니다.",
    vaccinated: true,
    registered: true,
  },
  {
    id: 9,
    name: "제우스",
    breed: "로트와일러",
    age: "8주",
    gender: "수컷",
    price: 1800000,
    location: "대전광역시 유성구",
    image: "/placeholder.svg?height=300&width=300",
    shop: "대전 도그스",
    shopUrl: "https://daejeondogs.co.kr/zeus",
    type: "dog" as const,
    description: "챔피언 작업견 혈통의 강하고 충성스러운 로트와일러 강아지입니다.",
    vaccinated: true,
    registered: true,
  },
]

export default function DogsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")

  const sortedDogs = [...dogListings].sort((a, b) => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
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
                🐕 분양 강아지
                <Badge className="ml-3 bg-blue-100 text-blue-800">{dogListings.length}개 리스팅</Badge>
              </h1>
              <p className="text-muted-foreground">신뢰할 수 있는 브리더로부터 완벽한 반려견을 찾아보세요</p>
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
            <span className="text-sm text-muted-foreground">{sortedDogs.length}마리 강아지 발견</span>
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

        {/* 강아지 그리드 */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
          {sortedDogs.map((dog) => (
            <PetCard key={dog.id} pet={dog} />
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
