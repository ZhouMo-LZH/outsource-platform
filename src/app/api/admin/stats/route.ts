import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // 获取今日日期范围
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // 获取本月日期范围
    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)
    const nextMonth = new Date(thisMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    // 并行获取统计数据
    const [
      totalUsers,
      newUsersToday,
      totalOrders,
      ordersToday,
      pendingOrders,
      processingOrders,
      completedOrders,
      totalMessages,
      messagesToday,
      totalRevenue,
      revenueThisMonth,
      totalServices,
      activeServices,
    ] = await Promise.all([
      // 总用户数
      prisma.user.count(),
      // 今日新增用户
      prisma.user.count({
        where: { createdAt: { gte: today, lt: tomorrow } }
      }),
      // 总订单数
      prisma.order.count(),
      // 今日订单
      prisma.order.count({
        where: { createdAt: { gte: today, lt: tomorrow } }
      }),
      // 待处理订单
      prisma.order.count({ where: { status: 'pending' } }),
      // 进行中订单
      prisma.order.count({ where: { status: 'processing' } }),
      // 已完成订单
      prisma.order.count({ where: { status: 'completed' } }),
      // 总消息数
      prisma.message.count(),
      // 今日消息
      prisma.message.count({
        where: { createdAt: { gte: today, lt: tomorrow } }
      }),
      // 总收入
      prisma.order.aggregate({
        where: { status: { not: 'cancelled' } },
        _sum: { amount: true }
      }),
      // 本月收入
      prisma.order.aggregate({
        where: {
          status: { not: 'cancelled' },
          createdAt: { gte: thisMonth, lt: nextMonth }
        },
        _sum: { amount: true }
      }),
      // 总服务数
      prisma.service.count(),
      // 活跃服务数
      prisma.service.count({ where: { status: 'active' } }),
    ])

    // 获取最近订单
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { username: true }
        },
        service: {
          select: { name: true }
        }
      }
    })

    // 获取最近消息
    const recentMessages = await prisma.message.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { username: true }
        }
      }
    })

    // 获取最近用户
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      stats: {
        users: {
          total: totalUsers,
          newToday: newUsersToday,
        },
        orders: {
          total: totalOrders,
          today: ordersToday,
          pending: pendingOrders,
          processing: processingOrders,
          completed: completedOrders,
        },
        messages: {
          total: totalMessages,
          today: messagesToday,
        },
        revenue: {
          total: totalRevenue._sum.amount || 0,
          thisMonth: revenueThisMonth._sum.amount || 0,
        },
        services: {
          total: totalServices,
          active: activeServices,
        },
      },
      recentOrders,
      recentMessages,
      recentUsers,
    })
  } catch (error) {
    console.error('获取统计数据错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
