import { NextRequest, NextResponse } from 'next/server'
import prisma from "@/prisma/client"

export async function GET(request: NextRequest) {
  try {
    // 从查询字符串中获取email参数
    const url = new URL(request.url)
    const email = url.searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { error: "邮箱参数是必需的" },
        { status: 400 }
      );
    }
    
    // 查询数据库检查邮箱是否存在
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    // 返回邮箱是否存在的结果
    return NextResponse.json({ exists: !!user });
    
  } catch (error) {
    console.error('检查邮箱时出错:', error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}