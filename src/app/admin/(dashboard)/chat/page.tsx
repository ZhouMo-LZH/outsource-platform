'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Search, MoreVertical, Phone, Video, Smile, Image, Paperclip, CheckCheck } from 'lucide-react'
import { useUnreadCount } from '../layout'

interface Message {
  id: string
  content: string
  sender: string
  isRead: boolean
  createdAt: string
}

interface ChatSession {
  id: string
  username: string
  email: string
  lastMessage: string
  unreadCount: number
  messages: Message[]
}

export default function AdminChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [input, setInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { refreshUnreadCount } = useUnreadCount()

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/messages')
      const data = await res.json()
      if (data.sessions) {
        setSessions(data.sessions.map((s: ChatSession) => ({
          ...s,
          lastMessage: s.messages?.[0]?.content || '暂无消息',
          unreadCount: s.messages?.filter((m: Message) => !m.isRead && m.sender === 'user').length || 0
        })))
      }
    } catch (error) {
      console.error('获取会话失败:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSessions()
    const interval = setInterval(fetchSessions, 5000)
    return () => clearInterval(interval)
  }, [fetchSessions])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedSession?.messages])

  const handleSend = async () => {
    if (!input.trim() || !selectedSession) return

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedSession.id,
          content: input,
          sender: 'admin'
        })
      })

      const newMessage: Message = {
        id: Date.now().toString(),
        content: input,
        sender: 'admin',
        isRead: true,
        createdAt: new Date().toISOString()
      }

      setSessions(prev => prev.map(session =>
        session.id === selectedSession.id
          ? {
              ...session,
              messages: [...session.messages, newMessage],
              lastMessage: input
            }
          : session
      ))

      setSelectedSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, newMessage],
        lastMessage: input
      } : null)

      setInput('')
    } catch (error) {
      console.error('发送失败:', error)
    }
  }

  const handleSelectSession = async (session: ChatSession) => {
    try {
      const res = await fetch(`/api/messages?userId=${session.id}`)
      const data = await res.json()
      
      setSelectedSession({
        ...session,
        messages: data.messages || []
      })

      await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.id })
      })

      setSessions(prev => prev.map(s =>
        s.id === session.id ? { ...s, unreadCount: 0 } : s
      ))

      // 刷新全局未读消息数量
      refreshUnreadCount()
    } catch (error) {
      console.error('加载消息失败:', error)
    }
  }

  const filteredSessions = sessions.filter(session =>
    session.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
  }

  return (
    <div className="h-[calc(100vh-120px)] flex bg-slate-900/50 rounded-2xl overflow-hidden border border-white/5">
      <div className="w-80 bg-slate-800/50 border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索联系人..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              加载中...
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <p>暂无会话</p>
              <p className="text-sm mt-1">用户咨询后将显示在这里</p>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSelectSession(session)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                  selectedSession?.id === session.id
                    ? 'bg-blue-500/10 border-l-2 border-blue-500'
                    : 'hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                    {session.username[0].toUpperCase()}
                  </div>
                  {session.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center px-1">
                      {session.unreadCount > 99 ? '99+' : session.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white truncate">{session.username}</span>
                    <span className="text-xs text-gray-500">
                      {session.messages?.[0]?.createdAt ? formatTime(session.messages[0].createdAt) : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-0.5">{session.lastMessage}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <>
            <div className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-slate-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                  {selectedSession.username[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium text-white">{selectedSession.username}</h3>
                  <p className="text-xs text-gray-500">{selectedSession.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900/30">
              {selectedSession.messages?.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end gap-2 max-w-[70%] ${
                    message.sender === 'admin' ? 'flex-row-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'admin'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                        : 'bg-gradient-to-br from-blue-500 to-purple-500'
                    }`}>
                      <span className="text-xs text-white font-medium">
                        {message.sender === 'admin' ? '我' : selectedSession.username[0]}
                      </span>
                    </div>
                    <div>
                      <div className={`px-4 py-2.5 rounded-2xl ${
                        message.sender === 'admin'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-br-md'
                          : 'bg-slate-700/50 text-white rounded-bl-md'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 ${
                        message.sender === 'admin' ? 'justify-end' : ''
                      }`}>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.createdAt)}
                        </span>
                        {message.sender === 'admin' && (
                          <CheckCheck className={`w-4 h-4 ${message.isRead ? 'text-blue-400' : 'text-gray-500'}`} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/5 bg-slate-800/30">
              <div className="flex items-center gap-2 mb-3">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Smile className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Image className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="输入消息..."
                  className="flex-1 px-4 py-3 bg-slate-700/50 border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium hover:from-blue-400 hover:to-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-slate-900/30">
            <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
              <Send className="w-10 h-10 text-gray-600" />
            </div>
            <p className="text-lg">选择一个会话开始聊天</p>
            <p className="text-sm mt-2">用户咨询将实时显示在这里</p>
          </div>
        )}
      </div>
    </div>
  )
}
