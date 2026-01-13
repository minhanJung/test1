"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, MapPin, Calendar, Shield, Award, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"

interface Pet {
  id: number
  name: string
  breed: string
  age: string
  gender: string
  price: number
  location: string
  image: string
  shop: string
  shopUrl: string
  type: "dog" | "cat"
  description: string
  vaccinated: boolean
  registered: boolean
}

// 모든 반려동물 데이터 (실제로는 API에서 가져옴)
const allPets: Pet[] = [
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
    type: "dog",
    description: "아름다운 골든 리트리버 강아지, 사회화가 잘 되어 있고 평생 가족을 기다리고 있습니다.",
    vaccinated: true,
    registered: true,
  },
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
    type: "cat",
    description: "멋진 블루-그레이 털을 가진 사랑스러운 브리티시 숏헤어 새끼고양이입니다.",
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
    type: "dog",
    description: "희귀한 블루 프렌치 불독으로 훌륭한 성격과 건강 검진을 완료했습니다.",
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
    type: "cat",
    description: "아름다운 긴 털과 온순한 성격을 가진 장엄한 메인쿤 새끼고양이입니다.",
    vaccinated: true,
    registered: false,
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
    type: "dog",
    description: "챔피언 혈통의 강하고 똑똑한 저먼 셰퍼드 강아지입니다.",
    vaccinated: false,
    registered: true,
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
    type: "cat",
    description: "고급스러운 털과 달콤한 성격을 가진 멋진 페르시안 새끼고양이입니다.",
    vaccinated: true,
    registered: true,
  },
]

export default function PetDetailPage() {
  const params = useParams()
  const petId = Number.parseInt(params.id as string)
  const [pet, setPet] = useState<Pet | null>(null)

  useEffect(() => {
    const foundPet = allPets.find((p) => p.id === petId)
    setPet(foundPet || null)
  }, [petId])

  if (!pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <Card className="p-12 text-center">
            <CardContent>
              <h2 className="text-2xl font-bold mb-2">반려동물을 찾을 수 없습니다</h2>
              <p className="text-muted-foreground mb-6">요청하신 반려동물 정보가 존재하지 않습니다.</p>
              <Link href="/">
                <Button>홈으로 돌아가기</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const handleVisitShop = () => {
    if (pet.shopUrl) {
      window.open(pet.shopUrl, "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          홈으로 돌아가기
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 이미지 */}
          <div>
            <Card className="overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={pet.image || "/placeholder.svg"}
                  alt={pet.name}
                  fill
                  className="object-cover"
                />
                <Badge className={`absolute top-4 left-4 ${pet.type === "dog" ? "bg-blue-500" : "bg-purple-500"}`}>
                  {pet.type === "dog" ? "🐕 강아지" : "🐱 고양이"}
                </Badge>
              </div>
            </Card>
          </div>

          {/* 정보 */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{pet.name}</h1>
              <p className="text-2xl text-primary font-bold mb-4">{pet.price.toLocaleString()}원</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {pet.vaccinated && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    접종완료
                  </Badge>
                )}
                {pet.registered && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Award className="h-3 w-3 mr-1" />
                    혈통등록
                  </Badge>
                )}
              </div>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center text-sm">
                  <span className="font-medium w-24">품종:</span>
                  <span>{pet.breed}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium w-24">나이:</span>
                  <span>{pet.age}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium w-24">성별:</span>
                  <span>{pet.gender}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium w-24">위치:</span>
                  <span>{pet.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium w-24">등록업체:</span>
                  <span>{pet.shop}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">설명</h3>
                <p className="text-muted-foreground">{pet.description}</p>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                onClick={handleVisitShop}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                펫샵에서 분양하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
