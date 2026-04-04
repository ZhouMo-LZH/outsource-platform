import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取单个服务详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: params.id }
    })

    if (!service) {
      return NextResponse.json(
        { error: '服务不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ service })
  } catch (error) {
    console.error('获取服务详情错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

// 更新服务
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, price, category, image, status } = body

    // 检查服务是否存在
    const existingService = await prisma.service.findUnique({
      where: { id: params.id }
    })

    if (!existingService) {
      return NextResponse.json(
        { error: '服务不存在' },
        { status: 404 }
      )
    }

    // 构建更新数据
    const updateData: any = {}
    if (name) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (price) updateData.price = parseFloat(price)
    if (category) updateData.category = category
    if (image !== undefined) updateData.image = image
    if (status) updateData.status = status

    const service = await prisma.service.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({
      message: '服务更新成功',
      service
    })
  } catch (error) {
    console.error('更新服务错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

// 删除服务
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 检查服务是否存在
    const existingService = await prisma.service.findUnique({
      where: { id: params.id }
    })

    if (!existingService) {
      return NextResponse.json(
        { error: '服务不存在' },
        { status: 404 }
      )
    }

    await prisma.service.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: '服务删除成功'
    })
  } catch (error) {
    console.error('删除服务错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
