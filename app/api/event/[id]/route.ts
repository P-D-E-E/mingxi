// app/api/event/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from "@/prisma/client"

// 处理PUT请求 - 更新事件
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // 检查事件是否存在
    const existingEvent = await prisma.event.findUnique({
      where: { id }
    })
    
    if (!existingEvent) {
      return NextResponse.json(
        { error: '要更新的Event不存在' },
        { status: 404 }
      )
    }
    
    // 解析请求体
    const body = await request.json()
    
    // 从请求体中解构数据
    const { 
      name, 
      description, 
      article, 
      image, 
      status 
    } = body
    
    // 基本验证
    if (!name || !description || !article) {
      return NextResponse.json(
        { error: '您需要提供所有必填字段' },
        { status: 400 }
      )
    }
    
    // 确定要使用的状态
    const eventStatus = status || existingEvent.status
    
    // 验证状态值是否有效
    if (eventStatus !== 'SELECTED' && eventStatus !== 'NONSELECTED') {
      return NextResponse.json(
        { error: '无效的Event状态' },
        { status: 400 }
      )
    }
    
    // 如果是SELECTED类型，必须有图片
    if (eventStatus === 'SELECTED' && !image) {
      return NextResponse.json(
        { error: '精选Event必须提供封面图片' },
        { status: 400 }
      )
    }
    
    // 检查是否有其他事件使用了相同的名称（排除当前事件）
    if (name !== existingEvent.name) {
      const nameExists = await prisma.event.findFirst({
        where: { 
          name,
          id: { not: id }
        }
      })
      
      if (nameExists) {
        return NextResponse.json(
          { error: '该Event名称已被其他事件使用' },
          { status: 400 }
        )
      }
    }
    
    // 更新事件
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { 
        name, 
        description, 
        article, 
        image: image || null,
        status: eventStatus,
        updatedAt: new Date()
      }
    })
    
    return NextResponse.json(
      {
        message: '更新成功', 
        event: updatedEvent
      }, 
      { status: 200 }
    )
    
  } catch (error: any) {
    console.error("更新Event失败:", error)
    return NextResponse.json(
      { error: error.message || "服务器内部错误" },
      { status: 500 }
    )
  }
}

// 处理GET请求 - 获取单个事件详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const event = await prisma.event.findUnique({
      where: { id }
    })
    
    if (!event) {
      return NextResponse.json(
        { error: '事件不存在' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ event }, { status: 200 })
    
  } catch (error: any) {
    console.error("获取Event详情失败:", error)
    return NextResponse.json(
      { error: error.message || "服务器内部错误" },
      { status: 500 }
    )
  }
}

// 处理DELETE请求 - 删除事件
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // 检查事件是否存在
    const existingEvent = await prisma.event.findUnique({
      where: { id }
    })
    
    if (!existingEvent) {
      return NextResponse.json(
        { error: '要删除的Event不存在' },
        { status: 404 }
      )
    }
    
    // 删除事件
    await prisma.event.delete({
      where: { id }
    })
    
    return NextResponse.json(
      { message: '删除成功' },
      { status: 200 }
    )
    
  } catch (error: any) {
    console.error("删除Event失败:", error)
    return NextResponse.json(
      { error: error.message || "服务器内部错误" },
      { status: 500 }
    )
  }
}