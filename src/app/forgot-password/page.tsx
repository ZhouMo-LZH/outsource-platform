'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react'

interface Star {
  id: number
  left: number
  top: number
  size: number
  delay: number
  duration: number
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [stars, setStars] = useState<Star[]>([])
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [sendingCode, setSendingCode] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    verifyCode: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const newStars: Star[] = []
    for (let i = 0; i < 60; i++) {
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
      setError('请输入邮箱地址')
      return
    }

    setSendingCode(true)
    setError('')

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, type: 'reset' }),
      })

      const data = await res.json()

      if (res.ok) {
        setCountdown(60)
        setSuccess('验证码已发送到您的邮箱')
      } else {
        setError(data.error || '发送失败')
      }
    } catch {
      setError('网络错误，请重试')
    } finally {
      setSendingCode(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.verifyCode) {
      setError('请输入验证码')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: formData.verifyCode,
          type: 'reset',
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setStep(3)
        setSuccess('')
      } else {
        setError(data.error || '验证失败')
      }
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword.length < 6) {
      setError('密码至少6位')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('两次密码不一致')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: formData.verifyCode,
          newPassword: formData.newPassword,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/login?reset=true')
      } else {
        setError(data.error || '重置失败')
      }
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950">
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle ease-in-out infinite;
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

      <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">找回密码</h1>
            <p className="text-gray-400">
              {step === 1 && '输入您的邮箱地址'}
              {step === 2 && '输入验证码'}
              {step === 3 && '设置新密码'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm text-center mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 text-green-300 text-sm text-center mb-4">
              {success}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleSendCode(); }} className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  placeholder="注册时使用的邮箱"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-400 focus:bg-white/10 transition-all outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={sendingCode}
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-400 hover:to-cyan-400 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-70"
              >
                {sendingCode ? '发送中...' : '发送验证码'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="relative group">
                <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="输入6位验证码"
                  value={formData.verifyCode}
                  onChange={(e) => setFormData({ ...formData, verifyCode: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-400 focus:bg-white/10 transition-all outline-none"
                  maxLength={6}
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:bg-white/10 transition-all"
                >
                  返回
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-400 hover:to-cyan-400 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-70"
                >
                  {loading ? '验证中...' : '验证'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={countdown > 0}
                  className="text-sm text-gray-500 hover:text-gray-300 disabled:opacity-50"
                >
                  {countdown > 0 ? `${countdown}秒后可重新发送` : '重新发送验证码'}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="新密码（至少6位）"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-400 focus:bg-white/10 transition-all outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="确认新密码"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-400 focus:bg-white/10 transition-all outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-400 hover:to-cyan-400 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-70"
              >
                {loading ? '重置中...' : '重置密码'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-300 flex items-center justify-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              返回登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
