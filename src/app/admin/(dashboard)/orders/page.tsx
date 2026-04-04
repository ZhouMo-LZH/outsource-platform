'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Package, Search, ChevronLeft, ChevronRight,
  Loader2, XCircle, Eye, Edit3
} from 'lucide-react'

interface Order {
  id: string
  status: string
  amount: number
  description: string | null
  createdAt: string
  contactName: string | null
  contactEmail: string | null
  contactPhone: string | null
  remark: string | null
  user: {
    username: string
    email: string
    phone: string | null
  }
  service: {
    name: string
    category: string
  }
}

const statusOptions = [
  { value: 'pending', label: '待处理', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  { value: 'processing', label: '进行中', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { value: 'completed', label: '已完成', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  { value: 'cancelled', label: '已取消', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
]

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editStatus, setEditStatus] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    checkAdminAuth()
    fetchOrders()
  }, [currentPage, searchQuery, statusFilter])

  const checkAdminAuth = () => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      router.push('/admin/login')
    }
  }

  const fetchOrders = async () => {
    try {
      let url = `/api/orders?page=${currentPage}`
      if (statusFilter) url += `&status=${statusFilter}`
      
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        let filteredOrders = data.orders || []
        
        // 客户端搜索过滤
        if (searchQuery) {
          filteredOrders = filteredOrders.filter((order: Order) => 
            order.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }
        
        setOrders(filteredOrders)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('获取订单列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order)
    setEditStatus(order.status)
    setShowEditModal(true)
  }

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return
    
    setUpdating(true)
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: editStatus }),
      })

      if (res.ok) {
        fetchOrders()
        setShowEditModal(false)
        setSelectedOrder(null)
      }
    } catch (error) {
      console.error('更新订单状态失败:', error)
    } finally {
      setUpdating(false)
    }
  }

  const getStatusStyle = (status: string) => {
    return statusOptions.find(s => s.value === status)?.color || statusOptions[0].color
  }

  const getStatusLabel = (status: string) => {
    return statusOptions.find(s => s.value === status)?.label || status
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">订单管理</h1>
          <p className="text-gray-400">管理所有用户订单</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg">
          <Package className="w-5 h-5" />
          <span>共 {orders.length} 个订单</span>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="搜索订单号、用户或服务..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-400 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-400 outline-none"
        >
          <option value="">全部状态</option>
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* 订单列表 */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">暂无订单</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">订单信息</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">用户信息</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">状态</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">创建时间</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{order.service.name}</p>
                        <p className="text-gray-500 text-sm">{order.id.slice(0, 8)}...</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white">{order.contactName || order.user.username}</p>
                        <p className="text-gray-500 text-sm">{order.contactEmail || order.user.email}</p>
                        {order.contactPhone && (
                          <p className="text-gray-500 text-sm">{order.contactPhone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${getStatusStyle(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-blue-400"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-green-400"
                          title="编辑状态"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 分页 */}
        {!loading && orders.length > 0 && (
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

      {/* 订单详情弹窗 */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">订单详情</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-gray-400">订单号</span>
                <span className="text-white font-mono">{selectedOrder.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">服务名称</span>
                <span className="text-white">{selectedOrder.service.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">服务类别</span>
                <span className="text-white">{selectedOrder.service.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">用户信息</span>
                <span className="text-white">{selectedOrder.contactName || selectedOrder.user.username} ({selectedOrder.contactEmail || selectedOrder.user.email})</span>
              </div>
              {(selectedOrder.contactPhone || selectedOrder.user.phone) && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">联系电话</span>
                  <span className="text-white">{selectedOrder.contactPhone || selectedOrder.user.phone}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-400">订单状态</span>
                <span className={`px-3 py-1 rounded-full text-sm border ${getStatusStyle(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>
              {selectedOrder.remark && (
                <div className="pt-4 border-t border-white/5">
                  <span className="text-gray-400 block mb-2">用户备注</span>
                  <p className="text-white bg-white/5 p-3 rounded-lg">{selectedOrder.remark}</p>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-400">创建时间</span>
                <span className="text-white">{formatDate(selectedOrder.createdAt)}</span>
              </div>
              {selectedOrder.description && (
                <div className="pt-4 border-t border-white/5">
                  <span className="text-gray-400 block mb-2">订单备注</span>
                  <p className="text-white bg-white/5 p-3 rounded-lg">{selectedOrder.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 编辑状态弹窗 */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">更新订单状态</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">订单号</label>
                <p className="text-white font-mono">{selectedOrder.id.slice(0, 16)}...</p>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">服务</label>
                <p className="text-white">{selectedOrder.service.name}</p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">选择新状态</label>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setEditStatus(option.value)}
                      className={`p-3 rounded-xl border transition-all ${
                        editStatus === option.value
                          ? option.color + ' border-current'
                          : 'border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleUpdateStatus}
                disabled={updating || editStatus === selectedOrder.status}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-400 hover:to-purple-400 transition-all disabled:opacity-70 mt-4"
              >
                {updating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    更新中...
                  </span>
                ) : (
                  '确认更新'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
