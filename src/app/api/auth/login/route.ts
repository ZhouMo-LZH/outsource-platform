import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: '请填写完整信息' },
        { status: 400 }
      )
    }

    // 设置数据库查询超时
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('数据库连接超时')), 8000)
    )

    const userPromise = prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username }
        ]
      }
    })

    const user = await Promise.race([userPromise, timeoutPromise]) as any

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 401 }
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    })
  } catch (error: any) {
    console.error('登录错误:', error)
    
    // 如果是超时错误，返回更友好的提示
    if (error?.message?.includes('timeout') || error?.message?.includes('超时')) {
      return NextResponse.json(
        { error: '服务器响应超时，请稍后重试' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}
