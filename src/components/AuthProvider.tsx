'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

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
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // 初始化时检查登录状态 - 不阻塞渲染
  useEffect(() => {
    // 只在客户端执行
    if (typeof window === 'undefined') return
    
    try {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')

      if (token && userData) {
        try {
          // 先解析本地数据，立即显示页面
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          
          // 后台验证 token（非阻塞）
          verifyTokenInBackground(token).then(isValid => {
            if (!isValid) {
              // token 无效时清除数据
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              setUser(null)
            }
          }).catch(() => {
            // 验证失败时保留本地数据，让用户可以继续使用
          })
        } catch (e) {
          console.error('解析用户数据失败:', e)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
    } catch (error) {
      console.error('初始化认证失败:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // 后台验证 token（不阻塞）
  const verifyTokenInBackground = async (token: string): Promise<boolean> => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)
      
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
