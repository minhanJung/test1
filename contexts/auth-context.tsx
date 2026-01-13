"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User, getUser, setUser, login as authLogin, signup as authSignup, logout as authLogout } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // 초기 로드 시 사용자 정보 확인
    const currentUser = getUser()
    setUserState(currentUser)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const user = await authLogin(email, password)
      setUserState(user)
      toast({
        title: "로그인 성공",
        description: `${user.name}님 환영합니다!`,
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "로그인 실패",
        description: error instanceof Error ? error.message : "로그인에 실패했습니다.",
        variant: "destructive",
      })
      throw error
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      const user = await authSignup(name, email, password)
      setUserState(user)
      toast({
        title: "회원가입 성공",
        description: "계정이 생성되었습니다!",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "회원가입 실패",
        description: error instanceof Error ? error.message : "회원가입에 실패했습니다.",
        variant: "destructive",
      })
      throw error
    }
  }

  const logout = () => {
    authLogout()
    setUserState(null)
    toast({
      title: "로그아웃",
      description: "로그아웃되었습니다.",
    })
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
