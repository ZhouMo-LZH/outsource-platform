'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, File, Image, FileText, Code, Download, Trash2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'

interface UploadedFile {
  url: string
  name: string
  size: number
  type: string
  category: string
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

// 获取文件图标
function getFileIcon(type: string) {
  if (type.startsWith('image/')) {
    return <Image size={24} className="text-blue-400" />
  } else if (type.includes('pdf') || type.includes('document')) {
    return <FileText size={24} className="text-red-400" />
  } else if (type.includes('javascript') || type.includes('python') || type.includes('json')) {
    return <Code size={24} className="text-green-400" />
  }
  return <File size={24} className="text-slate-400" />
}

interface FileUploadProps {
  accept?: string // MIME types, e.g., "image/*,.pdf"
  maxFiles?: number
  maxSize?: number // in MB
  multiple?: boolean
  onUploadComplete?: (files: UploadedFile[]) => void
  onUploadError?: (error: string) => void
  value?: UploadedFile[]
  onChange?: (files: UploadedFile[]) => void
  className?: string
}

export default function FileUpload({
  accept = '*',
  maxFiles = 5,
  maxSize = 10,
  multiple = false,
  onUploadComplete,
  onUploadError,
  value = [],
  onChange,
  className = ''
}: FileUploadProps) {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 处理文件选择
  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || !user) {
      setError('请先登录')
      return
    }

    setError(null)

    // 检查文件数量限制
    if (value.length + files.length > maxFiles) {
      setError(`最多只能上传 ${maxFiles} 个文件`)
      return
    }

    const newFiles: UploadedFile[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // 检查文件大小
      if (file.size > maxSize * 1024 * 1024) {
        setError(`文件 "${file.name}" 超过 ${maxSize}MB 大小限制`)
        continue
      }

      try {
        setUploading(true)
        
        const formData = new FormData()
        formData.append('file', file)

        const token = localStorage.getItem('token')
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })

        const data = await res.json()

        if (data.success) {
          newFiles.push(data.data)
        } else {
          setError(`上传失败：${data.error}`)
        }
      } catch (err) {
        console.error('上传错误:', err)
        setError('网络错误，请重试')
      } finally {
        setUploading(false)
      }
    }

    if (newFiles.length > 0) {
      const updatedFiles = [...value, ...newFiles]
      onChange?.(updatedFiles)
      onUploadComplete?.(updatedFiles)
    }
  }, [user, value, maxFiles, maxSize, onChange, onUploadComplete])

  // 拖拽处理
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  // 拖拽放置
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  // 删除文件
  const handleRemove = async (index: number) => {
    const fileToRemove = value[index]
    
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/upload?url=${encodeURIComponent(fileToRemove.url)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const updatedFiles = value.filter((_, i) => i !== index)
      onChange?.(updatedFiles)
    } catch (err) {
      console.error('删除文件错误:', err)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 上传区域 */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${dragActive 
            ? 'border-blue-500 bg-blue-500/5' 
            : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
          }
          ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={() => user && fileInputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <motion.div
          animate={{ scale: dragActive ? 1.05 : 1 }}
          className="space-y-3"
        >
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
            dragActive ? 'bg-blue-500/20' : 'bg-white/5'
          }`}>
            <Upload size={28} className={`${dragActive ? 'text-blue-400' : 'text-slate-400'}`} />
          </div>

          <div>
            <p className="text-white font-medium">
              {dragActive ? '释放以上传文件' : '点击或拖拽文件到此处'}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              支持 JPG、PNG、PDF、ZIP 等格式，单个文件最大 {maxSize}MB
            </p>
          </div>

          {!user && (
            <p className="text-sm text-yellow-400">请先登录后上传</p>
          )}
        </motion.div>
      </div>

      {/* 错误提示 */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            <AlertCircle size={16} />
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-auto hover:text-red-300"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 上传中状态 */}
      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20"
          >
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-blue-400">正在上传...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 已上传文件列表 */}
      <AnimatePresence>
        {value.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <p className="text-sm text-slate-400">已上传文件 ({value.length}/{maxFiles})</p>
            
            <div className="grid gap-2">
              {value.map((file, index) => (
                <motion.div
                  key={file.url}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-colors"
                >
                  {/* 文件图标 */}
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    {getFileIcon(file.type)}
                  </div>

                  {/* 文件信息 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                    >
                      <Download size={16} />
                    </a>
                    
                    <button
                      onClick={() => handleRemove(index)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
