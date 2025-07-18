import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Calendar, Users, Search, Filter } from "lucide-react"
import Link from "next/link"
import { PetFilters } from "@/components/pet-filters"
import { PetCard } from "@/components/pet-card"

// 여러 펫샵의 리스팅을 나타내는 모의 데이터
const featuredPets = [
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

const stats = [
  { label: "활성 리스팅", value: "2,847", icon: Heart },
  { label: "파트너 샵", value: "156", icon: Users },
  { label: "서비스 지역", value: "89", icon: MapPin },
  { label: "행복한 가족", value: "12,450", icon: Calendar },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              펫파인더
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              전체 반려동물
            </Link>
            <Link href="/dogs" className="text-sm font-medium hover:text-primary transition-colors">
              강아지
            </Link>
            <Link href="/cats" className="text-sm font-medium hover:text-primary transition-colors">
              고양이
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              소개
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              반려동물 등록하기
            </Button>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900 dark:to-purple-900 dark:text-blue-200">
              🐾 완벽한 반려동물을 찾아보세요
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              털복숭이 친구를 찾아보세요
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              전국의 신뢰할 수 있는 펫샵에서 사랑스러운 강아지와 고양이를 발견하세요. 모든 것이 한 곳에, 모든 리스팅이
              검증되었습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8"
              >
                <Search className="mr-2 h-5 w-5" />
                모든 반려동물 보기
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                <Filter className="mr-2 h-5 w-5" />
                고급 검색
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 통계 */}
      <section className="py-16 px-4 bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6 border-0 shadow-lg">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
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
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">추천 반려동물</h2>
              <p className="text-muted-foreground">평생 가족을 기다리는 사랑스러운 반려동물들</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Link href="/dogs">강아지 보기</Link>
              </Button>
              <Button variant="outline">
                <Link href="/cats">고양이 보기</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              전체 {featuredPets.length}+ 리스팅 보기
            </Button>
          </div>
        </div>
      </section>

      {/* 이용 방법 */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">펫파인더 이용 방법</h2>
          <p className="text-blue-100 mb-12 max-w-2xl mx-auto">
            전국의 신뢰할 수 있는 펫샵의 리스팅을 한 곳에 모아 완벽한 반려동물 찾기를 간단하게 만들어드립니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. 검색 & 필터링</h3>
              <p className="text-blue-100">고급 필터로 수천 개의 검증된 반려동물 리스팅을 검색하세요.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. 완벽한 매칭 찾기</h3>
              <p className="text-blue-100">당신의 라이프스타일과 선호도에 맞는 완벽한 반려동물을 발견하세요.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. 직접 연결</h3>
              <p className="text-blue-100">펫샵에 직접 연락하여 방문과 입양을 준비하세요.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">펫파인더</span>
              </div>
              <p className="text-slate-400">사랑하는 가족과 완벽한 털복숭이 반려동물을 연결합니다.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">둘러보기</h3>
              <ul className="space-y-2 text-slate-400">
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
                <li>
                  <Link href="/search" className="hover:text-white transition-colors">
                    고급 검색
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">펫샵 사업자</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/list-pets" className="hover:text-white transition-colors">
                    반려동물 등록하기
                  </Link>
                </li>
                <li>
                  <Link href="/partner" className="hover:text-white transition-colors">
                    파트너 되기
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    요금제
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">고객지원</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    회사 소개
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    문의하기
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    자주 묻는 질문
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    개인정보처리방침
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 펫파인더. 모든 권리 보유. 마음과 발톱을 연결합니다.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
