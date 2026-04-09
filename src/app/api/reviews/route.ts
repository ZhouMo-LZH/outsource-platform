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

// GET /api/reviews - 获取评价列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const serviceId = searchParams.get('serviceId')
    const status = searchParams.get('status') || 'approved'
    
    const skip = (page - 1) * limit
    
    // 构建查询条件
    const where: any = {}
    
    if (serviceId) {
      where.serviceId = serviceId
    }
    
    if (status !== 'all') {
      where.status = status
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.review.count({ where })
    ])

    // 计算平均评分
    const avgRatingResult = await prisma.review.aggregate({
      where: { status: 'approved' },
      _avg: { rating: true },
      _count: { id: true }
    })

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        stats: {
          averageRating: avgRatingResult._avg.rating?.toFixed(1) || '0',
          totalCount: avgRatingResult._count.id
        }
      }
    })
  } catch (error) {
    console.error('获取评价列表错误:', error)
    return NextResponse.json(
      { success: false, error: '获取评价列表失败' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - 创建评价
export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { serviceId, orderId, rating, title, content } = body

    // 输入验证
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: '评分必须在1-5之间' },
        { status: 400 }
      )
    }

    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: '评价内容至少需要10个字符' },
        { status: 400 }
      )
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { success: false, error: '评价内容不能超过1000个字符' },
        { status: 400 }
      )
    }

    // 检查是否已评价过该订单
    if (orderId) {
      const existingReview = await prisma.review.findFirst({
        where: {
          userId: user.id,
          orderId
        }
      })

      if (existingReview) {
        return NextResponse.json(
          { success: false, error: '您已经评价过该订单' },
          { status: 400 }
        )
      }
    }

    // 创建评价
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        serviceId: serviceId || null,
        orderId: orderId || null,
        rating,
        title: title || null,
        content: content.trim(),
        isVerified: !!orderId, // 如果关联订单，标记为已验证
        status: 'pending' // 新评价需要审核
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: review,
      message: '评价提交成功，审核通过后将显示'
    }, { status: 201 })
  } catch (error) {
    console.error('创建评价错误:', error)
    return NextResponse.json(
      { success: false, error: '创建评价失败' },
      { status: 500 }
    )
  }
}
