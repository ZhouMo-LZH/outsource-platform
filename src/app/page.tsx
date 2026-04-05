'use client'

import Link from 'next/link'
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020617 0%, #1e1b4b 50%, #0f172a 100%)',
      color: '#ffffff'
    }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Zap size={20} color="white" />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>周末</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <a href="#services" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '14px' }}>服务项目</a>
              <Link href="/chat" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d1d5db', textDecoration: 'none', fontSize: '14px' }}>
                <MessageCircle size={16} />
                在线咨询
              </Link>

              {user ? (
                <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '12px', borderLeft: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', cursor: 'pointer' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {user.username[0].toUpperCase()}
                  </div>
                  <span style={{ color: '#d1d5db', fontSize: '14px' }}>{user.username}</span>
                </Link>
              ) : (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link href="/login" style={{ padding: '8px 16px', color: '#d1d5db', textDecoration: 'none', fontSize: '14px' }}>登录</Link>
                  <Link href="/register" style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
                    borderRadius: '12px',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>注册</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        paddingTop: '128px',
        paddingBottom: '80px',
        padding: '16px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', width: '100%' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '9999px',
            marginBottom: '32px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Zap size={16} color="#fbbf24" />
            <span style={{ fontSize: '14px', color: '#d1d5db' }}>专业团队 · 品质保障 · 售后无忧</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 8vw, 72px)',
            fontWeight: 'bold',
            marginBottom: '24px',
            lineHeight: 1.2
          }}>
            <span style={{
              background: 'linear-gradient(90deg, #60a5fa 0%, #c084fc 50%, #f472b6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              科技赋能
            </span>
            <br />
            <span style={{ color: '#fff' }}>服务平台</span>
          </h1>

          <p style={{
            fontSize: 'clamp(18px, 3vw, 24px)',
            color: '#9ca3af',
            marginBottom: '40px',
            maxWidth: '768px',
            margin: '0 auto 40px',
            lineHeight: 1.6
          }}>
            提供软件开发、毕设代做、网站设计等专业服务<br/>
            一站式解决方案，助力您的数字化转型
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '64px', flexWrap: 'wrap' }}>
            <Link href="/chat" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
              borderRadius: '12px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
            }}>
              <MessageCircle size={20} />
              在线咨询
              <ArrowRight size={20} />
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            maxWidth: '896px',
            margin: '0 auto'
          }}>
            {stats.map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <stat.icon size={32} style={{ margin: '0 auto 12px', display: 'block', color: '#60a5fa' }} />
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>{stat.value}</div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{ padding: '96px 16px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 'bold', color: '#fff', marginBottom: '16px' }}>
              我们的<span style={{
                background: 'linear-gradient(90deg, #60a5fa 0%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>服务</span>
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '18px', maxWidth: '640px', margin: '0 auto' }}>
              专业团队，品质保障，为您提供一站式解决方案
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {services.map((service, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedService(service)
                  setShowServiceModal(true)
                }}
                style={{
                  position: 'relative',
                  background: 'rgba(255,255,255,0.02)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  padding: '24px',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                }}
              >
                {index === 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '16px',
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    color: 'white',
                    fontWeight: '500'
                  }}>
                    热门
                  </div>
                )}

                <div style={{
                  width: '56px',
                  height: '56px',
                  background: `linear-gradient(135deg, ${service.color})`,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                }}>
                  <service.icon size={28} color="white" />
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', marginBottom: '12px' }}>
                  {service.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.6, marginBottom: '16px' }}>
                  {service.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', fontSize: '12px', color: '#6b7280' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={12} />
                    {service.stats.users}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={12} color="#fbbf24" fill="#fbbf24" />
                    {service.stats.rating}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {service.features.map((feature, i) => (
                    <span key={i} style={{
                      padding: '4px 8px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      color: '#9ca3af',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      {feature}
                    </span>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <ChevronRight size={20} style={{ color: '#6b7280' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '64px 16px',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Zap size={20} color="white" />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 'bold', background: 'linear-gradient(90deg, #60a5fa 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>周末平台</span>
          </div>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
            专业的软件开发与技术服务提供商
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px', fontSize: '14px', color: '#9ca3af' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={16} />
              2962938198@qq.com
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={16} />
              18111005880
            </span>
          </div>
          <p style={{ color: '#4b5563', fontSize: '14px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            © {new Date().getFullYear()} 周末平台. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Service Modal */}
      {showServiceModal && selectedService && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div
            onClick={() => setShowServiceModal(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)'
            }}
          />
          <div style={{
            position: 'relative',
            background: '#0f172a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '480px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <button
              onClick={() => setShowServiceModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                padding: '8px',
                color: '#9ca3af',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>咨询服务</h2>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                服务: <span style={{ color: '#60a5fa' }}>{selectedService.title}</span>
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#d1d5db', marginBottom: '8px' }}>
                  用户名 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={orderForm.username}
                  onChange={(e) => setOrderForm({ ...orderForm, username: e.target.value })}
                  placeholder="请输入您的用户名"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#d1d5db', marginBottom: '8px' }}>
                  邮箱 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="email"
                  value={orderForm.email}
                  onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                  placeholder="请输入您的邮箱"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#d1d5db', marginBottom: '8px' }}>
                  手机号码 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="tel"
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                  placeholder="请输入您的手机号码"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#d1d5db', marginBottom: '8px' }}>
                  备注信息
                </label>
                <textarea
                  value={orderForm.remark}
                  onChange={(e) => setOrderForm({ ...orderForm, remark: e.target.value })}
                  placeholder="请描述您的需求或问题（选填）"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px'
            }}>
              <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>服务信息</p>
              <div style={{ color: '#fff', fontWeight: '500' }}>{selectedService.title}</div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{selectedService.description}</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setShowServiceModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
              <button
                onClick={handleServiceSubmit}
                disabled={submitting}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: submitting ? 'rgba(59,130,246,0.5)' : 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    提交中...
                  </>
                ) : (
                  '提交咨询'
                )}
              </button>
            </div>

            {!user && (
              <p style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280', marginTop: '16px' }}>
                已有账号？<Link href="/login" style={{ color: '#60a5fa', textDecoration: 'underline' }}>登录后可自动填充信息</Link>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
