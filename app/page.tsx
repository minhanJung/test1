"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Calendar, Users, Search, User, LogOut, RefreshCw } from "lucide-react"
import Link from "next/link"
import { PetCard } from "@/components/pet-card"
import { PetFilters } from "@/components/pet-filters"
import { useAuth } from "@/contexts/auth-context"
import { getPets, addPets } from "@/lib/storage"
import { Pet } from "@/lib/pet-types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const auth = useAuth()
  const { user, isAuthenticated, logout } = auth
  const [pets, setPets] = useState<Pet[]>([])
  const [isCrawling, setIsCrawling] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // 저장된 펫 데이터 로드 (클라이언트 사이드에서만)
    if (typeof window !== "undefined") {
      const savedPets = getPets()
      setPets(savedPets)
    }
  }, [])

  const handleCrawl = async () => {
    setIsCrawling(true)
    try {
      const response = await fetch("/api/crawl")
      const data = await response.json()

      if (data.success) {
        const allPets: Pet[] = []
        data.results.forEach((result: any) => {
          allPets.push(...result.pets)
        })

        addPets(allPets)
        setPets(getPets())
        toast({
          title: "크롤링 완료",
          description: `${allPets.length}개의 반려동물 정보를 수집했습니다.`,
        })
      }
    } catch (error) {
      toast({
        title: "크롤링 실패",
        description: "데이터 수집 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsCrawling(false)
    }
  }

  const stats = [
    { label: "활성 리스팅", value: pets.length.toString(), icon: Heart },
    { label: "파트너 샵", value: "25", icon: Users },
    { label: "서비스 지역", value: "전국", icon: MapPin },
    { label: "업데이트", value: "실시간", icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="h-8 w-8 rounded-md bg-slate-900 dark:bg-white flex items-center justify-center transition-transform group-hover:scale-105">
              <Heart className="h-4 w-4 text-white dark:text-slate-900 fill-current" />
            </div>
            <span className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
              펫파인더
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              전체 반려동물
            </Link>
            <Link href="/dogs" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              강아지
            </Link>
            <Link href="/cats" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              고양이
            </Link>
            <Link href="/about" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              소개
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <Link href="/pets/register">
                <Button variant="outline" size="sm">
                  반려동물 등록하기
                </Button>
              </Link>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.name}님</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user?.role === "admin" && (
                    <Link href="/admin">
                      <DropdownMenuItem>관리자 페이지</DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/login">
                <Button size="sm">로그인</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="relative py-24 px-4 border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <Badge className="mb-6 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-0 px-3 py-1 text-xs font-medium">
              전국 펫샵 정보 비교 플랫폼
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">
              반려동물을 찾는
              <br />
              가장 쉬운 방법
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              전국의 모든 펫샵 정보를 한눈에 비교하세요. 원하는 반려동물을 찾고 최적의 펫샵에서 분양받으세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleCrawl}
                disabled={isCrawling}
                size="lg"
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-base px-8 h-12 font-medium"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isCrawling ? "animate-spin" : ""}`} />
                {isCrawling ? "데이터 수집 중..." : "펫샵 정보 업데이트"}
              </Button>
              <Link href="/dogs">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-base px-8 h-12 font-medium border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  <Search className="mr-2 h-4 w-4" />
                  강아지 찾기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 통계 */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <stat.icon className="h-6 w-6 mx-auto mb-3 text-slate-600 dark:text-slate-400" />
                  <div className="text-3xl font-bold mb-1 text-slate-900 dark:text-white">{stat.value}</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 필터 */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <PetFilters />
        </div>
      </section>

      {/* 추천 반려동물 */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">추천 반려동물</h2>
              <p className="text-slate-600 dark:text-slate-400">전국 펫샵에서 엄선한 반려동물</p>
            </div>
            <div className="flex space-x-2">
              <Link href="/dogs">
                <Button variant="outline" className="border-slate-200 dark:border-slate-800">
                  강아지 보기
                </Button>
              </Link>
              <Link href="/cats">
                <Button variant="outline" className="border-slate-200 dark:border-slate-800">
                  고양이 보기
                </Button>
              </Link>
            </div>
          </div>

          {pets.length === 0 ? (
            <Card className="p-12 text-center border border-slate-200 dark:border-slate-800">
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  아직 수집된 반려동물 정보가 없습니다.
                </p>
                <Button onClick={handleCrawl} disabled={isCrawling}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isCrawling ? "animate-spin" : ""}`} />
                  펫샵 정보 수집하기
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pets.slice(0, 9).map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 이용 방법 */}
      <section className="py-20 px-4 bg-slate-900 dark:bg-slate-950">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">이용 방법</h2>
          <p className="text-slate-400 mb-16 max-w-2xl mx-auto text-lg">
            전국의 모든 펫샵 정보를 한 곳에서 비교하고, 원하는 반려동물을 찾아 해당 펫샵에서 직접 분양받으세요.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">1. 펫샵 정보 검색</h3>
              <p className="text-slate-400 leading-relaxed">전국의 펫샵에서 분양 가능한 반려동물 정보를 검색하고 비교하세요.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">2. 가격 및 정보 비교</h3>
              <p className="text-slate-400 leading-relaxed">여러 펫샵의 가격, 위치, 반려동물 정보를 한눈에 비교하세요.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">3. 펫샵으로 이동</h3>
              <p className="text-slate-400 leading-relaxed">원하는 반려동물을 클릭하면 해당 펫샵 웹사이트로 이동하여 분양을 진행하세요.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-slate-900 text-white py-16 px-4 border-t border-slate-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center">
                  <Heart className="h-4 w-4 text-slate-900 fill-current" />
                </div>
                <span className="text-xl font-semibold">펫파인더</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">전국 펫샵 정보를 한눈에 비교하는 플랫폼입니다.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">둘러보기</h3>
              <ul className="space-y-2.5 text-slate-400 text-sm">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    전체 반려동물
                  </Link>
                </li>
                <li>
                  <Link href="/dogs" className="hover:text-white transition-colors">
                    강아지
                  </Link>
                </li>
                <li>
                  <Link href="/cats" className="hover:text-white transition-colors">
                    고양이
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">펫샵 사업자</h3>
              <ul className="space-y-2.5 text-slate-400 text-sm">
                <li>
                  <Link href="/pets/register" className="hover:text-white transition-colors">
                    반려동물 등록하기
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">고객지원</h3>
              <ul className="space-y-2.5 text-slate-400 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    회사 소개
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
            <p>&copy; 2025 펫파인더. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
