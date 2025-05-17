import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
  try {
    // 查询数据库中 status 为 SELECTED 的 Event 数量
    const count = await prisma.event.count({
      where: { status: 'SELECTED' }
    });
    // 返回数量
    return NextResponse.json({ count }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}