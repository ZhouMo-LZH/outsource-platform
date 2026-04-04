import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {}
  }

  // 检查环境变量
  results.checks.envVars = {
    DATABASE_URL: process.env.DATABASE_URL ? '已设置' : '未设置',
    JWT_SECRET: process.env.JWT_SECRET ? '已设置' : '未设置',
  }

  // 检查数据库连接
  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('连接超时')), 5000)
    )

    const dbPromise = prisma.$queryRaw`SELECT 1 as test`
    
    await Promise.race([dbPromise, timeoutPromise])
    
    results.checks.database = {
      status: '连接成功',
      message: '数据库连接正常'
    }
  } catch (error: any) {
    results.checks.database = {
      status: '连接失败',
      error: error?.message || '未知错误',
      code: error?.code
    }
  }

  // 检查用户表
  try {
    const userCount = await prisma.user.count()
    results.checks.users = {
      status: '成功',
      count: userCount
    }
  } catch (error: any) {
    results.checks.users = {
      status: '失败',
      error: error?.message
    }
  }

  return NextResponse.json(results, { status: 200 })
}
