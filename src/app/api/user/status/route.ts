import { NextResponse } from 'next/server'

const onlineUsers = new Map<string, number>()

const HEARTBEAT_TIMEOUT = 5 * 60 * 1000

export async function GET() {
  try {
    const now = Date.now()
    const entries = Array.from(onlineUsers.entries())
    for (const [userId, lastHeartbeat] of entries) {
      if (now - lastHeartbeat > HEARTBEAT_TIMEOUT) {
        onlineUsers.delete(userId)
      }
    }

    return NextResponse.json({
      onlineUsers: Array.from(onlineUsers.keys()),
      count: onlineUsers.size
    })
  } catch (error) {
    console.error('获取用户在线状态失败:', error)
    return NextResponse.json(
      { error: '获取状态失败', onlineUsers: [] },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: '缺少用户ID' },
        { status: 400 }
      )
    }

    onlineUsers.set(userId, Date.now())

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('更新用户在线状态失败:', error)
    return NextResponse.json(
      { error: '更新状态失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (userId) {
      onlineUsers.delete(userId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除用户在线状态失败:', error)
    return NextResponse.json(
      { error: '删除状态失败' },
      { status: 500 }
    )
  }
}
