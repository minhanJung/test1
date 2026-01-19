"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Calendar, ExternalLink, Shield, Award } from "lucide-react"
import Image from "next/image"
import { Pet } from "@/lib/pet-types"

interface PetCardProps {
  pet: Pet
}

export function PetCard({ pet }: PetCardProps) {
  const handleCardClick = () => {
    if (pet.shopUrl) {
      window.open(pet.shopUrl, "_blank")
    }
  }

  const handleVisitShop = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (pet.shopUrl) {
    window.open(pet.shopUrl, "_blank")
    }
  }

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <Image
          src={pet.image || "/placeholder.svg"}
          alt={pet.name}
          width={300}
          height={300}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg"
          }}
        />
        <Badge className={`absolute top-3 left-3 ${pet.type === "dog" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900"} border-0 font-medium text-xs px-2.5 py-1`}>
          {pet.type === "dog" ? "강아지" : "고양이"}
        </Badge>

        {/* 건강 배지 */}
        <div className="absolute bottom-3 left-3 flex space-x-1.5">
          {pet.vaccinated && (
            <Badge variant="secondary" className="bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-300 text-xs border-0 backdrop-blur-sm">
              <Shield className="h-3 w-3 mr-1" />
              접종완료
            </Badge>
          )}
          {pet.registered && (
            <Badge variant="secondary" className="bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-300 text-xs border-0 backdrop-blur-sm">
              <Award className="h-3 w-3 mr-1" />
              혈통등록
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">{pet.name}</h3>
          <span className="text-xl font-bold text-slate-900 dark:text-white">{pet.price.toLocaleString()}원</span>
        </div>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <span className="font-medium">{pet.breed}</span>
            <span className="mx-1.5 text-slate-300 dark:text-slate-700">•</span>
            <span>{pet.gender}</span>
          </div>
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            <span>{pet.age}</span>
          </div>
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            <span className="truncate">{pet.location}</span>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">{pet.description}</p>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="mb-3">
            <div className="text-xs text-slate-500 dark:text-slate-500 mb-1">등록업체</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">{pet.shop}</div>
          </div>

          <Button
            onClick={handleVisitShop}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-medium"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            펫샵에서 분양하기
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
