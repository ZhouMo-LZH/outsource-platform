import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code, newPassword } = body

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: '参数错误' },
        { status: 400 }
      )
    }

    const storedCode = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        type: 'reset',
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

    await prisma.verificationCode.update({
      where: { id: storedCode.id },
      data: { used: true }
    })

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })

    return NextResponse.json({
      success: true,
      message: '密码重置成功'
    })
  } catch (error) {
    console.error('重置密码错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
