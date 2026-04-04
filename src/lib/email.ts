import { Resend } from 'resend'

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY 环境变量未设置')
  }
  return new Resend(apiKey)
}

const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev'

// 检查必要的配置
function checkEmailConfig() {
  if (!process.env.RESEND_API_KEY) {
    return { valid: false, error: 'RESEND_API_KEY 未配置' }
  }
  return { valid: true }
}

function getVerificationEmailHtml(code: string, formattedDate: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.5); }
        }
        .code-box { animation: glow 2s ease-in-out infinite; }
        .pulse { animation: pulse 2s ease-in-out infinite; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" style="max-width: 640px; background: linear-gradient(180deg, #111118 0%, #0d0d12 100%); border-radius: 28px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.05) inset;">
              
              <tr>
                <td style="position: relative; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%); padding: 60px 50px; text-align: center;">
                  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><defs><pattern id=%22grid%22 width=%2210%22 height=%2210%22 patternUnits=%22userSpaceOnUse%22><path d=%22M 10 0 L 0 0 0 10%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.03)%22 stroke-width=%220.5%22/></pattern></defs><rect width=%22100%22 height=%22100%22 fill=%22url(%23grid)%22/></svg>'); opacity: 0.5;"></div>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="position: relative; z-index: 1;">
                    <tr>
                      <td align="center">
                        <div style="width: 90px; height: 90px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 24px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: 0 20px 40px rgba(99, 102, 241, 0.4);">
                          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <h1 style="color: white; font-size: 32px; font-weight: 700; margin: 0 0 10px; letter-spacing: -0.5px;">科技服务平台</h1>
                        <p style="color: rgba(255,255,255,0.6); font-size: 15px; margin: 0; font-weight: 400;">Enterprise Technology Solutions</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 60px 50px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <div style="display: inline-block; padding: 6px 16px; background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 100px; margin-bottom: 30px;">
                          <span style="color: #818cf8; font-size: 13px; font-weight: 500; letter-spacing: 0.5px;">EMAIL VERIFICATION</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <p style="color: #71717a; font-size: 17px; margin: 0 0 40px; font-weight: 400;">您的验证码是</p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <div class="code-box" style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); border: 2px solid rgba(99, 102, 241, 0.3); border-radius: 20px; padding: 32px 60px; display: inline-block;">
                          <span style="font-size: 56px; font-weight: 800; color: white; letter-spacing: 16px; font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace; text-shadow: 0 0 30px rgba(99, 102, 241, 0.8);">${code}</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-top: 35px;">
                        <p style="color: #52525b; font-size: 14px; margin: 0;">
                          验证码有效期 <span style="color: #a1a1aa; font-weight: 600;">5 分钟</span>，请尽快完成验证
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 0 50px 50px;">
                  <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%); border: 1px solid rgba(99, 102, 241, 0.15); border-radius: 16px; padding: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 16px;">
                          <div style="display: flex; align-items: center; gap: 8px;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            <span style="color: #818cf8; font-size: 14px; font-weight: 600;">安全提示</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="color: #71717a; font-size: 13px; margin: 0; line-height: 1.8;">
                            • 请勿将验证码告知任何人，包括客服人员<br>
                            • 平台不会以任何理由索要您的密码<br>
                            • 如非本人操作，请忽略此邮件
                          </p>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              
              <tr>
                <td style="background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%); padding: 35px 50px; border-top: 1px solid rgba(255,255,255,0.04);">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding-bottom: 20px;">
                              <p style="color: #3f3f46; font-size: 12px; margin: 0;">
                                发送时间
                              </p>
                              <p style="color: #52525b; font-size: 13px; margin: 4px 0 0 0; font-family: 'SF Mono', monospace;">
                                ${formattedDate}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.04);">
                              <p style="color: #27272a; font-size: 11px; margin: 0 0 8px;">
                                此邮件由系统自动发送，请勿直接回复
                              </p>
                              <p style="color: #18181b; font-size: 11px; margin: 0;">
                                © 2024 科技服务平台 · All Rights Reserved
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

function getNotificationEmailHtml(subject: string, content: string, formattedDate: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .pulse-icon { animation: pulse 2s ease-in-out infinite; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" style="max-width: 640px; background: linear-gradient(180deg, #111118 0%, #0d0d12 100%); border-radius: 28px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.05) inset;">
              
              <tr>
                <td style="position: relative; background: linear-gradient(135deg, #052e16 0%, #14532d 50%, #052e16 100%); padding: 60px 50px; text-align: center;">
                  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><defs><pattern id=%22grid%22 width=%2210%22 height=%2210%22 patternUnits=%22userSpaceOnUse%22><path d=%22M 10 0 L 0 0 0 10%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.03)%22 stroke-width=%220.5%22/></pattern></defs><rect width=%22100%22 height=%22100%22 fill=%22url(%23grid)%22/></svg>'); opacity: 0.5;"></div>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="position: relative; z-index: 1;">
                    <tr>
                      <td align="center">
                        <div class="pulse-icon" style="width: 90px; height: 90px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 24px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: 0 20px 40px rgba(34, 197, 94, 0.4);">
                          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            <line x1="9" y1="10" x2="15" y2="10"></line>
                          </svg>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <h1 style="color: white; font-size: 32px; font-weight: 700; margin: 0 0 10px; letter-spacing: -0.5px;">新消息通知</h1>
                        <p style="color: rgba(255,255,255,0.6); font-size: 15px; margin: 0; font-weight: 400;">您有一条新的客户咨询</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 50px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.03) 0%, rgba(16, 185, 129, 0.03) 100%); border: 1px solid rgba(34, 197, 94, 0.1); border-radius: 16px; padding: 30px;">
                        <h2 style="color: #e4e4e7; font-size: 20px; font-weight: 600; margin: 0 0 20px;">${subject}</h2>
                        <p style="color: #a1a1aa; font-size: 15px; line-height: 1.9; margin: 0; white-space: pre-wrap;">${content}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 0 50px 50px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${process.env.NEXT_PUBLIC_API_URL}/admin/chat" style="display: inline-flex; align-items: center; gap: 10px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; text-decoration: none; padding: 18px 45px; border-radius: 14px; font-weight: 600; font-size: 15px; box-shadow: 0 15px 35px rgba(34, 197, 94, 0.35);">
                          <span>立即查看并回复</span>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <tr>
                <td style="background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%); padding: 35px 50px; border-top: 1px solid rgba(255,255,255,0.04);">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding-bottom: 20px;">
                              <p style="color: #3f3f46; font-size: 12px; margin: 0;">
                                发送时间
                              </p>
                              <p style="color: #52525b; font-size: 13px; margin: 4px 0 0 0; font-family: 'SF Mono', monospace;">
                                ${formattedDate}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.04);">
                              <p style="color: #27272a; font-size: 11px; margin: 0 0 8px;">
                                此邮件由系统自动发送，请勿直接回复
                              </p>
                              <p style="color: #18181b; font-size: 11px; margin: 0;">
                                © 2024 科技服务平台 · All Rights Reserved
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

export async function sendVerificationEmail(email: string, code: string) {
  // 检查配置
  const configCheck = checkEmailConfig()
  if (!configCheck.valid) {
    console.error('邮件配置错误:', configCheck.error)
    return { success: false, error: configCheck.error }
  }

  const now = new Date()
  const formattedDate = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  console.log('正在发送邮件到:', email)
  console.log('使用发件人:', EMAIL_FROM)

  try {
    const { data, error } = await getResendClient().emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: '【科技服务平台】邮箱验证码',
      html: getVerificationEmailHtml(code, formattedDate),
    })

    if (error) {
      console.error('Resend 发送邮件失败:', JSON.stringify(error))
      return { success: false, error: error.message || '邮件发送失败' }
    }

    console.log('邮件发送成功:', data)
    return { success: true, data }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('发送邮件异常:', errorMessage, error)
    return { success: false, error: errorMessage || '邮件发送异常' }
  }
}

export async function sendNotificationEmail(to: string, subject: string, content: string) {
  const now = new Date()
  const formattedDate = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  try {
    const { data, error } = await getResendClient().emails.send({
      from: EMAIL_FROM,
      to,
      subject: `【科技服务平台】${subject}`,
      html: getNotificationEmailHtml(subject, content, formattedDate),
    })

    if (error) {
      console.error('Resend 发送通知邮件失败:', error)
      return { success: false, error }
    }

    console.log('通知邮件发送成功:', data)
    return { success: true, data }
  } catch (error) {
    console.error('发送通知邮件失败:', error)
    return { success: false, error }
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
