"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
}

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        try {
          setUserState(JSON.parse(userStr))
        } catch {
          setUserState(null)
        }
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // 간단한 인증 로직
    const user = { id: "1", email, name: email.split("@")[0], role: email.includes("admin") ? "admin" : "user" as const }
    setUserState(user)
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user))
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    const user = { id: Date.now().toString(), email, name, role: "user" as const }
    setUserState(user)
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user))
    }
  }

  const logout = () => {
    setUserState(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
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
