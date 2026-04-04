'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Users, MessageSquare, Package, TrendingUp, DollarSign,
  Loader2, ArrowRight, UserPlus, ShoppingCart, Clock,
  CheckCircle, AlertCircle
} from 'lucide-react'

interface Stats {
  users: {
    total: number
    newToday: number
  }
  orders: {
    total: number
    today: number
    pending: number
    processing: number
    completed: number
  }
  messages: {
    total: number
    today: number
  }
  revenue: {
    total: number
    thisMonth: number
  }
  services: {
    total: number
    active: number
  }
}

interface RecentOrder {
  id: string
  status: string
  amount: number
  createdAt: string
  user: { username: string }
  service: { name: string }
}

interface RecentMessage {
  id: string
  content: string
  sender: string
  createdAt: string
  user: { username: string }
}

interface RecentUser {
  id: string
  username: string
  email: string
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([])
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminAuth()
    fetchStats()
  }, [])

  const checkAdminAuth = () => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      router.push('/admin/login')
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
        setRecentOrders(data.recentOrders || [])
        setRecentMessages(data.recentMessages || [])
        setRecentUsers(data.recentUsers || [])
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'processing': return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完成'
      case 'processing': return '进行中'
      case 'pending': return '待处理'
      default: return status
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    return date.toLocaleDateString('zh-CN')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500">加载数据失败</p>
      </div>
    )
  }

  const statCards = [
    { 
      icon: Users, 
      label: '总用户', 
      value: stats.users.total.toLocaleString(), 
      change: `+${stats.users.newToday} 今日`, 
      color: 'from-blue-500 to-cyan-500',
      link: '/admin/users'
    },
    { 
      icon: MessageSquare, 
      label: '今日消息', 
      value: stats.messages.today.toString(), 
      change: `共 ${stats.messages.total} 条`, 
      color: 'from-green-500 to-emerald-500',
      link: '/admin/chat'
    },
    { 
      icon: Package, 
      label: '待处理订单', 
      value: stats.orders.pending.toString(), 
      change: `共 ${stats.orders.total} 个订单`, 
      color: 'from-orange-500 to-yellow-500',
      link: '/admin/orders'
    },
    { 
      icon: CheckCircle, 
      label: '已完成订单', 
      value: stats.orders.completed.toString(), 
      change: `共 ${stats.orders.total} 个订单`, 
      color: 'from-purple-500 to-pink-500',
      link: '/admin/orders'
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">仪表盘</h1>
        <p className="text-gray-400">欢迎回来，查看今日数据概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            href={stat.link}
            className="group bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/10 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {stat.change}
              </span>
            </div>
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold mt-1 text-white group-hover:text-blue-400 transition-colors">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* 快捷操作 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: UserPlus, label: '新增用户', value: stats.users.newToday, color: 'text-blue-400' },
          { icon: ShoppingCart, label: '今日订单', value: stats.orders.today, color: 'text-green-400' },
          { icon: Clock, label: '进行中', value: stats.orders.processing, color: 'text-yellow-400' },
          { icon: CheckCircle, label: '已完成', value: stats.orders.completed, color: 'text-purple-400' },
        ].map((item, index) => (
          <div key={index} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <item.icon className={`w-8 h-8 ${item.color}`} />
              <div>
                <p className="text-2xl font-bold text-white">{item.value}</p>
                <p className="text-gray-500 text-sm">{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近订单 */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">最近订单</h2>
            <Link href="/admin/orders" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
              查看全部 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">暂无订单</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{order.service.name}</p>
                      <p className="text-gray-500 text-xs">{order.user.username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 最近消息 */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">最近消息</h2>
            <Link href="/admin/chat" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
              查看全部 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentMessages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">暂无消息</p>
            ) : (
              recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm text-white font-medium">
                    {msg.user.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium text-sm">{msg.user.username}</p>
                      <span className="text-xs text-gray-500">{formatTime(msg.createdAt)}</span>
                    </div>
                    <p className="text-gray-400 text-sm truncate">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 最近注册用户 */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">最近注册用户</h2>
          <Link href="/admin/users" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
            查看全部 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentUsers.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center py-8">暂无新用户</p>
          ) : (
            recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-lg text-white font-medium">{user.username[0].toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{user.username}</p>
                  <p className="text-gray-500 text-sm truncate">{user.email}</p>
                </div>
                <span className="text-xs text-gray-500">{formatTime(user.createdAt)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 服务状态概览 */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">服务状态</h2>
          <Link href="/admin/services" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
            管理服务 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <p className="text-3xl font-bold text-white">{stats.services.total}</p>
            <p className="text-gray-500 text-sm mt-1">总服务数</p>
          </div>
          <div className="text-center p-4 bg-green-500/10 rounded-xl">
            <p className="text-3xl font-bold text-green-400">{stats.services.active}</p>
            <p className="text-gray-500 text-sm mt-1">启用中</p>
          </div>
          <div className="text-center p-4 bg-yellow-500/10 rounded-xl">
            <p className="text-3xl font-bold text-yellow-400">{stats.orders.pending}</p>
            <p className="text-gray-500 text-sm mt-1">待处理订单</p>
          </div>
          <div className="text-center p-4 bg-blue-500/10 rounded-xl">
            <p className="text-3xl font-bold text-blue-400">{stats.orders.processing}</p>
            <p className="text-gray-500 text-sm mt-1">进行中</p>
          </div>
        </div>
      </div>
    </div>
  )
}
