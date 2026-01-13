// 인증 관련 유틸리티 함수

export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// 로컬 스토리지에서 사용자 정보 가져오기
export function getUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("user")
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

// 로컬 스토리지에 사용자 정보 저장
export function setUser(user: User | null): void {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem("user", JSON.stringify(user))
  } else {
    localStorage.removeItem("user")
  }
}

// 로그인
export function login(email: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 간단한 검증 (실제로는 서버 API 호출)
      const users = getStoredUsers()
      const user = users.find((u) => u.email === email && u.password === password)
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user
        setUser(userWithoutPassword)
        resolve(userWithoutPassword)
      } else {
        reject(new Error("이메일 또는 비밀번호가 올바르지 않습니다."))
      }
    }, 1000)
  })
}

// 회원가입
export function signup(name: string, email: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getStoredUsers()
      
      // 이메일 중복 확인
      if (users.some((u) => u.email === email)) {
        reject(new Error("이미 사용 중인 이메일입니다."))
        return
      }

      // 새 사용자 생성
      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role: "user",
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      resolve(userWithoutPassword)
    }, 1000)
  })
}

// 로그아웃
export function logout(): void {
  setUser(null)
}

// 로컬 스토리지에서 사용자 목록 가져오기
function getStoredUsers(): Array<User & { password: string }> {
  if (typeof window === "undefined") return []
  const usersStr = localStorage.getItem("users")
  if (!usersStr) {
    // 기본 관리자 계정 생성
    const defaultUsers = [
      {
        id: "1",
        name: "관리자",
        email: "admin@petfinder.com",
        password: "admin123",
        role: "admin" as const,
      },
    ]
    localStorage.setItem("users", JSON.stringify(defaultUsers))
    return defaultUsers
  }
  try {
    return JSON.parse(usersStr)
  } catch {
    return []
  }
}
