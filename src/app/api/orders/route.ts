import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sendNotificationEmail } from '@/lib/email'

// 获取订单列表（支持按用户ID筛选）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    
    if (userId) {
      where.userId = userId
    }
    
    if (status) {
      where.status = status
    }

    const skip = (page - 1) * limit

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              phone: true,
            }
          },
          service: {
            select: {
              id: true,
              name: true,
              price: true,
              category: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where })
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    console.error('获取订单列表错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

// 创建订单
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, serviceId, amount, description, contactInfo } = body

    // 验证必填字段
    if (!serviceId) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      )
    }

    // 查找或创建临时用户（如果是未登录用户）
    let actualUserId = userId
    if (!userId || userId === 'guest') {
      // 查找是否已存在相同邮箱的临时用户
      const existingUser = await prisma.user.findFirst({
        where: { email: contactInfo?.email || 'guest@temp.com' }
      })
      
      if (existingUser) {
        actualUserId = existingUser.id
      } else {
        // 创建临时用户
        const tempUser = await prisma.user.create({
          data: {
            username: contactInfo?.username || '访客',
            email: contactInfo?.email || `guest_${Date.now()}@temp.com`,
            phone: contactInfo?.phone || '',
            password: await bcrypt.hash('temp_password_' + Date.now(), 10),
            isVerified: false,
          }
        })
        actualUserId = tempUser.id
      }
    }

    // 检查服务是否存在
    let service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    // 如果服务不存在，创建一个临时服务记录
    if (!service) {
      service = await prisma.service.create({
        data: {
          id: serviceId,
          name: serviceId,
          description: description || '',
          price: parseFloat(amount) || 0,
          category: '咨询',
        }
      })
    }

    // 创建订单
    const order = await prisma.order.create({
      data: {
        userId: actualUserId,
        serviceId: service.id,
        amount: parseFloat(amount) || 0,
        description: description || null,
        status: 'pending',
        contactName: contactInfo?.username || null,
        contactEmail: contactInfo?.email || null,
        contactPhone: contactInfo?.phone || null,
        remark: contactInfo?.remark || null,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            category: true,
          }
        }
      }
    })

    // 发送邮件通知给管理员
    try {
      const adminEmail = process.env.ADMIN_EMAIL || '2962938198@qq.com'
      const emailSubject = `新订单通知：${service.name}`
      const emailContent = `您收到一条新的服务咨询！

服务项目：${service.name}
订单编号：${order.id}

客户信息：
- 姓名：${contactInfo?.username || '未填写'}
- 邮箱：${contactInfo?.email || '未填写'}
- 电话：${contactInfo?.phone || '未填写'}

备注信息：
${contactInfo?.remark || '无'}

提交时间：${new Date().toLocaleString('zh-CN')}

请及时登录后台处理。`

      console.log('准备发送邮件通知到:', adminEmail)
      const emailResult = await sendNotificationEmail(adminEmail, emailSubject, emailContent)
      console.log('邮件发送结果:', emailResult)
      
      if (!emailResult.success) {
        console.error('发送订单通知邮件失败:', emailResult.error)
      }
    } catch (error) {
      console.error('发送订单通知邮件异常:', error)
    }

    return NextResponse.json({
      message: '订单创建成功',
      order
    })
  } catch (error) {
    console.error('创建订单错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
