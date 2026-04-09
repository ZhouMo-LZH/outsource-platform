import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// 验证 JWT Token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; username: string; email: string }
  } catch {
    return null
  }
}

// 允许的文件类型
const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed'
  ],
  code: [
    'text/javascript',
    'text/typescript',
    'text/x-python',
    'text/html',
    'text/css',
    'text/xml',
    'application/json'
  ]
}

// 最大文件大小 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024

// POST /api/upload - 上传文件
export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: '未找到文件' },
        { status: 400 }
      )
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `文件大小不能超过 ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // 验证文件类型
    const allAllowedTypes = [...ALLOWED_TYPES.image, ...ALLOWED_TYPES.document, ...ALLOWED_TYPES.code]
    
    if (!allAllowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: '不支持的文件类型' },
        { status: 400 }
      )
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = path.extname(file.name)
    const fileName = `${timestamp}_${randomStr}${ext}`

    // 确定存储目录
    let category = 'other'
    if (ALLOWED_TYPES.image.includes(file.type)) {
      category = 'images'
    } else if (ALLOWED_TYPES.document.includes(file.type)) {
      category = 'documents'
    } else if (ALLOWED_TYPES.code.includes(file.type)) {
      category = 'code'
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', category)
    
    // 创建目录
    await mkdir(uploadDir, { recursive: true })

    // 保存文件
    const filePath = path.join(uploadDir, fileName)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // 返回文件信息
    const fileUrl = `/uploads/${category}/${fileName}`
    
    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl,
        name: file.name,
        size: file.size,
        type: file.type,
        category
      },
      message: '文件上传成功'
    })
  } catch (error) {
    console.error('文件上传错误:', error)
    return NextResponse.json(
      { success: false, error: '文件上传失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/upload - 删除文件
export async function DELETE(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const fileUrl = searchParams.get('url')

    if (!fileUrl) {
      return NextResponse.json(
        { success: false, error: '缺少文件URL参数' },
        { status: 400 }
      )
    }

    // 安全检查：确保只删除 uploads 目录下的文件
    if (!fileUrl.startsWith('/uploads/')) {
      return NextResponse.json(
        { success: false, error: '无效的文件路径' },
        { status: 400 }
      )
    }

    // 删除文件
    const fs = await import('fs/promises')
    const filePath = path.join(process.cwd(), 'public', fileUrl)

    try {
      await fs.unlink(filePath)
      
      return NextResponse.json({
        success: true,
        message: '文件删除成功'
      })
    } catch (error) {
      console.error('删除文件错误:', error)
      return NextResponse.json(
        { success: false, error: '文件不存在或删除失败' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('删除请求错误:', error)
    return NextResponse.json(
      { success: false, error: '删除请求处理失败' },
      { status: 500 }
    )
  }
}
