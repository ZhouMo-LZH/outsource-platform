import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 存储在线管理员的内存映射（实际项目中可以使用 Redis）
const onlineAdmins = new Map<string, number>()

// 清理超时的心跳（5分钟未更新视为离线）
const HEARTBEAT_TIMEOUT = 5 * 60 * 1000

export async function GET() {
  try {
    // 清理过期的心跳
    const now = Date.now()
    const entries = Array.from(onlineAdmins.entries())
    for (const [adminId, lastHeartbeat] of entries) {
      if (now - lastHeartbeat > HEARTBEAT_TIMEOUT) {
        onlineAdmins.delete(adminId)
      }
    }

    // 检查是否有在线的管理员
    const hasOnlineAdmin = onlineAdmins.size > 0

    return NextResponse.json({
      online: hasOnlineAdmin,
      count: onlineAdmins.size
    })
  } catch (error) {
    console.error('获取客服状态失败:', error)
    return NextResponse.json(
      { error: '获取状态失败', online: false },
      { status: 500 }
    )
  }
}

// 管理员心跳接口
export async function POST(request: Request) {
  try {
    const { adminId } = await request.json()
    
    if (!adminId) {
      return NextResponse.json(
        { error: '缺少管理员ID' },
        { status: 400 }
      )
    }

    // 更新心跳时间
    onlineAdmins.set(adminId, Date.now())

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('更新客服状态失败:', error)
    return NextResponse.json(
      { error: '更新状态失败' },
      { status: 500 }
    )
  }
}

// 管理员登出接口
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get('adminId')
    
    if (adminId) {
      onlineAdmins.delete(adminId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除客服状态失败:', error)
    return NextResponse.json(
      { error: '删除状态失败' },
      { status: 500 }
    )
  }
}
