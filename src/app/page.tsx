'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView, Variants } from 'framer-motion'
import {
  Code, GraduationCap, Palette, Rocket, Zap, MessageCircle, ArrowRight,
  Star, Clock, Award, CheckCircle2, Users, Mail, Phone, X, Loader2,
  Sparkles, Shield, Globe, Cpu, ChevronRight, Play, TrendingUp,
  BarChart3, Layers, Lightbulb, Target
} from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'

const easeOut = [0.23, 1, 0.32, 1] as [number, number, number, number]

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } }
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: easeOut } }
}

const services = [
  {
    icon: Code,
    title: 'OpenClash部署',
    description: '专业部署OpenClash，稳定高速，一键配置，支持多设备同时使用',
    color: 'from-cyan-500 to-blue-600',
    features: ['稳定高速', '一键配置', '多设备支持', '24/7技术支持'],
    stats: { users: '1000+', rating: '4.9' },
    gradient: 'from-cyan-500/20 to-blue-600/20'
  },
  {
    icon: GraduationCap,
    title: '毕设代做',
    description: '本科/研究生毕业设计，全程指导，包过答辩，源码文档齐全',
    color: 'from-purple-500 to-pink-600',
    features: ['全程指导', '包过答辩', '源码文档', '售后保障'],
    stats: { users: '500+', rating: '4.8' },
    gradient: 'from-purple-500/20 to-pink-600/20',
    popular: true
  },
  {
    icon: Palette,
    title: '网站设计',
    description: '企业官网、电商平台、个人博客定制开发，响应式设计',
    color: 'from-orange-500 to-red-600',
    features: ['响应式设计', 'SEO优化', '售后维护', '源码交付'],
    stats: { users: '300+', rating: '4.9' },
    gradient: 'from-orange-500/20 to-red-600/20'
  },
  {
    icon: Rocket,
    title: 'APP开发',
    description: 'iOS/Android原生开发，跨平台开发，小程序开发',
    color: 'from-green-500 to-emerald-600',
    features: ['原生开发', '跨平台', '全栈方案', '上线支持'],
    stats: { users: '200+', rating: '4.7' },
    gradient: 'from-green-500/20 to-emerald-600/20'
  },
]

const stats = [
  { value: '2000+', label: '成功案例', icon: CheckCircle2, suffix: '' },
  { value: '98', label: '客户满意度', icon: Star, suffix: '%' },
  { value: '24/7', label: '在线支持', icon: Clock, suffix: '' },
  { value: '5', label: '年行业经验', icon: Award, suffix: '+' },
]

const features = [
  {
    icon: Shield,
    title: '品质保障',
    description: '严格的质量控制体系，确保每个项目都达到最高标准'
  },
  {
    icon: Clock,
    title: '准时交付',
    description: '科学的项目管理，保证项目按时高质量交付'
  },
  {
    icon: MessageCircle,
    title: '全程沟通',
    description: '专属客服一对一服务，随时了解项目进度'
  },
  {
    icon: Award,
    title: '售后无忧',
    description: '完善的售后服务体系，解决您的后顾之忧'
  }
]

// Animated Counter Component
function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [displayValue, setDisplayValue] = useState('0')

  useEffect(() => {
    if (isInView) {
      const numericValue = parseInt(value.replace(/[^0-9]/g, ''))
      const duration = 2000
      const steps = 60
      const increment = numericValue / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= numericValue) {
          setDisplayValue(value)
          clearInterval(timer)
        } else {
          setDisplayValue(Math.floor(current).toString())
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {displayValue}{suffix}
    </span>
  )
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
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      particles = []
      const count = Math.min(50, Math.floor(window.innerWidth / 30))
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(14, 165, 233, ${p.opacity})`
        ctx.fill()

        // Draw connections
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(14, 165, 233, ${0.1 * (1 - dist / 150)})`
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    resize()
    createParticles()
    animate()

    window.addEventListener('resize', () => {
      resize()
      createParticles()
    })

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}

// Service Card Component
function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="group relative"
    >
      <div className={`
        relative overflow-hidden rounded-2xl p-6 h-full
        bg-gradient-to-br from-white/[0.03] to-white/[0.01]
        backdrop-blur-xl border border-white/[0.08]
        transition-all duration-500 ease-out
        hover:border-white/[0.15] hover:shadow-2xl
        ${service.popular ? 'ring-2 ring-purple-500/30' : ''}
      `}>
        {/* Popular Badge */}
        {service.popular && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
              <Sparkles size={12} />
              热门
            </span>
          </div>
        )}

        {/* Icon */}
        <div className={`
          w-14 h-14 rounded-xl flex items-center justify-center mb-5
          bg-gradient-to-br ${service.color}
          shadow-lg group-hover:scale-110 transition-transform duration-500
        `}>
          <service.icon size={28} className="text-white" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
          {service.title}
        </h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {service.features.slice(0, 3).map((feature, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded-md text-xs bg-white/5 text-slate-300 border border-white/5"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-sm text-slate-400">
            <Users size={14} />
            <span>{service.stats.users}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-400">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span>{service.stats.rating}</span>
          </div>
        </div>

        {/* Hover Effect */}
        <div className={`
          absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
          bg-gradient-to-br ${service.gradient}
        `} />
      </div>
    </motion.div>
  )
}

// Main Page Component
export default function Home() {
  const { user: authUser } = useAuth()
  const [user, setUser] = useState<{ id: string; username: string; email: string; phone?: string } | null>(null)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null)
  const [orderForm, setOrderForm] = useState({ username: '', email: '', phone: '', remark: '' })
  const [submitting, setSubmitting] = useState(false)

  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  useEffect(() => {
    if (authUser) {
      setUser(authUser)
      setOrderForm({
        username: authUser.username || '',
        email: authUser.email || '',
        phone: authUser.phone || '',
        remark: ''
      })
    } else {
      setUser(null)
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
    <div className="min-h-screen bg-navy-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-shadow duration-300">
                <Zap size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                周末
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="nav-link">服务项目</a>
              <a href="#features" className="nav-link">优势特点</a>
              <Link href="/chat" className="nav-link flex items-center gap-1.5">
                <MessageCircle size={16} />
                在线咨询
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <Link href="/dashboard" className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-slate-300 hidden sm:block">{user.username}</span>
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
                    登录
                  </Link>
                  <Link href="/register" className="btn-primary text-sm py-2.5 px-5">
                    注册
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-mesh" />
        <ParticleBackground />
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] animate-pulse-slow delay-500" />

        <motion.div 
          style={{ y, opacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300">
                <Sparkles size={16} className="text-yellow-400" />
                专业团队 · 品质保障 · 售后无忧
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight"
            >
              <span className="block text-white mb-2">科技赋能</span>
              <span className="block text-gradient-animated">服务平台</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={fadeInUp}
              className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 leading-relaxed"
            >
              提供软件开发、毕设代做、网站设计等专业服务
              <br className="hidden sm:block" />
              一站式解决方案，助力您的数字化转型
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/chat" className="btn-primary text-lg px-8 py-4">
                <MessageCircle size={20} />
                立即咨询
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#services" className="btn-secondary text-lg px-8 py-4">
                <Play size={20} />
                了解服务
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-12"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  className="glass-card rounded-2xl p-6 text-center group hover:border-white/15 transition-colors"
                >
                  <stat.icon size={28} className="mx-auto mb-3 text-blue-400 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-white mb-1">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-white/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section - Bento Grid */}
      <section id="services" className="section relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="badge-blue mb-4">
              我们的服务
            </motion.span>
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              专业<span className="text-gradient">解决方案</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-400 text-lg max-w-2xl mx-auto">
              专业团队，品质保障，为您提供一站式技术服务
            </motion.p>
          </motion.div>

          {/* Bento Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                onClick={() => {
                  setSelectedService(service)
                  setShowServiceModal(true)
                }}
                className="cursor-pointer"
              >
                <ServiceCard service={service} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-sm relative bg-navy-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="badge-purple mb-4">
              为什么选择我们
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-4">
              我们的<span className="text-gradient">优势</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="card group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon size={24} className="text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/20 rounded-full blur-[120px]" />
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="relative max-w-4xl mx-auto text-center"
        >
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-6">
            准备好开始您的项目了吗？
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            立即联系我们，获取免费咨询和报价。我们的专业团队随时为您服务。
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/chat" className="btn-primary text-lg px-8 py-4">
              <MessageCircle size={20} />
              免费咨询
            </Link>
            <a href="tel:18111005880" className="btn-secondary text-lg px-8 py-4">
              <Phone size={20} />
              电话咨询
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">周末平台</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="mailto:2962938198@qq.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={16} />
                2962938198@qq.com
              </a>
              <a href="tel:18111005880" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={16} />
                18111005880
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} 周末平台. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Service Modal */}
      {showServiceModal && selectedService && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div
            onClick={() => setShowServiceModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="glass-strong rounded-2xl p-6 border border-white/10">
              <button
                onClick={() => setShowServiceModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <div className={`
                  w-14 h-14 rounded-xl flex items-center justify-center mb-4
                  bg-gradient-to-br ${selectedService.color}
                `}>
                  <selectedService.icon size={28} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedService.title}</h2>
                <p className="text-slate-400">{selectedService.description}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    用户名 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={orderForm.username}
                    onChange={(e) => setOrderForm({ ...orderForm, username: e.target.value })}
                    placeholder="请输入您的用户名"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    邮箱 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={orderForm.email}
                    onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                    placeholder="请输入您的邮箱"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    手机号码 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                    placeholder="请输入您的手机号码"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    备注信息
                  </label>
                  <textarea
                    value={orderForm.remark}
                    onChange={(e) => setOrderForm({ ...orderForm, remark: e.target.value })}
                    placeholder="请描述您的需求或问题（选填）"
                    rows={3}
                    className="input resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowServiceModal(false)}
                  className="flex-1 btn-secondary"
                >
                  取消
                </button>
                <button
                  onClick={handleServiceSubmit}
                  disabled={submitting}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      提交中...
                    </>
                  ) : (
                    '提交咨询'
                  )}
                </button>
              </div>

              {!user && (
                <p className="text-center text-sm text-slate-500 mt-4">
                  已有账号？<Link href="/login" className="text-blue-400 hover:underline">登录后可自动填充信息</Link>
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
