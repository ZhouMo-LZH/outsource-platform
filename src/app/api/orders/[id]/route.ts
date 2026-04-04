import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取单个订单详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            category: true,
            image: true,
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('获取订单详情错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

// 更新订单
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, description, amount } = body

    // 检查订单是否存在
    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      )
    }

    // 构建更新数据
    const updateData: any = {}
    if (status) updateData.status = status
    if (description !== undefined) updateData.description = description
    if (amount) updateData.amount = parseFloat(amount)

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            category: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: '订单更新成功',
      order
    })
  } catch (error) {
    console.error('更新订单错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

// 删除订单
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 检查订单是否存在
    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      )
    }

    await prisma.order.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: '订单删除成功'
    })
  } catch (error) {
    console.error('删除订单错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
