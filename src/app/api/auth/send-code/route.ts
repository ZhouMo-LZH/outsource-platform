import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail, generateCode } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, type } = body

    if (!email) {
      return NextResponse.json(
        { error: '请输入邮箱地址' },
        { status: 400 }
      )
    }

    if (type === 'register') {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: '该邮箱已被注册' },
          { status: 400 }
        )
      }
    }

    if (type === 'reset') {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (!existingUser) {
        return NextResponse.json(
          { error: '该邮箱未注册' },
          { status: 400 }
        )
      }
    }

    const code = generateCode(6)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    await prisma.verificationCode.create({
      data: {
        email,
        code,
        type: type || 'register',
        expiresAt,
      }
    })

    const emailResult = await sendVerificationEmail(email, code)
    
    if (!emailResult.success) {
      console.error('邮件发送失败详情:', emailResult.error)
      return NextResponse.json(
        { error: '验证码发送失败，请稍后重试' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: '验证码已发送到您的邮箱',
      success: true
    })
  } catch (error) {
    console.error('发送验证码错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
