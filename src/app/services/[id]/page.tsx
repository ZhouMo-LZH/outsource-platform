'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, CheckCircle, Clock, Shield, MessageCircle, 
  Star, Zap, ChevronRight, Loader2, X
} from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string | null
  status: string
  createdAt: string
}

interface OrderFormData {
  account: string
  email: string
  phone: string
}

const features = [
  { icon: Shield, title: '品质保障', desc: '专业团队，严格质检' },
  { icon: Clock, title: '准时交付', desc: '按时完成，绝不拖延' },
  { icon: MessageCircle, title: '全程沟通', desc: '实时跟进，随时反馈' },
  { icon: Star, title: '售后支持', desc: '7x24小时技术支持' },
]

const processSteps = [
  { step: 1, title: '咨询沟通', desc: '了解需求，提供专业建议' },
  { step: 2, title: '确认订单', desc: '明确需求，签订合同' },
  { step: 3, title: '项目开发', desc: '专业团队高效执行' },
  { step: 4, title: '验收交付', desc: '测试验收，完美交付' },
]

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [creatingOrder, setCreatingOrder] = useState(false)
  const [user, setUser] = useState<{ id: string; username: string } | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [orderForm, setOrderForm] = useState<OrderFormData>({
    account: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchService()
  }, [])

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/services/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setService(data.service)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('获取服务详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenOrderModal = () => {
    if (!user) {
      router.push('/login')
      return
    }
    setShowOrderModal(true)
  }

  const handleCloseOrderModal = () => {
    setShowOrderModal(false)
    setOrderForm({ account: '', email: '', phone: '' })
  }

  const handleSubmitOrder = async () => {
    if (!service) return
    
    if (!orderForm.account.trim() || !orderForm.email.trim() || !orderForm.phone.trim()) {
      alert('请填写完整的联系信息')
      return
    }

    setCreatingOrder(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          serviceId: service.id,
          amount: service.price,
          description: `订购服务: ${service.name}`,
          contactInfo: {
            account: orderForm.account,
            email: orderForm.email,
            phone: orderForm.phone
          }
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setShowOrderModal(false)
        router.push('/dashboard?tab=orders')
      } else {
        const error = await res.json()
        alert(error.error || '创建订单失败')
      }
    } catch (error) {
      console.error('创建订单失败:', error)
      alert('网络错误，请重试')
    } finally {
      setCreatingOrder(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-gray-400">加载中...</div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <p className="text-gray-400 mb-4">服务不存在</p>
          <Link href="/" className="text-blue-400 hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '开发': return 'from-blue-500 to-cyan-500'
      case '设计': return 'from-purple-500 to-pink-500'
      case '部署': return 'from-green-500 to-teal-500'
      default: return 'from-orange-500 to-yellow-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                科技服务
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  我的账户
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                    登录
                  </Link>
                  <Link href="/register" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white text-sm font-medium">
                    注册
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className={`px-3 py-1 text-xs font-medium bg-gradient-to-r ${getCategoryColor(service.category)} text-white rounded-full`}>
                    {service.category}
                  </span>
                  <span className="text-gray-500 text-sm">
                    发布于 {new Date(service.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {service.name}
                </h1>
                
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  {service.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="text-center p-4 bg-white/5 rounded-xl">
                      <feature.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                      <h3 className="text-white font-medium text-sm mb-1">{feature.title}</h3>
                      <p className="text-gray-500 text-xs">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">服务流程</h2>
                <div className="space-y-6">
                  {processSteps.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">{item.step}</span>
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                        <p className="text-gray-500">{item.desc}</p>
                      </div>
                      {index < processSteps.length - 1 && (
                        <ChevronRight className="w-5 h-5 text-gray-600 hidden md:block" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">常见问题</h2>
                <div className="space-y-4">
                  {[
                    { q: '多久可以完成？', a: '根据项目复杂度，一般在3-15个工作日内完成。' },
                    { q: '是否提供售后服务？', a: '是的，我们提供7x24小时技术支持和免费维护期。' },
                    { q: '如何支付？', a: '支持支付宝、微信支付、银行转账等多种支付方式。' },
                    { q: '不满意可以退款吗？', a: '在项目进行过程中，如不满意可申请退款，具体按合同约定执行。' },
                  ].map((faq, index) => (
                    <div key={index} className="border-b border-white/5 last:border-0 pb-4 last:pb-0">
                      <h3 className="text-white font-medium mb-2">{faq.q}</h3>
                      <p className="text-gray-500">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 sticky top-24">
                <div className="space-y-3 mb-6">
                  {[
                    '专业团队一对一服务',
                    '免费需求分析',
                    '项目源码交付',
                    '7x24小时技术支持',
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleOpenOrderModal}
                  disabled={creatingOrder}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-semibold hover:from-blue-400 hover:to-purple-400 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {creatingOrder ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    <>
                      立即下单
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <Link
                  href="/chat"
                  className="w-full mt-3 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  在线咨询
                </Link>

                <p className="text-center text-gray-500 text-xs mt-4">
                  下单即表示同意我们的服务条款
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 订单信息弹窗 */}
      {showOrderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseOrderModal}
          />
          <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <button
              onClick={handleCloseOrderModal}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-2">确认订单信息</h2>
            <p className="text-gray-400 text-sm mb-6">请填写您的联系信息，方便我们与您沟通</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  账户名称 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={orderForm.account}
                  onChange={(e) => setOrderForm({ ...orderForm, account: e.target.value })}
                  placeholder="请输入您的账户名称"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  QQ邮箱 <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={orderForm.email}
                  onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                  placeholder="请输入您的QQ邮箱"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  手机号码 <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                  placeholder="请输入您的手机号码"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-white/5 rounded-xl">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">服务名称</span>
                <span className="text-white font-medium">{service?.name}</span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseOrderModal}
                className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleSubmitOrder}
                disabled={creatingOrder}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium hover:from-blue-400 hover:to-purple-400 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {creatingOrder ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    提交中...
                  </>
                ) : (
                  '确认提交'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
