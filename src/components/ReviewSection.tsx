'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ThumbsUp, MessageSquare, User, CheckCircle2, Clock, MessageCircle } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'

interface Review {
  id: string
  rating: number
  title?: string
  content: string
  isVerified: boolean
  likes: number
  createdAt: string
  user: {
    id: string
    username: string
    avatar?: string
  }
}

interface ReviewStats {
  averageRating: string
  totalCount: number
}

// 星级评分组件
function StarRating({ rating, size = 'sm', interactive = false, onRate }: {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onRate?: (rating: number) => void
}) {
  const [hoveredRating, setHoveredRating] = useState(0)
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHoveredRating(star)}
          onMouseLeave={() => interactive && setHoveredRating(0)}
          className={`${interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''}`}
        >
          <Star
            className={`${sizeClasses[size]} ${
              star <= (hoveredRating || rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-slate-600'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

// 单个评价卡片组件
function ReviewCard({ review }: { review: Review }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(review.likes)

  const handleLike = () => {
    if (!liked) {
      setLikeCount(likeCount + 1)
      setLiked(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card rounded-xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* 用户头像 */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            {review.user.avatar ? (
              <img src={review.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              review.user.username[0].toUpperCase()
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{review.user.username}</span>
              {review.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">
                  <CheckCircle2 size={12} />
                  已验证
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString('zh-CN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 评价标题 */}
      {review.title && (
        <h4 className="font-medium text-white mb-2">{review.title}</h4>
      )}

      {/* 评价内容 */}
      <p className="text-slate-300 text-sm leading-relaxed mb-4">{review.content}</p>

      {/* 操作按钮 */}
      <div className="flex items-center gap-4 pt-4 border-t border-white/5">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            liked ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <ThumbsUp size={14} className={liked ? 'fill-current' : ''} />
          {likeCount}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors">
          <MessageCircle size={14} />
          回复
        </button>
      </div>
    </motion.div>
  )
}

// 评价表单组件
function ReviewForm({ serviceId, orderId, onSubmitSuccess }: {
  serviceId?: string
  orderId?: string
  onSubmitSuccess: () => void
}) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      alert('请先登录')
      return
    }

    if (rating === 0) {
      alert('请选择评分')
      return
    }

    if (content.trim().length < 10) {
      alert('评价内容至少需要10个字符')
      return
    }

    setSubmitting(true)
    
    try {
      // 获取 token
      const token = localStorage.getItem('token')
      
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceId,
          orderId,
          rating,
          title: title || undefined,
          content: content.trim()
        })
      })

      if (res.ok) {
        alert('评价提交成功，审核通过后将显示')
        setTitle('')
        setContent('')
        setRating(0)
        onSubmitSuccess()
      } else {
        const data = await res.json()
        alert(data.error || '提交失败')
      }
    } catch (error) {
      console.error('提交评价错误:', error)
      alert('网络错误，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          您的评分 <span className="text-red-400">*</span>
        </label>
        <StarRating 
          rating={rating} 
          size="lg" 
          interactive 
          onRate={setRating}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          评价标题（选填）
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="一句话总结您的体验"
          maxLength={100}
          className="input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          详细评价 <span className="text-red-400">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="分享您的使用体验，帮助其他用户做出选择..."
          rows={5}
          maxLength={1000}
          className="input resize-none"
        />
        <p className="mt-1 text-xs text-slate-500">{content.length}/1000</p>
      </div>

      <button
        type="submit"
        disabled={submitting || !user}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Clock size={18} className="animate-spin" />
            提交中...
          </>
        ) : user ? (
          '提交评价'
        ) : (
          '请先登录后评价'
        )}
      </button>
    </form>
  )
}

// 主评价区域组件
export default function ReviewSection({ 
  serviceId,
  showForm = true,
  limit = 5 
}: {
  serviceId?: string
  showForm?: boolean
  limit?: number
}) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats>({ averageRating: '0', totalCount: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchReviews()
  }, [serviceId, page])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(serviceId && { serviceId })
      })

      const res = await fetch(`/api/reviews?${params}`)
      const data = await res.json()

      if (data.success) {
        setReviews(data.data.reviews)
        setStats(data.data.stats)
        setTotalPages(data.data.pagination.pages)
      }
    } catch (error) {
      console.error('获取评价错误:', error)
    } finally {
      setLoading(false)
    }
  }

  // 评分分布统计（模拟数据）
  const ratingDistribution = [
    { stars: 5, count: Math.floor(stats.totalCount * 0.7), percentage: 70 },
    { stars: 4, count: Math.floor(stats.totalCount * 0.15), percentage: 15 },
    { stars: 3, count: Math.floor(stats.totalCount * 0.08), percentage: 8 },
    { stars: 2, count: Math.floor(stats.totalCount * 0.04), percentage: 4 },
    { stars: 1, count: Math.floor(stats.totalCount * 0.03), percentage: 3 },
  ]

  return (
    <section className="py-12">
      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 平均评分 */}
        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="text-5xl font-bold text-gradient-animated mb-2">
            {stats.averageRating}
          </div>
          <div className="text-slate-400 text-sm">平均评分</div>
          <div className="flex items-center justify-center mt-3">
            <StarRating rating={parseFloat(stats.averageRating)} size="lg" />
          </div>
          <div className="text-xs text-slate-500 mt-2">
            基于 {stats.totalCount} 条评价
          </div>
        </div>

        {/* 评分分布 */}
        <div className="glass-card rounded-2xl p-6">
          <h4 className="font-medium text-white mb-4">评分分布</h4>
          <div className="space-y-3">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="text-sm text-slate-400 w-8">{item.stars}星</span>
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                  />
                </div>
                <span className="text-sm text-slate-400 w-12 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 评价列表 */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <MessageCircle size={24} className="text-blue-400" />
          用户评价 ({stats.totalCount})
        </h3>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/10" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-24 bg-white/10 rounded" />
                    <div className="h-3 w-16 bg-white/10 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </AnimatePresence>
        ) : (
          <div className="glass-card rounded-xl p-12 text-center">
            <MessageCircle size={48} className="mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400">暂无评价</p>
            <p className="text-sm text-slate-500 mt-2">成为第一个评价的用户吧！</p>
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <span className="text-slate-400 text-sm">
              第 {page} / {totalPages} 页
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        )}
      </div>

      {/* 评价表单 */}
      {showForm && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Star size={24} className="text-yellow-400" />
            写下您的评价
          </h3>
          <ReviewForm 
            serviceId={serviceId}
            onSubmitSuccess={() => fetchReviews()}
          />
        </div>
      )}
    </section>
  )
}
