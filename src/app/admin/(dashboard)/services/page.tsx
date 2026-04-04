'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Layers, Search, Plus, Edit3, Trash2,
  Loader2, XCircle, AlertCircle
} from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  price: number
  category: string
  status: string
  createdAt: string
  _count?: {
    orders: number
  }
}

const categories = ['开发', '设计', '部署', '咨询', '其他']

export default function AdminServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '开发',
    status: 'active',
  })

  useEffect(() => {
    checkAdminAuth()
    fetchServices()
  }, [searchQuery])

  const checkAdminAuth = () => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      router.push('/admin/login')
    }
  }

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services')
      if (res.ok) {
        const data = await res.json()
        let filteredServices = data.services || []
        
        if (searchQuery) {
          filteredServices = filteredServices.filter((service: Service) => 
            service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.category.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }
        
        setServices(filteredServices)
      }
    } catch (error) {
      console.error('获取服务列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description) {
      alert('请填写所有必填字段')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: 0,
          category: formData.category,
          status: formData.status,
        }),
      })

      if (res.ok) {
        fetchServices()
        setShowAddModal(false)
        setFormData({
          name: '',
          description: '',
          category: '开发',
          status: 'active',
        })
      } else {
        const error = await res.json()
        alert(error.error || '创建失败')
      }
    } catch (error) {
      console.error('创建服务失败:', error)
      alert('网络错误')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService) return

    setSubmitting(true)
    try {
      const res = await fetch(`/api/services/${selectedService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: 0,
          category: formData.category,
          status: formData.status,
        }),
      })

      if (res.ok) {
        fetchServices()
        setShowEditModal(false)
        setSelectedService(null)
      } else {
        const error = await res.json()
        alert(error.error || '更新失败')
      }
    } catch (error) {
      console.error('更新服务失败:', error)
      alert('网络错误')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteService = async () => {
    if (!selectedService) return

    setSubmitting(true)
    try {
      const res = await fetch(`/api/services/${selectedService.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchServices()
        setShowDeleteModal(false)
        setSelectedService(null)
      } else {
        const error = await res.json()
        alert(error.error || '删除失败')
      }
    } catch (error) {
      console.error('删除服务失败:', error)
      alert('网络错误')
    } finally {
      setSubmitting(false)
    }
  }

  const openEditModal = (service: Service) => {
    setSelectedService(service)
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      status: service.status,
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (service: Service) => {
    setSelectedService(service)
    setShowDeleteModal(true)
  }

  const getStatusStyle = (status: string) => {
    return status === 'active'
      ? 'text-green-400 bg-green-500/10 border-green-500/20'
      : 'text-gray-400 bg-gray-500/10 border-gray-500/20'
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
          <h1 className="text-2xl font-bold text-white mb-2">服务管理</h1>
          <p className="text-gray-400">管理系统所有服务</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-400 hover:to-purple-400 transition-all"
        >
          <Plus className="w-5 h-5" />
          添加服务
        </button>
      </div>

      {/* 搜索 */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="搜索服务名称或类别..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-400 outline-none"
        />
      </div>

      {/* 服务列表 */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <Layers className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">暂无服务</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">服务信息</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">类别</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">状态</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">创建时间</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{service.name}</p>
                        <p className="text-gray-500 text-sm line-clamp-1">{service.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-white/5 text-gray-300 rounded-full text-sm">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${getStatusStyle(service.status)}`}>
                        {service.status === 'active' ? '启用' : '禁用'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {formatDate(service.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(service)}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-blue-400"
                          title="编辑"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(service)}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-red-400"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 添加服务弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">添加服务</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">服务名称 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-400 outline-none"
                  placeholder="输入服务名称"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">服务描述 *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-400 outline-none resize-none"
                  rows={3}
                  placeholder="输入服务描述"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">类别 *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-400 outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">状态</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="active"
                      checked={formData.status === 'active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span className="text-white">启用</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="inactive"
                      checked={formData.status === 'inactive'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span className="text-white">禁用</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-400 hover:to-purple-400 transition-all disabled:opacity-70 mt-4"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    创建中...
                  </span>
                ) : (
                  '创建服务'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 编辑服务弹窗 */}
      {showEditModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">编辑服务</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleEditService} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">服务名称 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-400 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">服务描述 *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-400 outline-none resize-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">类别 *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-400 outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">状态</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="active"
                      checked={formData.status === 'active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span className="text-white">启用</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="inactive"
                      checked={formData.status === 'inactive'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span className="text-white">禁用</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-400 hover:to-purple-400 transition-all disabled:opacity-70 mt-4"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    更新中...
                  </span>
                ) : (
                  '保存修改'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {showDeleteModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">确认删除</h2>
                <p className="text-gray-400 text-sm">此操作无法撤销</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6">
              您确定要删除服务 <span className="text-white font-medium">"{selectedService.name}"</span> 吗？
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleDeleteService}
                disabled={submitting}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-400 transition-all disabled:opacity-70"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    删除中...
                  </span>
                ) : (
                  '确认删除'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
