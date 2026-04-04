import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendNotificationEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (userId) {
      const messages = await prisma.message.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' }
      })
      return NextResponse.json({ messages })
    }

    const sessions = await prisma.user.findMany({
      where: {
        messages: {
          some: {}
        }
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        _count: {
          select: {
            messages: {
              where: { isRead: false, sender: 'user' }
            }
          }
        }
      }
    })

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('获取消息错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, content, sender } = body

    const message = await prisma.message.create({
      data: {
        userId,
        content,
        sender,
      }
    })

    if (sender === 'user') {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })
      
      if (user) {
        await sendNotificationEmail(
          '2962938198@qq.com',
          '新客户咨询',
          `用户 ${user.username} 发送了新消息：\n\n${content}\n\n请登录后台查看并回复。`
        )
      }
    }

    return NextResponse.json({ message })
  } catch (error) {
    console.error('发送消息错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    await prisma.message.updateMany({
      where: {
        userId,
        sender: 'user',
        isRead: false
      },
      data: { isRead: true }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('标记已读错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
