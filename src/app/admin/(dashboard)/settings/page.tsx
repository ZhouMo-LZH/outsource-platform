'use client'

import { useState } from 'react'
import { Settings, Mail, Bell, Shield, Database, Save, CheckCircle } from 'lucide-react'

const settingSections = [
  { id: 'general', icon: Settings, label: '基本设置' },
  { id: 'email', icon: Mail, label: '邮件服务' },
  { id: 'notification', icon: Bell, label: '通知设置' },
  { id: 'security', icon: Shield, label: '安全设置' },
]

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState('general')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    siteName: '周末平台',
    siteDescription: '专业的软件开发与技术服务提供商',
    contactEmail: '2962938198@qq.com',
    contactPhone: '18111005880',
    smtpHost: 'smtp.qq.com',
    smtpPort: '465',
    smtpUser: '2962938198@qq.com',
    emailNotification: true,
    orderNotification: true,
    messageNotification: true,
    maintenanceMode: false,
  })

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">网站名称</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">网站描述</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">联系邮箱</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">联系电话</label>
                <input
                  type="tel"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
              <div>
                <p className="text-white font-medium">维护模式</p>
                <p className="text-sm text-gray-500">开启后用户将看到维护页面</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className={`w-12 h-6 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-blue-500' : 'bg-slate-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        )
      case 'email':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-sm text-blue-400">邮件服务用于发送验证码、订单通知等。当前使用 QQ 邮箱 SMTP 服务。</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">SMTP 服务器</label>
                <input
                  type="text"
                  value={settings.smtpHost}
                  onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">端口</label>
                <input
                  type="text"
                  value={settings.smtpPort}
                  onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">发件邮箱</label>
              <input
                type="email"
                value={settings.smtpUser}
                onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">授权码</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
              />
              <p className="text-xs text-gray-500 mt-2">授权码在邮箱设置中获取，请勿泄露</p>
            </div>
          </div>
        )
      case 'notification':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
              <div>
                <p className="text-white font-medium">邮件通知</p>
                <p className="text-sm text-gray-500">收到新消息时发送邮件通知</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, emailNotification: !settings.emailNotification })}
                className={`w-12 h-6 rounded-full transition-colors ${settings.emailNotification ? 'bg-blue-500' : 'bg-slate-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.emailNotification ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
              <div>
                <p className="text-white font-medium">订单通知</p>
                <p className="text-sm text-gray-500">有新订单时发送通知</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, orderNotification: !settings.orderNotification })}
                className={`w-12 h-6 rounded-full transition-colors ${settings.orderNotification ? 'bg-blue-500' : 'bg-slate-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.orderNotification ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
              <div>
                <p className="text-white font-medium">消息通知</p>
                <p className="text-sm text-gray-500">用户发送消息时通知管理员</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, messageNotification: !settings.messageNotification })}
                className={`w-12 h-6 rounded-full transition-colors ${settings.messageNotification ? 'bg-blue-500' : 'bg-slate-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.messageNotification ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        )
      case 'security':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <p className="text-sm text-yellow-400">安全设置涉及敏感操作，请谨慎修改。</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">当前密码</label>
              <input
                type="password"
                placeholder="输入当前密码"
                className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">新密码</label>
              <input
                type="password"
                placeholder="输入新密码"
                className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">确认新密码</label>
              <input
                type="password"
                placeholder="再次输入新密码"
                className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium hover:from-blue-400 hover:to-purple-400 transition-all">
              修改密码
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">系统设置</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium hover:from-blue-400 hover:to-purple-400 transition-all disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              保存中...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              已保存
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              保存设置
            </>
          )}
        </button>
      </div>

      <div className="flex gap-6">
        <div className="w-48 space-y-2">
          {settingSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <section.icon className="w-5 h-5" />
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 bg-slate-800/30 rounded-2xl border border-white/5 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
