// 펫샵 사이트 정보
export interface PetShop {
  id: string
  name: string
  url: string
  type: "dog" | "cat" | "both"
  enabled: boolean
}

export const petShops: PetShop[] = [
  { id: "babymong", name: "베이비몽", url: "https://www.babymong.co.kr", type: "both", enabled: true },
  { id: "petj", name: "펫제이", url: "https://www.pet-j.net", type: "both", enabled: true },
  { id: "ispet", name: "이즈펫", url: "https://is-pet.co.kr", type: "both", enabled: true },
  { id: "minipet", name: "미니펫/미니캣", url: "https://minicatmobile.co.kr", type: "cat", enabled: true },
  { id: "petami", name: "펫아미", url: "https://petami.co.kr", type: "both", enabled: true },
  { id: "styledogcat", name: "알로하펍앤코", url: "https://styledogcat.com", type: "both", enabled: true },
  { id: "dorothypet", name: "도로시펫", url: "https://dorothypet.co.kr", type: "both", enabled: true },
  { id: "meyoupet", name: "미유펫", url: "https://meyoupet-gwangju.co.kr", type: "both", enabled: true },
  { id: "cattery", name: "캐터리", url: "https://cattery.co.kr", type: "cat", enabled: true },
  { id: "dogmaru", name: "도그마루", url: "https://dogmaru.co.kr", type: "dog", enabled: true },
  { id: "garfield", name: "가필드고양이", url: "https://xn--o39aqqt5q33r9ecc46a.com", type: "cat", enabled: true },
  { id: "petlounge", name: "펫라운지", url: "https://www.pet-lounge.co.kr", type: "both", enabled: true },
  { id: "lovepet", name: "러브펫", url: "https://www.lovepet.co.kr", type: "both", enabled: true },
  { id: "puppyland", name: "퍼피랜드", url: "https://www.puppyland.co.kr", type: "dog", enabled: true },
  { id: "angelpet", name: "엔젤펫", url: "https://www.angelpet.co.kr", type: "both", enabled: true },
  { id: "happypet", name: "해피펫", url: "https://www.happypet.co.kr", type: "both", enabled: true },
  { id: "puppypet", name: "퍼피펫", url: "https://www.puppypet.co.kr", type: "dog", enabled: true },
  { id: "queenspet", name: "퀸즈펫", url: "https://www.queenspet.co.kr", type: "both", enabled: true },
  { id: "petbay", name: "펫베이", url: "https://www.petbay.co.kr", type: "both", enabled: true },
  { id: "royalpet", name: "로얄펫", url: "https://www.royalpet.co.kr", type: "both", enabled: true },
  { id: "catjoa", name: "캣조아", url: "https://www.catjoa.com", type: "cat", enabled: true },
  { id: "minicat", name: "미니캣", url: "https://www.minicat.co.kr", type: "cat", enabled: true },
  { id: "kittyland", name: "키티랜드", url: "https://www.kittyland.co.kr", type: "cat", enabled: true },
  { id: "catplanet", name: "캣플래닛", url: "https://www.catplanet.co.kr", type: "cat", enabled: true },
  { id: "catvillage", name: "캣빌리지", url: "https://www.catvillage.co.kr", type: "cat", enabled: true },
]
