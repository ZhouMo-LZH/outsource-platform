import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code, type } = body

    if (!email || !code) {
      return NextResponse.json(
        { error: '参数错误' },
        { status: 400 }
      )
    }

    const storedCode = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        type: type || 'register',
        used: false,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!storedCode) {
      return NextResponse.json(
        { error: '验证码无效或已过期' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '验证成功'
    })
  } catch (error) {
    console.error('验证验证码错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
