// 크롤링된 데이터를 로컬 스토리지에 저장/관리
import { Pet } from "./pet-types"

const STORAGE_KEY = "crawled_pets"

export function savePets(pets: Pet[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pets))
}

export function getPets(): Pet[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function addPets(newPets: Pet[]): void {
  const existing = getPets()
  const updated = [...existing, ...newPets]
  // 중복 제거 (id 기준)
  const unique = Array.from(new Map(updated.map((pet) => [pet.id, pet])).values())
  savePets(unique)
}

export function clearPets(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}

// 서버 사이드 저장 (실제로는 DB 사용 권장)
export function savePetsToServer(pets: Pet[]): Promise<void> {
  // 실제로는 API 호출하여 서버에 저장
  return Promise.resolve()
}
