'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, CheckCircle2, Package, MessageSquare, Star, Settings, ExternalLink } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'

interface Notification {
  id: string
  type: string
  title: string
  content?: string
  data?: string
  isRead: boolean
  readAt?: string
  createdAt: string
}

// 根据类型获取图标和颜色
function getNotificationIcon(type: string) {
  const icons = {
    order: { icon: Package, color: 'text-blue-400 bg-blue-500/10' },
    message: { icon: MessageSquare, color: 'text-green-400 bg-green-500/10' },
    review: { icon: Star, color: 'text-yellow-400 bg-yellow-500/10' },
    system: { icon: Settings, color: 'text-purple-400 bg-purple-500/10' },
  }

  return icons[type as keyof typeof icons] || icons.system
}

// 格式化时间
function formatTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // 小于1分钟
  if (diff < 60000) return '刚刚'
  
  // 小于1小时
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  
  // 小于24小时
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  
  // 小于7天
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
  
  // 其他显示日期
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

// 单个通知项组件
function NotificationItem({ 
  notification, 
  onMarkAsRead,
  onClick 
}: { 
  notification: Notification
  onMarkAsRead: (id: string) => void
  onClick: (notification: Notification) => void
}) {
  const { icon: Icon, color } = getNotificationIcon(notification.type)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`
        group flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200
        hover:bg-white/[0.03]
        ${!notification.isRead ? 'bg-blue-500/5 border-l-2 border-blue-500' : ''}
      `}
      onClick={() => onClick(notification)}
    >
      {/* 图标 */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className={`font-medium text-sm ${!notification.isRead ? 'text-white' : 'text-slate-300'}`}>
            {notification.title}
          </h4>
          {!notification.isRead && (
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
          )}
        </div>

        {notification.content && (
          <p className="text-sm text-slate-400 mt-1 line-clamp-2">
            {notification.content}
          </p>
        )}

        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
          <span>{formatTime(notification.createdAt)}</span>
          
          {!notification.isRead && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMarkAsRead(notification.id)
              }}
              className="flex items-center gap-1 hover:text-blue-400 transition-colors"
            >
              <CheckCircle2 size={12} />
              标记已读
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// 主通知系统组件
export default function NotificationSystem() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // 获取通知列表
  const fetchNotifications = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/notifications?limit=50', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await res.json()
      
      if (data.success) {
        setNotifications(data.data.notifications)
        setUnreadCount(data.data.stats.unreadCount)
      }
    } catch (error) {
      console.error('获取通知错误:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  // 打开时获取通知
  useEffect(() => {
    if (isOpen && user) {
      fetchNotifications()
    }
  }, [isOpen, user, fetchNotifications])

  // 定期刷新未读数（每30秒）
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000)

    return () => clearInterval(interval)
  }, [user, fetchNotifications])

  // 标记为已读
  const handleMarkAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('标记已读错误:', error)
    }
  }

  // 全部标记为已读
  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token')
      await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() })))
      setUnreadCount(0)
    } catch (error) {
      console.error('全部标记已读错误:', error)
    }
  }

  // 点击通知
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id)
    }

    // 根据类型跳转到不同页面
    let href = '/dashboard'
    
    switch (notification.type) {
      case 'order':
        href = '/dashboard'
        break
      case 'message':
        href = '/chat'
        break
      case 'review':
        href = '#reviews'
        break
      default:
        href = '/dashboard'
    }

    window.location.href = href
    setIsOpen(false)
  }

  if (!user) return null

  return (
    <div className="relative">
      {/* 通知按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors focus-ring"
      >
        <Bell size={20} />
        
        {/* 未读数量徽章 */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* 通知面板 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 遮罩层 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60]"
              onClick={() => setIsOpen(false)}
            />

            {/* 面板 */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 w-[380px] max-h-[520px] glass-strong rounded-2xl border border-white/10 shadow-2xl z-[70] overflow-hidden"
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <h3 className="font-semibold text-white">通知</h3>
                
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="px-3 py-1.5 text-xs text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      全部已读
                    </button>
                  )}
                  
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* 通知列表 */}
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(520px - 80px)' }}>
                {loading ? (
                  <div className="space-y-2 p-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-3 p-4 animate-pulse">
                        <div className="w-10 h-10 rounded-lg bg-white/10" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 bg-white/10 rounded" />
                          <div className="h-3 w-1/2 bg-white/10 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    <AnimatePresence mode="popLayout">
                      {notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={handleMarkAsRead}
                          onClick={handleNotificationClick}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Bell size={48} className="mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-400 mb-1">暂无通知</p>
                    <p className="text-sm text-slate-500">新通知会在这里显示</p>
                  </div>
                )}
              </div>

              {/* 底部 */}
              {notifications.length > 0 && (
                <div className="p-4 border-t border-white/5">
                  <button
                    onClick={() => {
                      window.location.href = '/dashboard?tab=notifications'
                      setIsOpen(false)
                    }}
                    className="w-full py-2.5 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    查看全部通知
                    <ExternalLink size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
