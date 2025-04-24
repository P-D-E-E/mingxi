import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const body = await request.json();
  const { status } = body;

  // 验证状态值
  if (status !== 'SELECTED' && status !== 'NONSELECTED') {
    return NextResponse.json({ error: '无效的状态值' }, { status: 400 });
  }

  try {
    // 如果要设置为SELECTED，先检查是否已有3个SELECTED状态的事件
    if (status === 'SELECTED') {
      const selectedCount = await prisma.event.count({
        where: {
          status: 'SELECTED',
          id: { not: id } // 排除当前事件
        }
      });

      if (selectedCount >= 3) {
        return NextResponse.json(
          { error: '最多只能有3个事件被标记为SELECTED状态' },
          { status: 400 }
        );
      }
    }

    // 更新事件状态
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedEvent);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}