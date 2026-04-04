import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.qq.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, content, html } = body

    if (!to || !subject || (!content && !html)) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 发送邮件
    const info = await transporter.sendMail({
      from: `"周末服务平台" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: content,
      html: html || content.replace(/\n/g, '<br>'),
    })

    console.log('邮件发送成功:', info.messageId)

    return NextResponse.json({
      message: '邮件发送成功',
      messageId: info.messageId
    })
  } catch (error) {
    console.error('发送邮件错误:', error)
    return NextResponse.json(
      { error: '邮件发送失败' },
      { status: 500 }
    )
  }
}
