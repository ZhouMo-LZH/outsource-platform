import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 设置超时
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database timeout')), 5000)
    )
    
    const servicesPromise = prisma.service.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' }
    })
    
    const services = await Promise.race([servicesPromise, timeoutPromise]) as any[]
    
    return NextResponse.json({ services })
  } catch (error) {
    console.error('获取服务列表错误:', error)
    // 返回空数组而不是错误，让页面能正常显示
    return NextResponse.json({ services: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, category, image } = body

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        image: image || null,
      }
    })

    return NextResponse.json({ 
      message: '服务创建成功',
      service 
    })
  } catch (error) {
    console.error('创建服务错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
