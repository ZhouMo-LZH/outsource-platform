import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

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

// GET /api/notifications - 获取用户通知列表
export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    
    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = { userId: user.id }
    
    if (unreadOnly) {
      where.isRead = false
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId: user.id, isRead: false }
      })
    ])

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        stats: {
          unreadCount,
          totalCount: total
        }
      }
    })
  } catch (error) {
    console.error('获取通知列表错误:', error)
    return NextResponse.json(
      { success: false, error: '获取通知列表失败' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - 创建通知（内部使用）
export async function POST(request: NextRequest) {
  try {
    // 验证是否为管理员或系统调用（简化版，实际应该有更严格的验证）
    const adminKey = request.headers.get('x-admin-key')
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { success: false, error: '无权限' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { userId, type, title, content, data } = body

    if (!userId || !type || !title) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        content: content || null,
        data: data ? JSON.stringify(data) : null
      }
    })

    return NextResponse.json({
      success: true,
      data: notification
    }, { status: 201 })
  } catch (error) {
    console.error('创建通知错误:', error)
    return NextResponse.json(
      { success: false, error: '创建通知失败' },
      { status: 500 }
    )
  }
}
