"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Calendar, ExternalLink, Shield, Award } from "lucide-react"
import Image from "next/image"

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

interface PetCardProps {
  pet: Pet
}

export function PetCard({ pet }: PetCardProps) {
  const handleCardClick = () => {
    // 카드 클릭 시 펫샵 웹사이트로 리디렉트
    if (pet.shopUrl) {
      window.open(pet.shopUrl, "_blank")
    }
  }

  const handleVisitShop = (e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 버블링 방지
    if (pet.shopUrl) {
      window.open(pet.shopUrl, "_blank")
    }
  }

  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <Image
          src={pet.image || "/placeholder.svg"}
          alt={pet.name}
          width={300}
          height={300}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className={`absolute top-3 left-3 ${pet.type === "dog" ? "bg-blue-500" : "bg-purple-500"}`}>
          {pet.type === "dog" ? "🐕 강아지" : "🐱 고양이"}
        </Badge>
        <Button
          size="icon"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white text-gray-700"
          variant="secondary"
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* 건강 배지 */}
        <div className="absolute bottom-3 left-3 flex space-x-1">
          {pet.vaccinated && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
              <Shield className="h-3 w-3 mr-1" />
              접종완료
            </Badge>
          )}
          {pet.registered && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
              <Award className="h-3 w-3 mr-1" />
              혈통등록
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{pet.name}</h3>
          <span className="text-2xl font-bold text-primary">{pet.price.toLocaleString()}원</span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="font-medium">{pet.breed}</span>
            <span className="mx-2">•</span>
            <span>{pet.gender}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{pet.age}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{pet.location}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{pet.description}</p>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm">
              <span className="text-muted-foreground">등록업체:</span>
              <div className="font-medium">{pet.shop}</div>
            </div>
          </div>

          <Button
            onClick={handleVisitShop}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            펫샵에서 분양하기
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
