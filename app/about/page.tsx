"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Shield, Award, ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react"
import Link from "next/link"

/*--------------------------------------
  더미 데이터
--------------------------------------*/
const teamMembers = [
  {
    name: "한정민",
    role: "창립자 & 대표이사",
    bio: "15년 이상의 반려동물 업계 경험을 가진 동물 애호가",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "허준혁",
    role: "파트너십 총괄",
    bio: "전국의 신뢰할 수 있는 펫샵과의 관계 구축",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "김건효",
    role: "제품 관리자",
    bio: "반려동물을 찾는 분들을 위한 최고의 사용자 경험 보장",
    image: "/placeholder.svg?height=200&width=200",
  },
]

const values = [
  {
    icon: Heart,
    title: "반려동물 복지 우선",
    description: "플랫폼의 모든 동물의 건강과 행복을 최우선으로 합니다.",
  },
  {
    icon: Shield,
    title: "신뢰할 수 있는 파트너",
    description: "모든 펫샵은 검증되었으며 동물 관리에 대한 엄격한 기준을 충족합니다.",
  },
  {
    icon: Users,
    title: "커뮤니티 중심",
    description: "사랑하는 가족과 완벽한 반려동물 사이의 연결을 구축합니다.",
  },
  {
    icon: Award,
    title: "품질 보증",
    description: "모든 리스팅은 정확성과 합법성을 보장하기 위해 검토됩니다.",
  },
]
/*------------------------------------*/

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* ===== 헤더 ===== */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            홈으로 돌아가기
          </Link>
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">🐾 펫파인더 소개</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              마음과 발톱을 연결하다
            </h1>
            <p className="text-xl text-muted-foreground">
              완벽한 반려동물 찾기를 가능한 한 쉽고 즐겁게 만드는 것이 우리의 사명입니다.
            </p>
          </div>
        </div>

        {/* ===== 우리의 이야기 ===== */}
        <section className="mb-16">
          <Card className="p-8 md:p-12">
            <CardContent className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">우리의 이야기</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="mb-6">
                  펫파인더는 간단한 불편함에서 시작되었습니다: 완벽한 반려동물을 찾기 위해 수십 개의 다른 웹사이트를
                  방문하거나, 수많은 펫샵에 전화하거나, 흩어진 리스팅을 찾기 위해 몇 시간을 보낼 필요가 없어야 한다는
                  것입니다.
                </p>
                <p className="mb-6">
                  개발중
                </p>
                <p>
                  개발중
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ===== 우리의 가치 ===== */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">우리의 가치</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
             개발중
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <Card key={idx} className="text-center p-6">
                <CardContent className="pt-6">
                  <value.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ===== 팀 소개 ===== */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">우리 팀</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              반려동물 사랑, 기술 혁신, 업계 전문성을 갖춘 열정적인 팀을 소개합니다.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <Card key={idx} className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ===== 통계 ===== */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">우리의 영향</h2>
                <p className="text-blue-100 max-w-2xl mx-auto">
                  출시 이후, 수천 가정에 반려동물을 연결하고 지역 펫샵을 지원했습니다.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <Stat icon={Heart} value="2,847" label="활성 리스팅" />
                <Stat icon={Users} value="156" label="파트너 샵" />
                <Stat icon={Calendar} value="12,450" label="행복한 가족" />
                <Stat icon={MapPin} value="89" label="서비스 지역" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ===== 문의 ===== */}
        <section className="mb-16">
          <Card className="p-8">
            <CardContent className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">문의하기</h2>
              <p className="text-muted-foreground mb-8">
                플랫폼에 대한 질문이 있거나 파트너가 되고 싶으신가요? 언제든 연락주세요!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  이메일 문의
                </Button>
                <Button size="lg" variant="outline">
                  <Phone className="mr-2 h-4 w-4" />
                  파트너 상담
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

/*--------------------------------------
  보조 컴포넌트
--------------------------------------*/
interface StatProps {
  icon: typeof Heart
  value: string
  label: string
}
function Stat({ icon: Icon, value, label }: StatProps) {
  return (
    <div className="text-center">
      <Icon className="h-8 w-8 mx-auto mb-2 text-white" />
      <div className="text-4xl font-bold mb-1">{value}</div>
      <div className="text-blue-100">{label}</div>
    </div>
  )
}
