"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"

const dogBreeds = [
  "골든 리트리버",
  "래브라도 리트리버",
  "프렌치 불독",
  "저먼 셰퍼드",
  "불독",
  "푸들",
  "비글",
  "로트와일러",
  "요크셔 테리어",
  "닥스훈트",
]

const catBreeds = [
  "페르시안",
  "메인쿤",
  "브리티시 숏헤어",
  "랙돌",
  "벵갈",
  "샴",
  "아비시니안",
  "러시안 블루",
  "스코티시 폴드",
  "스핑크스",
]

const locations = [
  "서울특별시 강남구",
  "부산광역시 해운대구",
  "인천광역시 연수구",
  "대구광역시 수성구",
  "광주광역시 서구",
  "대전광역시 유성구",
  "울산광역시 남구",
  "경기도 성남시",
  "경기도 고양시",
  "경기도 용인시",
]

export function PetFilters() {
  const [petType, setPetType] = useState<string>("all")
  const [breed, setBreed] = useState<string>("any")
  const [ageRange, setAgeRange] = useState<string>("any")
  const [gender, setGender] = useState<string>("any")
  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [location, setLocation] = useState<string>("any")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [vaccinated, setVaccinated] = useState(false)
  const [registered, setRegistered] = useState(false)

  const activeFilters = []
  if (petType !== "all") activeFilters.push(petType === "dog" ? "강아지" : "고양이")
  if (breed !== "any") activeFilters.push(breed)
  if (ageRange !== "any") activeFilters.push(ageRange)
  if (gender !== "any") activeFilters.push(gender)
  if (location !== "any") activeFilters.push(location)
  if (vaccinated) activeFilters.push("접종완료")
  if (registered) activeFilters.push("혈통등록")

  const clearAllFilters = () => {
    setPetType("all")
    setBreed("any")
    setAgeRange("any")
    setGender("any")
    setPriceRange([0, 5000000])
    setLocation("any")
    setSearchQuery("")
    setVaccinated(false)
    setRegistered(false)
  }

  const availableBreeds = petType === "dog" ? dogBreeds : petType === "cat" ? catBreeds : [...dogBreeds, ...catBreeds]

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* 검색창 */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="이름, 품종, 지역으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)} className="lg:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            {showAdvanced ? "필터 숨기기" : "필터 보기"}
          </Button>
        </div>

        {/* 빠른 필터 */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium">종류:</Label>
            <Select value={petType} onValueChange={setPetType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="dog">🐕 강아지</SelectItem>
                <SelectItem value="cat">🐱 고양이</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium">지역:</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="전체 지역" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">전체 지역</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium">가격:</Label>
            <span className="text-sm text-muted-foreground">
              {priceRange[0].toLocaleString()}원 - {priceRange[1].toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 고급 필터 */}
        {showAdvanced && (
          <div className="border-t pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 품종 */}
              <div className="space-y-2">
                <Label>품종</Label>
                <Select value={breed} onValueChange={setBreed}>
                  <SelectTrigger>
                    <SelectValue placeholder="전체 품종" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">전체 품종</SelectItem>
                    {availableBreeds.map((breedOption) => (
                      <SelectItem key={breedOption} value={breedOption}>
                        {breedOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 나이 */}
              <div className="space-y-2">
                <Label>나이</Label>
                <Select value={ageRange} onValueChange={setAgeRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="전체 나이" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">전체 나이</SelectItem>
                    <SelectItem value="0-12주">0-12주</SelectItem>
                    <SelectItem value="3-6개월">3-6개월</SelectItem>
                    <SelectItem value="6-12개월">6-12개월</SelectItem>
                    <SelectItem value="1-2년">1-2년</SelectItem>
                    <SelectItem value="2년 이상">2년 이상</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 성별 */}
              <div className="space-y-2">
                <Label>성별</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="전체 성별" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">전체 성별</SelectItem>
                    <SelectItem value="수컷">수컷</SelectItem>
                    <SelectItem value="암컷">암컷</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 가격 범위 */}
              <div className="space-y-2">
                <Label>
                  가격 범위: {priceRange[0].toLocaleString()}원 - {priceRange[1].toLocaleString()}원
                </Label>
                <Slider value={priceRange} onValueChange={setPriceRange} max={5000000} step={100000} className="mt-2" />
              </div>
            </div>

            {/* 건강 & 등록 */}
            <div className="space-y-4">
              <Label className="text-base font-medium">건강 & 등록</Label>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox id="vaccinated" checked={vaccinated} onCheckedChange={setVaccinated} />
                  <Label htmlFor="vaccinated" className="text-sm cursor-pointer">
                    접종완료만
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="registered" checked={registered} onCheckedChange={setRegistered} />
                  <Label htmlFor="registered" className="text-sm cursor-pointer">
                    혈통등록만
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 활성 필터 */}
        {activeFilters.length > 0 && (
          <div className="border-t pt-4 mt-6">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">활성 필터:</Label>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                전체 지우기
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {filter}
                  <X className="h-3 w-3 cursor-pointer" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 검색 버튼 */}
        <div className="flex justify-center mt-6">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Search className="mr-2 h-4 w-4" />
            반려동물 검색 ({activeFilters.length > 0 ? `${activeFilters.length}개 필터` : "전체"})
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
