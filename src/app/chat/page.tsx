'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, ArrowLeft, User, Smile, Image, Paperclip, CheckCheck, Phone, MoreVertical, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  content: string
  sender: string
  isRead: boolean
  createdAt: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [user, setUser] = useState<{ id: string; username: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [adminOnline, setAdminOnline] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsed = JSON.parse(userData)
      setUser(parsed)
      fetchMessages(parsed.id)
      checkAdminStatus()
      sendUserHeartbeat(parsed.id)
    } else {
      setLoading(false)
    }
  }, [])

  const sendUserHeartbeat = async (userId: string) => {
    try {
      await fetch('/api/admin/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
    } catch (error) {
      console.error('发送心跳失败:', error)
    }
  }

  useEffect(() => {
    if (!user) return
    
    const heartbeatInterval = setInterval(() => {
      sendUserHeartbeat(user.id)
    }, 30000)
    
    const statusInterval = setInterval(() => {
      checkAdminStatus()
    }, 5000)
    
    return () => {
      clearInterval(heartbeatInterval)
      clearInterval(statusInterval)
    }
  }, [user])

  const checkAdminStatus = async () => {
    try {
      const res = await fetch('/api/admin/status')
      if (res.ok) {
        const data = await res.json()
        setAdminOnline(data.online)
      }
    } catch (error) {
      console.error('检查客服状态失败:', error)
      setAdminOnline(false)
    }
  }

  const fetchMessages = async (userId: string) => {
    try {
      const res = await fetch(`/api/messages?userId=${userId}`)
      const data = await res.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('获取消息失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (user) {
      const interval = setInterval(() => fetchMessages(user.id), 3000)
      return () => clearInterval(interval)
    }
  }, [user])

  const handleSend = async () => {
    if (!input.trim() || !user) return

    const messageContent = input.trim()
    setInput('')
    setIsTyping(true)

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          content: messageContent,
          sender: 'user'
        })
      })

      const newMessage: Message = {
        id: Date.now().toString(),
        content: messageContent,
        sender: 'user',
        isRead: false,
        createdAt: new Date().toISOString()
      }

      setMessages(prev => [...prev, newMessage])
      
      // Simulate admin typing
      setTimeout(() => setIsTyping(false), 1000)
    } catch (error) {
      console.error('发送失败:', error)
      setIsTyping(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return '今天'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天'
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    }
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {} as Record<string, Message[]>)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center p-8 glass rounded-2xl">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">请先登录</h2>
          <p className="text-gray-400 mb-6">登录后即可与客服在线沟通</p>
          <Link href="/login" className="btn-primary inline-flex items-center gap-2">
            去登录
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="h-16 px-4 flex items-center justify-between glass-dark sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white">在线客服</h1>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full animate-pulse ${adminOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
              <span className={`text-xs ${adminOnline ? 'text-green-400' : 'text-gray-400'}`}>
                {adminOnline ? '在线' : '离线'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Phone className="w-5 h-5 text-gray-400" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 relative z-10">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              加载中...
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-12 h-12 text-gray-600" />
            </div>
            <p className="text-lg text-white mb-2">开始与客服对话吧</p>
            <p className="text-sm">我们会在第一时间回复您</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              {/* Date Divider */}
              <div className="flex items-center justify-center">
                <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                  {formatDate(dateMessages[0].createdAt)}
                </span>
              </div>
              
              {dateMessages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end gap-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-primary-500 to-accent-500'
                        : 'bg-gradient-to-br from-green-500 to-emerald-500'
                    }`}>
                      <span className="text-xs text-white font-medium">
                        {message.sender === 'user' ? '我' : '客'}
                      </span>
                    </div>
                    
                    {/* Message Bubble */}
                    <div className="flex flex-col">
                      <div className={`px-4 py-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-br-md shadow-lg shadow-primary-500/20'
                          : 'glass rounded-bl-md'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 ${
                        message.sender === 'user' ? 'justify-end' : ''
                      }`}>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.createdAt)}
                        </span>
                        {message.sender === 'user' && (
                          <CheckCheck className={`w-4 h-4 ${message.isRead ? 'text-primary-400' : 'text-gray-600'}`} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end gap-2 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <span className="text-xs text-white font-medium">客</span>
              </div>
              <div className="glass rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="p-4 glass-dark">
        {/* Quick Actions */}
        <div className="flex items-center gap-2 mb-3">
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
            <Smile className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
            <Image className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
            <Paperclip className="w-5 h-5 text-gray-400 group-hover:text-accent-400 transition-colors" />
          </button>
        </div>
        
        {/* Input Field */}
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入消息..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 
                     focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.08] transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl text-white font-medium 
                     hover:from-primary-400 hover:to-accent-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  )
}
