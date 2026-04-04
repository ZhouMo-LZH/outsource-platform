'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  username: string
  email: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // 验证 token 是否有效（带超时）
  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒超时
      
      const res = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      return res.ok
    } catch {
      return false
    }
  }

  // 初始化时检查登录状态
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (token && userData) {
          try {
            // 验证 token 是否仍然有效
            const isValid = await verifyToken(token)
            
            if (isValid) {
              setUser(JSON.parse(userData))
            } else {
              // token 已过期，清除本地存储
              localStorage.removeItem('token')
              localStorage.removeItem('user')
            }
          } catch (verifyError) {
            // 验证失败但不清除，可能是网络问题
            console.log('Token 验证失败:', verifyError)
            // 仍然使用本地数据，让用户可以访问
            setUser(JSON.parse(userData))
          }
        }
      } catch (error) {
        console.error('初始化认证失败:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
