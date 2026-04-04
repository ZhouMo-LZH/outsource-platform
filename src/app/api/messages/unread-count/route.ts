import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // 获取所有未读的用户消息（sender 为 user 且 isRead 为 false）
    const unreadCount = await prisma.message.count({
      where: {
        sender: 'user',
        isRead: false,
      },
    })

    return NextResponse.json({ count: unreadCount })
  } catch (error) {
    console.error('获取未读消息数量失败:', error)
    return NextResponse.json(
      { error: '获取失败' },
      { status: 500 }
    )
  }
}
