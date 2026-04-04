'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, Search, Mail, Phone, 
  Calendar, CheckCircle, XCircle, Loader2, ChevronLeft, ChevronRight
} from 'lucide-react'

interface User {
  id: string
  username: string
  email: string
  phone: string | null
  isVerified: boolean
  createdAt: string
  _count?: {
    orders: number
    messages: number
  }
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)

  useEffect(() => {
    checkAdminAuth()
    fetchUsers()
  }, [currentPage, searchQuery])

  const checkAdminAuth = () => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      router.push('/admin/login')
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/admin/users?page=${currentPage}&search=${searchQuery}`)
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">用户管理</h1>
          <p className="text-gray-400">管理系统所有注册用户</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg">
          <Users className="w-5 h-5" />
          <span>共 {users.length} 位用户</span>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="搜索用户名或邮箱..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-400 outline-none"
          />
        </div>
      </div>

      {/* 用户列表 */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">暂无用户</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">用户信息</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">联系方式</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">注册时间</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">状态</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">{user.username[0].toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.username}</p>
                          <p className="text-gray-500 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Phone className="w-4 h-4" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                          <CheckCircle className="w-4 h-4" />
                          已验证
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-sm">
                          <XCircle className="w-4 h-4" />
                          未验证
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 分页 */}
        {!loading && users.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <p className="text-gray-500 text-sm">
              第 {currentPage} 页，共 {totalPages} 页
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 用户详情弹窗 */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">用户详情</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white font-medium">{selectedUser.username[0].toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedUser.username}</h3>
                  <p className="text-gray-400">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-gray-500 text-sm mb-1">用户ID</p>
                  <p className="text-white text-sm">{selectedUser.id.slice(0, 8)}...</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">注册时间</p>
                  <p className="text-white text-sm">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">验证状态</p>
                  <p className="text-white text-sm">{selectedUser.isVerified ? '已验证' : '未验证'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">手机号</p>
                  <p className="text-white text-sm">{selectedUser.phone || '未设置'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
