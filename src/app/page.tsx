'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Code, GraduationCap, Palette, Rocket,
  ChevronRight, Star, Zap, ArrowRight,
  MessageCircle, Users, Clock, Award, CheckCircle2,
  Mail, Phone, X, Loader2, User
} from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'

const services = [
  {
    icon: Code,
    title: 'OpenClash部署',
    description: '专业部署OpenClash，稳定高速，一键配置',
    color: 'from-cyan-500 to-blue-600',
    features: ['稳定高速', '一键配置', '多设备支持', '24/7技术支持'],
    stats: { users: '1000+', rating: '4.9' }
  },
  {
    icon: GraduationCap,
    title: '毕设代做',
    description: '本科/研究生毕业设计，全程指导，包过答辩',
    color: 'from-purple-500 to-pink-600',
    features: ['全程指导', '包过答辩', '源码文档', '售后保障'],
    stats: { users: '500+', rating: '4.8' }
  },
  {
    icon: Palette,
    title: '网站设计',
    description: '企业官网、电商平台、个人博客定制开发',
    color: 'from-orange-500 to-red-600',
    features: ['响应式设计', 'SEO优化', '售后维护', '源码交付'],
    stats: { users: '300+', rating: '4.9' }
  },
  {
    icon: Rocket,
    title: 'APP开发',
    description: 'iOS/Android原生开发，跨平台开发，小程序开发',
    color: 'from-green-500 to-emerald-600',
    features: ['原生开发', '跨平台', '全栈方案', '上线支持'],
    stats: { users: '200+', rating: '4.7' }
  },
]

const stats = [
  { value: '2000+', label: '成功案例', icon: CheckCircle2 },
  { value: '98%', label: '客户满意度', icon: Star },
  { value: '24/7', label: '在线支持', icon: Clock },
  { value: '5年+', label: '行业经验', icon: Award },
]

export default function Home() {
  const router = useRouter()
  const { user: authUser } = useAuth()

  const [user, setUser] = useState<{ id: string; username: string; email: string; phone?: string } | null>(null)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null)
  const [orderForm, setOrderForm] = useState({
    username: '',
    email: '',
    phone: '',
    remark: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (authUser) {
      setUser(authUser)
      setOrderForm({
        username: authUser.username || '',
        email: authUser.email || '',
        phone: authUser.phone || '',
        remark: ''
      })
    }
  }, [authUser])

  const handleServiceSubmit = async () => {
    if (!selectedService) return

    if (!orderForm.username.trim() || !orderForm.email.trim() || !orderForm.phone.trim()) {
      alert('请填写完整的联系信息')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'guest',
          serviceId: selectedService.title,
          amount: 0,
          description: `首页服务咨询: ${selectedService.title}`,
          contactInfo: {
            username: orderForm.username,
            email: orderForm.email,
            phone: orderForm.phone,
            remark: orderForm.remark
          }
        }),
      })

      if (res.ok) {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com',
            subject: `新服务咨询 - ${selectedService.title}`,
            content: `新服务咨询：${selectedService.title}\n姓名：${orderForm.username}\n邮箱：${orderForm.email}\n电话：${orderForm.phone}\n备注：${orderForm.remark || '无'}`
          }),
        })

        alert('提交成功！我们会尽快与您联系')
        setShowServiceModal(false)
        setOrderForm({ username: '', email: '', phone: '', remark: '' })
      } else {
        alert('提交失败，请重试')
      }
    } catch (error) {
      console.error('提交错误:', error)
      alert('网络错误，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">周末</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-300 hover:text-white transition-colors">服务项目</a>
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">核心优势</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">客户评价</a>
              <Link href="/chat" className="flex items-center gap-1 text-gray-300 hover:text-white">
                <MessageCircle className="w-4 h-4" />
                在线咨询
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Link href="/dashboard" className="px-4 py-2 text-gray-300 hover:text-white text-sm">
                    个人中心
                  </Link>
                  <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-sm text-white font-medium">{user.username[0].toUpperCase()}</span>
                    </div>
                    <span className="hidden sm:block text-sm text-gray-300">{user.username}</span>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 text-gray-300 hover:text-white text-sm">登录</Link>
                  <Link href="/register" className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium text-sm hover:from-blue-400 hover:to-purple-400 transition-all">
                    注册
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto text-center w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full mb-8 backdrop-blur-sm border border-white/10">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">专业团队 · 品质保障 · 售后无忧</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              科技赋能
            </span>
            <br />
            <span className="text-white">服务平台</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            提供软件开发、毕设代做、网站设计等专业服务
            <br />
            一站式解决方案，助力您的数字化转型
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/chat" className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/25">
              <MessageCircle className="w-5 h-5" />
              在线咨询
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full mb-6 backdrop-blur-sm border border-white/10">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">专业服务</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              我们的<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">服务</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              专业团队，品质保障，为您提供一站式解决方案
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedService(service)
                  setShowServiceModal(true)
                }}
                className="group relative bg-white/[0.02] backdrop-blur-md rounded-2xl p-6 cursor-pointer border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:bg-white/[0.05]"
              >
                {index === 1 && (
                  <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs text-white font-medium">
                    热门
                  </div>
                )}

                <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {service.description}
                </p>

                <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {service.stats.users}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    {service.stats.rating}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {service.features.map((feature, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-white/5 rounded-full text-gray-400 border border-white/5">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-white/5">
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full mb-6 backdrop-blur-sm border border-white/10">
              <Award className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">核心优势</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              为什么选择<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">我们</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: '安全可靠', desc: '数据加密存储，严格隐私保护', gradient: 'from-blue-500 to-cyan-500' },
              { icon: Rocket, title: '快速交付', desc: '专业团队高效开发，按时交付', gradient: 'from-purple-500 to-pink-500' },
              { icon: MessageCircle, title: '全程沟通', desc: '一对一专属服务，实时在线沟通', gradient: 'from-orange-500 to-yellow-500' },
              { icon: Users, title: '专业团队', desc: '资深开发工程师，平均5年以上经验', gradient: 'from-green-500 to-emerald-500' },
              { icon: Lightbulb, title: '创新方案', desc: '紧跟技术前沿，提供创新解决方案', gradient: 'from-red-500 to-pink-500' },
              { icon: Target, title: '精准定位', desc: '量身定制解决方案，精准满足需求', gradient: 'from-indigo-500 to-purple-500' },
            ].map((feature, index) => (
              <div key={index} className="group bg-white/[0.02] backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-16 h-16 mb-6 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full mb-6 backdrop-blur-sm border border-white/10">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-sm text-gray-300">客户评价</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              客户的<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">声音</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: '张先生', role: '创业公司CEO', content: '服务非常专业，项目按时交付，质量超出预期。强烈推荐！', avatar: 'Z', rating: 5 },
              { name: '李同学', role: '大学毕业生', content: '毕设代做服务太棒了，老师很满意，答辩一次通过。感谢团队！', avatar: 'L', rating: 5 },
              { name: '王经理', role: '电商运营', content: '网站设计非常精美，SEO优化效果明显，流量提升了200%。', avatar: 'W', rating: 5 },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/[0.02] backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <Link href="/" className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">周末平台</span>
              </Link>
              <p className="text-gray-500 text-sm mb-6">
                专业的软件开发与技术服务提供商
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">快速链接</h4>
              <ul className="space-y-3">
                {['服务项目', '案例展示', '联系我们'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-500 hover:text-white transition-colors text-sm">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">服务项目</h4>
              <ul className="space-y-3">
                {['OpenClash部署', '毕设代做', '网站设计', 'APP开发'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-500 hover:text-white transition-colors text-sm">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">联系方式</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-500 text-sm">
                  <Mail className="w-4 h-4" />
                  2962938198@qq.com
                </li>
                <li className="flex items-center gap-2 text-gray-500 text-sm">
                  <Phone className="w-4 h-4" />
                  18111005880
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} 周末平台. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Service Modal */}
      {showServiceModal && selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowServiceModal(false)}
          />
          <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowServiceModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">咨询服务</h2>
              <p className="text-gray-400 text-sm">服务: <span className="text-blue-400">{selectedService.title}</span></p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  用户名 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={orderForm.username}
                  onChange={(e) => setOrderForm({ ...orderForm, username: e.target.value })}
                  placeholder="请输入您的用户名"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  邮箱 <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={orderForm.email}
                  onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                  placeholder="请输入您的邮箱"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  备注信息
                </label>
                <textarea
                  value={orderForm.remark}
                  onChange={(e) => setOrderForm({ ...orderForm, remark: e.target.value })}
                  placeholder="请描述您的需求或问题（选填）"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-white/5 rounded-xl">
              <p className="text-sm text-gray-400 mb-2">服务信息</p>
              <div className="text-white font-medium">{selectedService.title}</div>
              <p className="text-xs text-gray-500 mt-2">{selectedService.description}</p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowServiceModal(false)}
                className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleServiceSubmit}
                disabled={submitting}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium hover:from-blue-400 hover:to-purple-400 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    提交中...
                  </>
                ) : (
                  '提交咨询'
                )}
              </button>
            </div>

            {!user && (
              <p className="text-center text-xs text-gray-500 mt-4">
                已有账号？<Link href="/login" className="text-blue-400 hover:underline">登录后可自动填充信息</Link>
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

function Shield(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}

function Lightbulb(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
      <path d="M9 18h6"/>
      <path d="M10 22h4"/>
    </svg>
  )
}

function Target(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  )
}

function Heart(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
  )
}
