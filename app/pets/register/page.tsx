"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

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

export default function RegisterPetPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    gender: "",
    price: "",
    location: "",
    description: "",
    shop: "",
    shopUrl: "",
    vaccinated: false,
    registered: false,
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <Card className="p-12 text-center">
            <CardContent>
              <h2 className="text-2xl font-bold mb-2">로그인이 필요합니다</h2>
              <p className="text-muted-foreground mb-6">반려동물을 등록하려면 먼저 로그인해주세요.</p>
              <Link href="/auth/login">
                <Button>로그인하기</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // 실제로는 API 호출
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "등록 완료",
        description: "반려동물이 성공적으로 등록되었습니다!",
      })
      router.push("/")
    }, 2000)
  }

  const availableBreeds = formData.type === "dog" ? dogBreeds : formData.type === "cat" ? catBreeds : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          홈으로 돌아가기
        </Link>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">반려동물 등록</h1>

          <Card>
            <CardHeader>
              <CardTitle>반려동물 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름 *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">종류 *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value, breed: "" })}>
                      <SelectTrigger>
                        <SelectValue placeholder="선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">🐕 강아지</SelectItem>
                        <SelectItem value="cat">🐱 고양이</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="breed">품종 *</Label>
                    <Select
                      value={formData.breed}
                      onValueChange={(value) => setFormData({ ...formData, breed: value })}
                      disabled={!formData.type}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.type ? "선택하세요" : "먼저 종류를 선택하세요"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBreeds.map((breed) => (
                          <SelectItem key={breed} value={breed}>
                            {breed}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">나이 *</Label>
                    <Input
                      id="age"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="예: 8주, 3개월"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">성별 *</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="수컷">수컷</SelectItem>
                        <SelectItem value="암컷">암컷</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">가격 (원) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">위치 *</Label>
                    <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">설명 *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="shop">펫샵 이름 *</Label>
                    <Input
                      id="shop"
                      value={formData.shop}
                      onChange={(e) => setFormData({ ...formData, shop: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shopUrl">펫샵 URL</Label>
                    <Input
                      id="shopUrl"
                      type="url"
                      value={formData.shopUrl}
                      onChange={(e) => setFormData({ ...formData, shopUrl: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>건강 & 등록 정보</Label>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="vaccinated"
                        checked={formData.vaccinated}
                        onCheckedChange={(checked) => setFormData({ ...formData, vaccinated: checked === true })}
                      />
                      <Label htmlFor="vaccinated" className="cursor-pointer">
                        접종 완료
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="registered"
                        checked={formData.registered}
                        onCheckedChange={(checked) => setFormData({ ...formData, registered: checked === true })}
                      />
                      <Label htmlFor="registered" className="cursor-pointer">
                        혈통 등록
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>이미지 업로드</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">이미지를 업로드하세요 (선택사항)</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "등록 중..." : "등록하기"}
                  </Button>
                  <Link href="/">
                    <Button type="button" variant="outline">
                      취소
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
