import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const onlineAdmins = new Map<string, number>()
const onlineUsers = new Map<string, number>()

const HEARTBEAT_TIMEOUT = 5 * 60 * 1000

export async function GET() {
  try {
    const now = Date.now()
    
    const adminEntries = Array.from(onlineAdmins.entries())
    for (const [adminId, lastHeartbeat] of adminEntries) {
      if (now - lastHeartbeat > HEARTBEAT_TIMEOUT) {
        onlineAdmins.delete(adminId)
      }
    }

    const userEntries = Array.from(onlineUsers.entries())
    for (const [userId, lastHeartbeat] of userEntries) {
      if (now - lastHeartbeat > HEARTBEAT_TIMEOUT) {
        onlineUsers.delete(userId)
      }
    }

    const hasOnlineAdmin = onlineAdmins.size > 0

    return NextResponse.json({
      online: hasOnlineAdmin,
      count: onlineAdmins.size,
      onlineUsers: Array.from(onlineUsers.keys())
    })
  } catch (error) {
    console.error('获取客服状态失败:', error)
    return NextResponse.json(
      { error: '获取状态失败', online: false, onlineUsers: [] },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { adminId, userId } = body
    
    if (adminId) {
      onlineAdmins.set(adminId, Date.now())
    }
    
    if (userId) {
      onlineUsers.set(userId, Date.now())
    }

    if (!adminId && !userId) {
      return NextResponse.json(
        { error: '缺少ID' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('更新状态失败:', error)
    return NextResponse.json(
      { error: '更新状态失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get('adminId')
    const userId = searchParams.get('userId')
    
    if (adminId) {
      onlineAdmins.delete(adminId)
    }
    
    if (userId) {
      onlineUsers.delete(userId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除状态失败:', error)
    return NextResponse.json(
      { error: '删除状态失败' },
      { status: 500 }
    )
  }
}
