'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, User, Lock, Mail, CheckCircle, ArrowLeft, Sparkles, Shield } from 'lucide-react'

interface Star {
  id: number
  left: number
  top: number
  size: number
  delay: number
  duration: number
}

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [stars, setStars] = useState<Star[]>([])
  const [countdown, setCountdown] = useState(0)
  const [sendingCode, setSendingCode] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    verifyCode: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const newStars: Star[] = []
    for (let i = 0; i < 80; i++) {
      newStars.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3,
      })
    }
    setStars(newStars)
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendCode = async () => {
    if (!formData.email) {
      setError('请先输入邮箱地址')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('请输入有效的邮箱地址')
      return
    }

    setSendingCode(true)
    setError('')

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await res.json()

      if (res.ok) {
        setCodeSent(true)
        setCountdown(60)
      } else {
        setError(data.error || '发送失败')
      }
    } catch {
      setError('网络错误，请重试')
    } finally {
      setSendingCode(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError('两次密码不一致')
      return
    }

    if (formData.password.length < 6) {
      setError('密码至少6位')
      return
    }

    if (!formData.verifyCode) {
      setError('请输入验证码')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          verifyCode: formData.verifyCode,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/login?registered=true')
      } else {
        setError(data.error || '注册失败')
      }
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Stars Animation */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle ease-in-out infinite;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
      `}</style>

      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}

      {/* Back Button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-20"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回首页</span>
      </Link>

      {/* Register Card */}
      <div className={`w-full max-w-md relative z-10 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="glass-elevated rounded-3xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-500 to-pink-500 flex items-center justify-center shadow-lg shadow-accent-500/30">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">创建账号</h1>
            <p className="text-gray-400">加入我们，开启数字化之旅</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm text-center flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Username */}
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent-400 transition-colors" />
              <input
                type="text"
                placeholder="用户名"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 
                         focus:border-accent-400 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all outline-none"
                required
              />
            </div>

            {/* Email */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent-400 transition-colors" />
              <input
                type="email"
                placeholder="邮箱地址"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 
                         focus:border-accent-400 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all outline-none"
                required
              />
            </div>

            {/* Verification Code */}
            <div className="flex gap-3">
              <div className="relative group flex-1">
                <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent-400 transition-colors" />
                <input
                  type="text"
                  placeholder="验证码"
                  value={formData.verifyCode}
                  onChange={(e) => setFormData({ ...formData, verifyCode: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 
                           focus:border-accent-400 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all outline-none"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={countdown > 0 || sendingCode}
                className={`px-4 py-3.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                  countdown > 0
                    ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                    : codeSent
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                    : 'bg-accent-500/20 text-accent-400 border border-accent-500/30 hover:bg-accent-500/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                }`}
              >
                {sendingCode ? '发送中...' : countdown > 0 ? `${countdown}s` : codeSent ? '重新发送' : '发送验证码'}
              </button>
            </div>

            {/* Phone */}
            <div className="relative group">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent-400 transition-colors" />
              <input
                type="tel"
                placeholder="手机号（选填）"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 
                         focus:border-accent-400 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent-400 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="密码（至少6位）"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 
                         focus:border-accent-400 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all outline-none"
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

            {/* Confirm Password */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent-400 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="确认密码"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 
                         focus:border-accent-400 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all outline-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-accent-500 to-pink-500 text-white rounded-xl font-semibold 
                       hover:from-accent-400 hover:to-pink-400 transition-all shadow-lg shadow-accent-500/25 
                       hover:shadow-accent-500/40 disabled:opacity-70 disabled:cursor-not-allowed
                       hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  注册中...
                </span>
              ) : '注册账号'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-gray-400">
            已有账号？{' '}
            <Link href="/login" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
              立即登录
            </Link>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-gray-600 mt-6">
            注册即表示同意我们的
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">服务条款</Link>
            和
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">隐私政策</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
