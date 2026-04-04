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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    try {
      if (typeof window === 'undefined') return
      
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData)
          
          if (parsedUser && parsedUser.id && parsedUser.username) {
            setUser(parsedUser)
            
            verifyTokenInBackground(token).then(isValid => {
              if (!isValid && mounted) {
                try {
                  localStorage.removeItem('token')
                  localStorage.removeItem('user')
                  setUser(null)
                } catch (e) {
                  console.error('清除认证数据失败:', e)
                }
              }
            }).catch(() => {
            })
          }
        } catch (e) {
          console.error('解析用户数据失败:', e)
          try {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          } catch (err) {
            console.error('清除失败的数据失败:', err)
          }
        }
      }
    } catch (error) {
      console.error('初始化认证失败:', error)
    } finally {
      setLoading(false)
    }
  }, [mounted])

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
    try {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      console.error('登录保存数据失败:', error)
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('登出失败:', error)
    }
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
    return {
      user: null,
      loading: false,
      login: () => {},
      logout: () => {}
    }
  }
  return context
}
