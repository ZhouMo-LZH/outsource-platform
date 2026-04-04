'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { 
  Code, GraduationCap, Palette, Rocket, Shield, MessageCircle, 
  ChevronRight, Star, Zap, ArrowRight, Sparkles, Cpu, Globe,
  TrendingUp, Clock, Award, CheckCircle2, Users, Lightbulb,
  Target, Heart, Mail, Phone, MapPin, Github, Twitter, Linkedin,
  X, Loader2, User
} from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'

const services = [
  {
    icon: Code,
    title: 'OpenClash部署',
    description: '专业部署OpenClash，稳定高速，一键配置，支持多设备同时连接，让您畅享无阻网络体验',
    color: 'from-cyan-500 to-blue-600',
    features: ['稳定高速', '一键配置', '多设备支持', '24/7技术支持'],
    stats: { users: '1000+', rating: '4.9' }
  },
  {
    icon: GraduationCap,
    title: '毕设代做',
    description: '本科/研究生毕业设计，全程指导，包过答辩，提供完整源码和文档，让您轻松毕业',
    color: 'from-purple-500 to-pink-600',
    features: ['全程指导', '包过答辩', '源码文档', '售后保障'],
    stats: { users: '500+', rating: '4.8' }
  },
  {
    icon: Palette,
    title: '网站设计',
    description: '企业官网、电商平台、个人博客定制开发，响应式设计，SEO优化，提升品牌形象',
    color: 'from-orange-500 to-red-600',
    features: ['响应式设计', 'SEO优化', '售后维护', '源码交付'],
    stats: { users: '300+', rating: '4.9' }
  },
  {
    icon: Rocket,
    title: 'APP开发',
    description: 'iOS/Android原生开发，跨平台开发，小程序开发，全栈解决方案，助力业务增长',
    color: 'from-green-500 to-emerald-600',
    features: ['原生开发', '跨平台', '全栈方案', '上线支持'],
    stats: { users: '200+', rating: '4.7' }
  },
]

const stats = [
  { value: '2000+', label: '成功案例', icon: CheckCircle2, suffix: '+' },
  { value: '98', label: '客户满意度', icon: Star, suffix: '%' },
  { value: '24', label: '在线支持', icon: Clock, suffix: '/7' },
  { value: '5', label: '行业经验', icon: Award, suffix: '年+' },
]

const features = [
  { 
    icon: Shield, 
    title: '安全可靠', 
    description: '数据加密存储，严格隐私保护，交易全程安全保障，让您无后顾之忧',
    gradient: 'from-blue-500 to-cyan-500',
    delay: 0
  },
  { 
    icon: Rocket, 
    title: '快速交付', 
    description: '专业团队高效开发，严格项目管理，按时交付高质量成果，不拖延不敷衍',
    gradient: 'from-purple-500 to-pink-500',
    delay: 0.1
  },
  { 
    icon: MessageCircle, 
    title: '全程沟通', 
    description: '一对一专属服务，实时在线沟通，随时了解项目最新进度，透明高效',
    gradient: 'from-orange-500 to-yellow-500',
    delay: 0.2
  },
  { 
    icon: Users, 
    title: '专业团队', 
    description: '资深开发工程师组成的技术团队，平均5年以上行业经验，技术过硬',
    gradient: 'from-green-500 to-emerald-500',
    delay: 0.3
  },
  { 
    icon: Lightbulb, 
    title: '创新方案', 
    description: '紧跟技术前沿，提供创新解决方案，让您的项目始终保持竞争力',
    gradient: 'from-red-500 to-pink-500',
    delay: 0.4
  },
  { 
    icon: Target, 
    title: '精准定位', 
    description: '深入了解您的需求，提供量身定制的解决方案，精准满足业务目标',
    gradient: 'from-indigo-500 to-purple-500',
    delay: 0.5
  },
]

const testimonials = [
  {
    name: '张先生',
    role: '创业公司CEO',
    content: '服务非常专业，项目按时交付，质量超出预期。强烈推荐给需要技术支持的创业者！',
    avatar: 'Z',
    rating: 5
  },
  {
    name: '李同学',
    role: '大学毕业生',
    content: '毕设代做服务太棒了，老师很满意，答辩一次通过。感谢团队的帮助！',
    avatar: 'L',
    rating: 5
  },
  {
    name: '王经理',
    role: '电商运营',
    content: '网站设计非常精美，SEO优化效果明显，流量提升了200%。合作非常愉快！',
    avatar: 'W',
    rating: 5
  },
]

// Animated Counter Component
function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const numericValue = parseInt(value.replace(/\D/g, ''))
  const suffixText = value.replace(/\d/g, '')
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )
    
    if (ref.current) {
      observer.observe(ref.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  useEffect(() => {
    if (!isVisible) return
    
    const duration = 2000
    const steps = 60
    const increment = numericValue / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= numericValue) {
        setCount(numericValue)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [isVisible, numericValue])
  
  return <span ref={ref}>{count}{suffixText}{suffix}</span>
}

// Particle Background Component
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let animationId: number
    let particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      color: string
    }> = []
    
    const colors = ['rgba(14, 165, 233,', 'rgba(168, 85, 247,', 'rgba(56, 189, 248,']
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    const createParticles = () => {
      particles = []
      const count = Math.floor((canvas.width * canvas.height) / 12000)
      for (let i = 0; i < count; i++) {
        const colorBase = colors[Math.floor(Math.random() * colors.length)]
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.4 + 0.1,
          color: colorBase
        })
      }
    }
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color} ${p.opacity})`
        ctx.fill()
        
        // Draw connections
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(14, 165, 233, ${0.08 * (1 - dist / 120)})`
            ctx.stroke()
          }
        })
      })
      
      animationId = requestAnimationFrame(draw)
    }
    
    resize()
    createParticles()
    draw()
    
    window.addEventListener('resize', () => {
      resize()
      createParticles()
    })
    
    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  )
}

// Service Card Component with 3D Effect
function ServiceCard({ service, index, onClick }: { service: typeof services[0]; index: number; onClick?: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    setRotateX((y - centerY) / 20)
    setRotateY((centerX - x) / 20)
    
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
  }
  
  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d'
      }}
      className="group relative glass-card rounded-2xl p-6 cursor-pointer overflow-hidden"
    >
      {/* Glow Effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(14, 165, 233, 0.15), transparent 40%)`
        }}
      />
      
      {/* Popular Badge */}
      {index === 1 && (
        <div className="absolute top-4 right-4">
          <span className="badge-accent">热门</span>
        </div>
      )}
      
      {/* Icon */}
      <motion.div 
        className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <service.icon className="w-7 h-7 text-white" />
      </motion.div>
      
      {/* Content */}
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gradient transition-all duration-300">
        {service.title}
      </h3>
      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
        {service.description}
      </p>
      
      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {service.stats.users}用户
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500" />
          {service.stats.rating}分
        </span>
      </div>
      
      {/* Features */}
      <div className="flex flex-wrap gap-2 mb-4">
        {service.features.map((feature, i) => (
          <span key={i} className="text-xs px-2 py-1 bg-white/5 rounded-full text-gray-400 border border-white/5">
            {feature}
          </span>
        ))}
      </div>
      
      {/* Action */}
      <div className="flex items-center justify-end pt-4 border-t border-white/5">
        <motion.div 
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10"
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(14, 165, 233, 0.2)' }}
        >
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-400 transition-colors" />
        </motion.div>
      </div>
    </motion.div>
  )
}

// Feature Card Component
function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: feature.delay }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden"
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      
      {/* Icon */}
      <motion.div 
        className={`w-16 h-16 mb-6 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg relative z-10`}
        whileHover={{ scale: 1.1, rotate: 3 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <feature.icon className="w-8 h-8 text-white" />
      </motion.div>
      
      {/* Content */}
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gradient transition-all duration-300 relative z-10">
        {feature.title}
      </h3>
      <p className="text-gray-400 leading-relaxed relative z-10">
        {feature.description}
      </p>
      
      {/* Hover Glow */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  )
}

// Testimonial Card Component
function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card rounded-2xl p-6 relative"
    >
      {/* Quote Icon */}
      <div className="absolute top-4 right-4 text-primary-500/20">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
      </div>
      
      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        ))}
      </div>
      
      {/* Content */}
      <p className="text-gray-300 mb-6 leading-relaxed">
        "{testimonial.content}"
      </p>
      
      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
          {testimonial.avatar}
        </div>
        <div>
          <div className="text-white font-semibold">{testimonial.name}</div>
          <div className="text-gray-500 text-sm">{testimonial.role}</div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  // 使用 AuthProvider
  const { user: authUser } = useAuth()
  
  // 服务弹窗状态
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null)
  const [user, setUser] = useState<{ id: string; username: string; email: string; phone?: string } | null>(null)
  const [orderForm, setOrderForm] = useState({
    username: '',
    email: '',
    phone: '',
    remark: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    setIsVisible(true)
    // 使用 AuthProvider 的用户信息
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

  // 服务消息模板 - 根据不同服务生成对应的提醒信息
  const getServiceMessage = (serviceTitle: string) => {
    const messages: Record<string, string> = {
      'OpenClash部署': `【OpenClash部署服务咨询】
用户需要部署 OpenClash 服务，请确认以下信息：
1. 用户设备类型（路由器/软路由/其他）
2. 网络环境（运营商类型）
3. 需要的节点类型（免费/付费）
4. 是否需要远程协助`,
      '毕设代做': `【毕业设计代做服务咨询】
用户需要毕设代做服务，请确认以下信息：
1. 学历层次（本科/专科/研究生）
2. 专业方向
3. 具体题目或需求描述
4. 截止时间`,
      '网站设计': `【网站设计服务咨询】
用户需要网站设计服务，请确认以下信息：
1. 网站类型（企业官网/电商/博客/其他）
2. 设计风格偏好
3. 功能需求（是否需要后台管理、支付等）
4. 预算范围和时间要求`,
      'APP开发': `【APP开发服务咨询】
用户需要APP开发服务，请确认以下信息：
1. 平台类型（iOS/Android/小程序/H5）
2. 核心功能需求
3. 是否需要后端服务
4. 参考竞品或设计稿`
    }
    return messages[serviceTitle] || `【${serviceTitle}服务咨询】`
  }

  // 处理服务订单提交
  const handleServiceSubmit = async () => {
    if (!selectedService) return
    
    // 验证表单
    if (!orderForm.username.trim() || !orderForm.email.trim() || !orderForm.phone.trim()) {
      alert('请填写完整的联系信息')
      return
    }

    setSubmitting(true)
    try {
      // 发送订单到后端
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
        // 获取对应服务的消息模板
        const serviceMsg = getServiceMessage(selectedService.title)
        
        // 发送邮件到管理员
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com',
            subject: `新服务咨询 - ${selectedService.title} - ${orderForm.username}`,
            content: `
═══════════════════════════════════════
📋 新服务咨询通知
═══════════════════════════════════════

📦 服务名称：${selectedService.title}

👤 用户信息
   姓名：${orderForm.username}
   邮箱：${orderForm.email}
   电话：${orderForm.phone}

📝 备注信息
   ${orderForm.remark || '无'}

⏰ 提交时间：${new Date().toLocaleString()}

───────────────────────────────────────
🔔 客服处理指引
${serviceMsg}
───────────────────────────────────────
            `.trim()
          }),
        })
        
        alert('提交成功！我们会尽快与您联系')
        setShowServiceModal(false)
        setOrderForm({ username: '', email: '', phone: '', remark: '' })
      } else {
        const error = await res.json()
        alert(error.error || '提交失败，请重试')
      }
    } catch (error) {
      console.error('提交错误:', error)
      alert('网络错误，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  // 关闭弹窗时重置表单
  const handleCloseModal = () => {
    setShowServiceModal(false)
    setSelectedService(null)
    if (user) {
      setOrderForm({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        remark: ''
      })
    } else {
      setOrderForm({ username: '', email: '', phone: '', remark: '' })
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 origin-left z-[100]"
        style={{ scaleX }}
      />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-accent-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-primary-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        <ParticleBackground />
        <div className="absolute inset-0 grid-pattern opacity-50" />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 glass-dark"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Zap className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold text-gradient">
                周末
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              {['服务项目', '关于我们', '核心优势', '客户评价'].map((item, i) => (
                <motion.a 
                  key={item}
                  href={`#${['services', 'about', 'features', 'testimonials'][i]}`}
                  className="nav-link"
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
              <Link href="/chat" className="nav-link flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                在线咨询
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium">
                    <User className="w-4 h-4" />
                    个人中心
                  </Link>
                  <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                      <span className="text-sm text-white font-medium">{user.username[0].toUpperCase()}</span>
                    </div>
                    <span className="hidden sm:block text-sm text-gray-300">{user.username}</span>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="hidden sm:block px-4 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium">
                    登录
                  </Link>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/register" className="btn-primary text-sm py-2.5 px-5">
                      <span className="relative z-10">注册</span>
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">专业团队 · 品质保障 · 售后无忧</span>
          </motion.div>
          
          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="text-gradient-animated">科技赋能</span>
            <br />
            <span className="text-white">服务平台</span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            提供软件开发、毕设代做、网站设计等专业服务
            <br className="hidden md:block" />
            一站式解决方案，助力您的数字化转型
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/chat" className="btn-primary group inline-flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                在线咨询
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Floating Elements */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: Code, label: '软件开发', color: 'from-cyan-500 to-blue-500', delay: 0 },
                { icon: Globe, label: '网站设计', color: 'from-purple-500 to-pink-500', delay: 0.1 },
                { icon: Cpu, label: '系统部署', color: 'from-orange-500 to-red-500', delay: 0.2 },
                { icon: TrendingUp, label: '数据分析', color: 'from-green-500 to-emerald-500', delay: 0.3 },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + item.delay }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="glass-card rounded-2xl p-6 group cursor-pointer"
                >
                  <motion.div 
                    className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: 5 }}
                  >
                    <item.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <p className="text-sm text-gray-300 font-medium">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-elevated rounded-3xl p-8 md:p-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <motion.div 
                    className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <stat.icon className="w-7 h-7 text-primary-400" />
                  </motion.div>
                  <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-gray-300">专业服务</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              我们的<span className="text-gradient">服务</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              专业团队，品质保障，为您提供一站式解决方案
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <ServiceCard 
                key={index} 
                service={service} 
                index={index} 
                onClick={() => {
                  setSelectedService(service)
                  setShowServiceModal(true)
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6">
              <Award className="w-4 h-4 text-accent-400" />
              <span className="text-sm text-gray-300">核心优势</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              为什么选择<span className="text-gradient">我们</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              我们不仅仅是服务提供商，更是您数字化转型的合作伙伴
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section-padding relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-sm text-gray-300">客户评价</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              客户的<span className="text-gradient">声音</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              听听他们怎么说
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">周末平台</span>
              </Link>
              <p className="text-gray-500 text-sm mb-6">
                专业的软件开发与技术服务提供商，致力于为企业提供高质量的数字化解决方案。
              </p>
              <div className="flex gap-4">
                {[Github, Twitter, Linkedin].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">快速链接</h4>
              <ul className="space-y-3">
                {['关于我们', '服务项目', '案例展示', '联系我们'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-500 hover:text-white transition-colors text-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Services */}
            <div>
              <h4 className="text-white font-semibold mb-4">服务项目</h4>
              <ul className="space-y-3">
                {['OpenClash部署', '毕设代做', '网站设计', 'APP开发'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-500 hover:text-white transition-colors text-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact */}
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
          
          {/* Bottom */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} 周末平台. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="#" className="hover:text-white transition-colors">服务条款</Link>
              <Link href="#" className="hover:text-white transition-colors">隐私政策</Link>
              <Link href="#" className="hover:text-white transition-colors">帮助中心</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* 服务咨询弹窗 */}
      {showServiceModal && selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">咨询服务</h2>
              <p className="text-gray-400 text-sm">服务: <span className="text-primary-400">{selectedService.title}</span></p>
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  备注信息
                </label>
                <textarea
                  value={orderForm.remark}
                  onChange={(e) => setOrderForm({ ...orderForm, remark: e.target.value })}
                  placeholder="请描述您的需求或问题（选填）"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                />
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-white/5 rounded-xl">
              <p className="text-sm text-gray-400 mb-2">服务信息</p>
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">{selectedService.title}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">{selectedService.description}</p>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseModal}
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
                已有账号？<Link href="/login" className="text-primary-400 hover:underline">登录后可自动填充信息</Link>
              </p>
            )}
          </motion.div>
        </div>
      )}
    </main>
  )
}
