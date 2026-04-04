import nodemailer from 'nodemailer'

const SMTP_USER = '2962938198@qq.com'
const SMTP_PASS = 'fulpfysnnscudgij' // 你提供的授权码

async function testSMTP() {
  console.log('🔧 测试 QQ 邮箱 SMTP...')
  console.log('邮箱:', SMTP_USER)

  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })

  try {
    // 验证连接
    await transporter.verify()
    console.log('✅ SMTP 连接成功!')

    // 发送测试邮件
    const info = await transporter.sendMail({
      from: `"科技服务平台" <${SMTP_USER}>`,
      to: '2962938198@qq.com',
      subject: '【科技服务平台】SMTP 测试',
      html: '<h1>测试邮件</h1><p>如果你收到这封邮件，说明 SMTP 配置正确！</p>',
    })

    console.log('✅ 邮件发送成功!')
    console.log('邮件ID:', info.messageId)
    console.log('请检查你的邮箱是否收到测试邮件')
  } catch (error) {
    console.error('❌ 失败:', error.message)
    console.error('错误详情:', error)
  }
}

testSMTP()
