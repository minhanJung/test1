// 반려동물 데이터 타입 정의
export interface Pet {
  id: string
  name: string
  breed: string
  age: string
  gender: "수컷" | "암컷"
  price: number
  location: string
  image: string
  shop: string
  shopUrl: string
  shopId: string
  type: "dog" | "cat"
  description: string
  vaccinated: boolean
  registered: boolean
  crawledAt: string
}

export interface CrawlResult {
  success: boolean
  shopId: string
  shopName: string
  pets: Pet[]
  error?: string
  count: number
}
