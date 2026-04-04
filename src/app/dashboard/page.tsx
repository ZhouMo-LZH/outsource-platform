'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, Package, MessageCircle, Settings, LogOut, 
  ChevronRight, Lock, Eye, EyeOff, X, CheckCircle,
  Zap, CreditCard, Clock, TrendingUp, Sparkles,
  Bell, Shield, Wallet, FileText, ArrowUpRight, Mail
} from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  price: number
  category: string
}

interface Order {
  id: string
  status: string
  amount: number
  description: string | null
  createdAt: string
  service: {
    name: string
  }
}

interface Message {
  id: string
  content: string
  sender: string
  isRead: boolean
  createdAt: string
}

const menuItems = [
  { id: 'overview', icon: TrendingUp, label: '概览', color: 'from-blue-500 to-cyan-500' },
  { id: 'orders', icon: Package, label: '我的订单', color: 'from-purple-500 to-pink-500' },
  { id: 'messages', icon: MessageCircle, label: '客服消息', color: 'from-green-500 to-emerald-500' },
  { id: 'settings', icon: Settings, label: '账号设置', color: 'from-orange-500 to-yellow-500' },
]

const quickActions = [
  { icon: MessageCircle, label: '在线咨询', description: '与客服实时沟通', color: 'from-blue-500 to-cyan-500', href: '/chat' },
  { icon: Package, label: '我的订单', description: '查看订单状态', color: 'from-purple-500 to-pink-500', href: '#', onClick: 'orders' },
  { icon: FileText, label: '服务文档', description: '查看文档资料', color: 'from-green-500 to-emerald-500', href: '#' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; username: string; email: string } | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsed = JSON.parse(userData)
      setUser(parsed)
      fetchServices()
    } else {
      router.push('/login')
    }
  }, [router])

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services')
      const data = await res.json()
      setServices(data.services || [])
    } catch (error) {
      console.error('获取服务失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('新密码至少6位')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('两次密码不一致')
      return
    }

    setPasswordLoading(true)
    setPasswordError('')

    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setPasswordSuccess(true)
        setTimeout(() => {
          setShowPasswordModal(false)
          setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
          setPasswordSuccess(false)
        }, 1500)
      } else {
        setPasswordError(data.error || '修改失败')
      }
    } catch {
      setPasswordError('网络错误')
    } finally {
      setPasswordLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-gray-400">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center 
                              group-hover:scale-110 transition-all duration-300 shadow-lg shadow-primary-500/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">周末</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/chat" className="p-2 hover:bg-white/10 rounded-lg transition-colors relative">
                <MessageCircle className="w-5 h-5 text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-400" />
              </button>
              <div className="flex items-center gap-2 pl-4 border-l border-white/10">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  <span className="text-sm text-white font-medium">{user.username[0].toUpperCase()}</span>
                </div>
                <span className="hidden sm:block text-sm text-gray-300">{user.username}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="glass rounded-2xl p-6 sticky top-28">
                {/* User Info */}
                <div className="flex items-center gap-4 p-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl text-white font-bold">{user.username[0].toUpperCase()}</span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-white truncate">{user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-white border border-primary-500/30'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-base">{item.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-all mt-6"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <span className="text-base">退出登录</span>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Welcome */}
                  <div className={`glass rounded-2xl p-8 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                      <span className="text-base text-gray-400">欢迎回来</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-3">
                      你好，<span className="text-gradient">{user.username}</span>
                    </h1>
                    <p className="text-gray-400 text-lg">探索我们的服务，开启您的数字化之旅</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quickActions.map((action, index) => (
                      <Link
                        key={index}
                        href={action.href}
                        onClick={action.onClick ? () => setActiveTab(action.onClick) : undefined}
                        className="group glass rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300 card-hover"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center 
                                          group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                            <action.icon className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-lg truncate">{action.label}</h3>
                            <p className="text-base text-gray-500 truncate">{action.description}</p>
                          </div>
                          <ChevronRight className="w-6 h-6 text-gray-500 group-hover:translate-x-1 group-hover:text-primary-400 transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { label: '进行中订单', value: orders.filter(o => o.status === 'processing').length.toString(), icon: Package, color: 'from-blue-500 to-cyan-500' },
                      { label: '未读消息', value: messages.filter(m => !m.isRead).length.toString(), icon: MessageCircle, color: 'from-purple-500 to-pink-500' },
                    ].map((stat, index) => (
                      <div key={index} className="glass rounded-2xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-gray-400 text-base">{stat.label}</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Services */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-white">热门服务</h2>
                      <Link href="#" className="text-base text-primary-400 hover:text-primary-300 flex items-center gap-1">
                        查看全部 <ArrowUpRight className="w-5 h-5" />
                      </Link>
                    </div>
                    {loading ? (
                      <div className="text-center py-16 text-gray-500 text-lg">加载中...</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.slice(0, 3).map((service, index) => (
                          <div
                            key={service.id}
                            className="group glass rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300 card-hover cursor-pointer"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <h3 className="font-semibold text-white text-lg group-hover:text-gradient transition-all">{service.name}</h3>
                              <span className="text-sm text-gray-500 bg-white/5 px-3 py-1 rounded-lg">{service.category}</span>
                            </div>
                            <p className="text-gray-500 text-base mb-6 line-clamp-2">{service.description}</p>
                            <div className="flex items-center justify-end">
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center 
                                              group-hover:bg-primary-500/20 transition-all">
                                <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-primary-400" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-8">
                  <div className="glass rounded-2xl p-8">
                    <h1 className="text-2xl font-bold text-white mb-6">我的订单</h1>
                    
                    {orders.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                          <Package className="w-10 h-10 text-gray-600" />
                        </div>
                        <p className="text-gray-500 mb-4">暂无订单</p>
                        <Link href="/chat" className="btn-glow inline-flex items-center gap-2">
                          立即咨询下单
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="glass rounded-xl p-5 hover:bg-white/[0.04] transition-all">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold text-white">{order.service.name}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>订单号: {order.id}</span>
                              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <div className="space-y-8">
                  <div className="glass rounded-2xl p-8">
                    <h1 className="text-2xl font-bold text-white mb-6">客服消息</h1>
                    
                    {messages.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-10 h-10 text-gray-600" />
                        </div>
                        <p className="text-gray-500 mb-4">暂无消息记录</p>
                        <Link href="/chat" className="btn-glow inline-flex items-center gap-2">
                          开始对话
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                              message.sender === 'user'
                                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-br-md'
                                : 'glass rounded-bl-md'
                            }`}>
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-60 mt-1">
                                {new Date(message.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link href="/chat" className="btn-primary inline-flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    继续对话
                  </Link>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-8">
                  <div className="glass rounded-2xl p-8">
                    <h1 className="text-2xl font-bold text-white mb-6">账号设置</h1>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-5 bg-white/[0.03] rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">用户名</p>
                            <p className="text-white font-medium">{user.username}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-5 bg-white/[0.03] rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center">
                            <Mail className="w-6 h-6 text-accent-400" />
                          </div>
                          <div>
                            <p className="text-base text-gray-400 mb-1">邮箱</p>
                            <p className="text-white font-medium text-lg">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-5 bg-white/[0.03] rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                            <Lock className="w-6 h-6 text-orange-400" />
                          </div>
                          <div>
                            <p className="text-base text-gray-400 mb-1">密码</p>
                            <p className="text-white font-medium text-lg">••••••••</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowPasswordModal(true)}
                          className="btn-glow text-base px-6 py-3"
                        >
                          修改密码
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="glass rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">账号安全</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-5 bg-white/[0.03] rounded-xl">
                        <div className="flex items-center gap-4">
                          <Shield className="w-6 h-6 text-green-400" />
                          <span className="text-gray-300 text-lg">登录保护</span>
                        </div>
                        <span className="text-green-400 text-base flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" /> 已开启
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-5 bg-white/[0.03] rounded-xl">
                        <div className="flex items-center gap-4">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                          <span className="text-gray-300 text-lg">邮箱验证</span>
                        </div>
                        <span className="text-green-400 text-base flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" /> 已验证
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-elevated rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">修改密码</h2>
              <button
                onClick={() => {
                  setShowPasswordModal(false)
                  setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
                  setPasswordError('')
                  setPasswordSuccess(false)
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {passwordSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-white font-medium">密码修改成功</p>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                {passwordError && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm text-center">
                    {passwordError}
                  </div>
                )}

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    placeholder="原密码"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 
                             focus:border-primary-400 focus:bg-white/10 outline-none transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="新密码（至少6位）"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 
                             focus:border-primary-400 focus:bg-white/10 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="确认新密码"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 
                             focus:border-primary-400 focus:bg-white/10 outline-none transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium 
                           hover:from-primary-400 hover:to-accent-400 transition-all disabled:opacity-70"
                >
                  {passwordLoading ? '修改中...' : '确认修改'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
