'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, User, Lock, ArrowLeft, Sparkles } from 'lucide-react'

interface RainDrop {
  id: number
  left: number
  delay: number
  duration: number
  opacity: number
}

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [umbrellaOpen, setUmbrellaOpen] = useState(false)
  const [rainDrops, setRainDrops] = useState<RainDrop[]>([])
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const drops: RainDrop[] = []
    for (let i = 0; i < 150; i++) {
      drops.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.4 + Math.random() * 0.4,
        opacity: 0.2 + Math.random() * 0.4,
      })
    }
    setRainDrops(drops)
  }, [])

  const handleUmbrellaClick = useCallback(() => {
    if (!umbrellaOpen) {
      setUmbrellaOpen(true)
    }
  }, [umbrellaOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/')
      } else {
        setError(data.error || '登录失败')
      }
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-all duration-1500 ${
      umbrellaOpen 
        ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500' 
        : 'bg-gradient-to-br from-slate-950 via-gray-900 to-black'
    }`}>
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Rain Animation */}
      <style jsx>{`
        @keyframes rain {
          0% {
            transform: translateY(-100vh);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
        
        @keyframes umbrellaOpen {
          0% {
            transform: scale(1) rotate(0deg);
          }
          30% {
            transform: scale(1.3) rotate(-8deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes glow {
          0% {
            filter: drop-shadow(0 0 10px rgba(96, 165, 250, 0.3));
          }
          100% {
            filter: drop-shadow(0 0 30px rgba(96, 165, 250, 0.8));
          }
        }
        
        .rain-drop {
          position: absolute;
          width: 2px;
          height: 25px;
          background: linear-gradient(to bottom, transparent, rgba(147, 197, 253, 0.7));
          border-radius: 0 0 2px 2px;
          animation: rain linear infinite;
        }
        
        .umbrella-animation {
          animation: ${umbrellaOpen ? 'umbrellaOpen 0.6s ease-out forwards' : 'bounce 2s ease-in-out infinite'};
        }
        
        .glow-effect {
          animation: ${umbrellaOpen ? 'glow 1s ease-out forwards' : 'none'};
        }
      `}</style>

      {rainDrops.map((drop) => (
        <div
          key={drop.id}
          className="rain-drop"
          style={{
            left: `${drop.left}%`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
            opacity: drop.opacity,
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

      {/* Cute Character */}
      <div className="absolute bottom-4 left-8 md:left-16 cursor-pointer z-20 select-none"
           onClick={handleUmbrellaClick}>
        <div className="relative">
          <div className={`umbrella-animation glow-effect transition-all duration-500 ${umbrellaOpen ? 'opacity-100' : 'opacity-90'}`}>
            <svg width="180" height="240" viewBox="0 0 120 160" className="drop-shadow-2xl">
              <defs>
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="umbrellaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#db2777" />
                </linearGradient>
                <linearGradient id="faceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fcd34d" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
              
              <ellipse cx="60" cy="145" rx="35" ry="10" fill="rgba(0,0,0,0.3)" />
              
              {umbrellaOpen && (
                <g className="glow-effect">
                  <path d="M5 50 Q60 10 115 50 Q60 35 5 50" fill="url(#umbrellaGradient)" />
                  <path d="M12 50 Q60 25 108 50" stroke="#be185d" strokeWidth="2" fill="none" />
                  <path d="M25 50 Q60 30 95 50" stroke="#be185d" strokeWidth="1.5" fill="none" />
                  <path d="M40 50 Q60 35 80 50" stroke="#be185d" strokeWidth="1" fill="none" />
                </g>
              )}
              
              <ellipse cx="60" cy="95" rx="22" ry="28" fill="url(#bodyGradient)" />
              
              <circle cx="60" cy="55" r="24" fill="url(#faceGradient)" />
              
              <ellipse cx="50" cy="50" rx="4" ry="5" fill="#1e293b" />
              <ellipse cx="70" cy="50" rx="4" ry="5" fill="#1e293b" />
              
              <path 
                d={umbrellaOpen 
                  ? "M48 65 Q60 75 72 65" 
                  : "M48 68 Q60 58 72 68"
                } 
                stroke="#1e293b" 
                strokeWidth="3" 
                fill="none" 
                strokeLinecap="round"
              />
              
              {umbrellaOpen && (
                <>
                  <ellipse cx="42" cy="58" rx="6" ry="3" fill="#fca5a5" opacity="0.7" />
                  <ellipse cx="78" cy="58" rx="6" ry="3" fill="#fca5a5" opacity="0.7" />
                </>
              )}
              
              {!umbrellaOpen && (
                <path d="M45 75 Q50 80 55 75" stroke="#60a5fa" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
              )}
              
              {umbrellaOpen ? (
                <line x1="60" y1="50" x2="60" y2="85" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />
              ) : (
                <g>
                  <rect x="57" y="50" width="6" height="55" rx="3" fill="#92400e" />
                  <path d="M54 50 Q60 38 66 50 Q60 45 54 50" fill="url(#umbrellaGradient)" />
                </g>
              )}
              
              <rect x="45" y="120" width="10" height="25" rx="4" fill="#3b82f6" />
              <rect x="65" y="120" width="10" height="25" rx="4" fill="#3b82f6" />
              
              <ellipse cx="50" cy="147" rx="8" ry="4" fill="#1e293b" />
              <ellipse cx="70" cy="147" rx="8" ry="4" fill="#1e293b" />
            </svg>
          </div>
          
          {!umbrellaOpen && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full whitespace-nowrap animate-pulse">
              <span className="text-xs text-gray-300">点击帮孩子撑伞 ☂️</span>
            </div>
          )}
          
          {umbrellaOpen && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 rounded-full whitespace-nowrap transition-all shadow-lg">
              <span className="text-xs text-white font-medium">谢谢你！天气变好了 ✨</span>
            </div>
          )}
        </div>
      </div>

      {/* Login Card */}
      <div className={`w-full max-w-md relative z-10 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className={`glass-elevated rounded-3xl p-8 transition-all duration-700 ${
          umbrellaOpen 
            ? 'bg-white/10 border-white/20' 
            : ''
        }`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-700 ${
              umbrellaOpen 
                ? 'bg-gradient-to-br from-primary-400 to-accent-500 shadow-lg shadow-primary-500/30' 
                : 'bg-gradient-to-br from-slate-700 to-slate-800'
            }`}>
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 transition-colors duration-700 ${
              umbrellaOpen ? 'text-white' : 'text-gray-200'
            }`}>
              欢迎回来
            </h1>
            <p className={`transition-colors duration-700 ${
              umbrellaOpen ? 'text-gray-200' : 'text-gray-500'
            }`}>
              登录你的账号继续
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm text-center flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                {error}
              </div>
            )}
            
            {/* Username Input */}
            <div className="relative group">
              <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 group-focus-within:text-primary-400 ${
                umbrellaOpen ? 'text-gray-300' : 'text-gray-600'
              }`} />
              <input
                type="text"
                placeholder="用户名"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={`w-full pl-12 pr-4 py-4 rounded-xl transition-all duration-300 outline-none ${
                  umbrellaOpen 
                    ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-primary-400 focus:bg-white/15 focus:shadow-[0_0_20px_rgba(14,165,233,0.2)]' 
                    : 'bg-black/40 border border-white/5 text-gray-200 placeholder-gray-600 focus:border-gray-500 focus:bg-black/50'
                }`}
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 group-focus-within:text-primary-400 ${
                umbrellaOpen ? 'text-gray-300' : 'text-gray-600'
              }`} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="密码"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full pl-12 pr-12 py-4 rounded-xl transition-all duration-300 outline-none ${
                  umbrellaOpen 
                    ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-primary-400 focus:bg-white/15 focus:shadow-[0_0_20px_rgba(14,165,233,0.2)]' 
                    : 'bg-black/40 border border-white/5 text-gray-200 placeholder-gray-600 focus:border-gray-500 focus:bg-black/50'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                  umbrellaOpen ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-400'
                }`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className={`flex items-center gap-2 cursor-pointer transition-colors duration-300 ${
                umbrellaOpen ? 'text-gray-300' : 'text-gray-500'
              }`}>
                <input type="checkbox" className="w-4 h-4 rounded border-gray-500 bg-transparent accent-primary-500" />
                记住我
              </label>
              <Link href="/forgot-password" className={`transition-colors duration-300 ${
                umbrellaOpen ? 'text-primary-400 hover:text-primary-300' : 'text-gray-500 hover:text-gray-400'
              }`}>
                忘记密码？
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                umbrellaOpen 
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-400 hover:to-accent-400 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40' 
                  : 'bg-gradient-to-r from-slate-700 to-slate-800 text-gray-300 hover:from-slate-600 hover:to-slate-700'
              } ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  登录中...
                </span>
              ) : '登录'}
            </button>
          </form>

          {/* Register Link */}
          <div className={`mt-6 text-center text-sm transition-colors duration-300 ${
            umbrellaOpen ? 'text-gray-300' : 'text-gray-500'
          }`}>
            还没有账号？{' '}
            <Link href="/register" className={`font-medium transition-colors duration-300 ${
              umbrellaOpen ? 'text-primary-400 hover:text-primary-300' : 'text-gray-400 hover:text-gray-300'
            }`}>
              立即注册
            </Link>
          </div>

          {/* Admin Link */}
          <div className="mt-4 text-center">
            <Link href="/admin/login" className={`text-sm transition-colors duration-300 ${
              umbrellaOpen ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-500'
            }`}>
              管理员入口 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
