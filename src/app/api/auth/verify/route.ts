import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未提供认证令牌' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    try {
      // 验证 token
      jwt.verify(token, JWT_SECRET)
      return NextResponse.json({ valid: true })
    } catch {
      return NextResponse.json(
        { error: '无效的令牌', valid: false },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('验证令牌错误:', error)
    return NextResponse.json(
      { error: '服务器错误', valid: false },
      { status: 500 }
    )
  }
}
