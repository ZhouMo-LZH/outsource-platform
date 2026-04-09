import nodemailer from 'nodemailer'

// 从环境变量读取配置
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.qq.com'
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS

console.log('邮件配置:', {
  host: SMTP_HOST,
  port: SMTP_PORT,
  user: SMTP_USER ? '已设置' : '未设置',
  pass: SMTP_PASS ? '已设置' : '未设置'
})

if (!SMTP_USER || !SMTP_PASS) {
  console.error('错误: SMTP_USER 或 SMTP_PASS 未设置')
}

const port = SMTP_PORT
const secure = port === 465

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: port,
  secure: secure,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  requireTLS: port === 587,
  // 添加调试
  debug: true,
  logger: true
})

// 验证配置
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP 验证失败:', error)
  } else {
    console.log('SMTP 服务器连接成功')
  }
})

function getVerificationEmailHtml(code: string, formattedDate: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>邮箱验证码</title>
    </head>
    <body style="margin: 0; padding: 40px; background: #f5f5f5; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h1 style="color: #333; text-align: center;">周末平台</h1>
        <p style="color: #666; text-align: center;">您的验证码是：</p>
        <div style="text-align: center; padding: 30px; background: #f0f0f0; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 48px; font-weight: bold; color: #4f46e5; letter-spacing: 8px;">${code}</span>
        </div>
        <p style="color: #999; text-align: center;">验证码有效期 5 分钟，请尽快完成验证</p>
        <p style="color: #ccc; text-align: center; font-size: 12px; margin-top: 30px;">发送时间: ${formattedDate}</p>
      </div>
    </body>
    </html>
  `
}

export async function sendVerificationEmail(email: string, code: string) {
  const now = new Date()
  const formattedDate = now.toLocaleString('zh-CN')

  // 检查配置
  if (!SMTP_USER || !SMTP_PASS) {
    console.error('邮件发送失败: 环境变量未设置')
    return { success: false, error: '服务器配置错误: SMTP 未配置' }
  }

  try {
    console.log('开始发送邮件到:', email)
    
    const result = await transporter.sendMail({
      from: `"周末平台" <${SMTP_USER}>`,
      to: email,
      subject: '【周末平台】邮箱验证码',
      html: getVerificationEmailHtml(code, formattedDate),
    })
    
    console.log('邮件发送成功:', result.messageId)
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('发送邮件失败:', errorMessage)
    return { success: false, error: errorMessage }
  }
}

export function generateCode(length: number): string {
  const chars = '0123456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
