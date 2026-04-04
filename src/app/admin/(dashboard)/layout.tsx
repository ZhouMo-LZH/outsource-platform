'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Users, MessageSquare, Package, Settings,
  LogOut, Menu, X, Bell, Search, ChevronDown, Layers,
  Loader2
} from 'lucide-react'
import { UnreadContext, useUnreadCount } from './UnreadContext'

const sidebarItems = [
  { icon: LayoutDashboard, label: '仪表盘', href: '/admin/dashboard' },
  { icon: Users, label: '用户管理', href: '/admin/users' },
  { icon: Package, label: '订单管理', href: '/admin/orders' },
  { icon: Layers, label: '服务管理', href: '/admin/services' },
  { icon: MessageSquare, label: '客服消息', href: '/admin/chat' },
  { icon: Settings, label: '系统设置', href: '/admin/settings' },
]

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [admin, setAdmin] = useState<{ username: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  // 获取未读消息数量
  const fetchUnreadCount = async () => {
    try {
      const res = await fetch('/api/messages/unread-count')
      if (res.ok) {
        const data = await res.json()
        setUnreadCount(data.count || 0)
      }
    } catch (error) {
      console.error('获取未读消息数量失败:', error)
    }
  }

  // 刷新未读消息数量（供子页面调用）
  const refreshUnreadCount = () => {
    fetchUnreadCount()
  }

  // 发送心跳报告在线状态
  const sendHeartbeat = async () => {
    const adminData = localStorage.getItem('admin')
    if (adminData) {
      try {
        const parsed = JSON.parse(adminData)
        await fetch('/api/admin/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminId: parsed.id || parsed.username })
        })
      } catch (error) {
        console.error('发送心跳失败:', error)
      }
    }
  }

  // 登出时清除在线状态
  const logoutAndClearStatus = async () => {
    const adminData = localStorage.getItem('admin')
    if (adminData) {
      try {
        const parsed = JSON.parse(adminData)
        await fetch(`/api/admin/status?adminId=${parsed.id || parsed.username}`, {
          method: 'DELETE'
        })
      } catch (error) {
        console.error('清除在线状态失败:', error)
      }
    }
    localStorage.removeItem('adminToken')
    localStorage.removeItem('admin')
    router.push('/admin/login')
  }

  useEffect(() => {
    const checkAuth = () => {
      const adminData = localStorage.getItem('admin')
      if (adminData) {
        try {
          const parsed = JSON.parse(adminData)
          setAdmin(parsed)
          setLoading(false)
          // 立即获取未读消息数量
          fetchUnreadCount()
          // 立即发送一次心跳
          sendHeartbeat()
        } catch {
          localStorage.removeItem('admin')
          localStorage.removeItem('adminToken')
          router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`)
        }
      } else {
        router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`)
      }
    }
    
    checkAuth()

    // 每5秒自动刷新未读消息数量
    const unreadInterval = setInterval(fetchUnreadCount, 5000)
    
    // 每30秒发送一次心跳
    const heartbeatInterval = setInterval(sendHeartbeat, 30000)
    
    return () => {
      clearInterval(unreadInterval)
      clearInterval(heartbeatInterval)
    }
  }, [router, pathname])

  const handleLogout = () => {
    logoutAndClearStatus()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">正在跳转到登录页面...</p>
        </div>
      </div>
    )
  }

  return (
    <UnreadContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      <div className="min-h-screen flex">
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900/50 border-r border-white/5 transition-all duration-300 flex flex-col`}>
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">管理后台</h1>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors relative"
              >
                <item.icon className="w-5 h-5" />
                {sidebarOpen && <span>{item.label}</span>}
                {/* 在客服消息菜单上显示未读数量 */}
                {item.href === '/admin/chat' && unreadCount > 0 && (
                  <span className={`${sidebarOpen ? 'ml-auto' : 'absolute -top-1 -right-1'} min-w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center px-1`}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>退出登录</span>}
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <header className="bg-slate-900/50 border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="搜索..."
                  className="bg-slate-800/50 border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/admin/chat" className="relative text-gray-400 hover:text-white">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
              
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">{admin.username[0]}</span>
                </div>
                <span className="text-sm text-gray-300">{admin.username}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </header>

          <div className="flex-1 p-6 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </UnreadContext.Provider>
  )
}
