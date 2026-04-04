import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, oldPassword, newPassword } = body

    if (!userId || !oldPassword || !newPassword) {
      return NextResponse.json(
        { error: '参数错误' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: '原密码错误' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    return NextResponse.json({
      success: true,
      message: '密码修改成功'
    })
  } catch (error) {
    console.error('修改密码错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
