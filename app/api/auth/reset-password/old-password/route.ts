import { NextRequest, NextResponse } from 'next/server'
import prisma from "@/prisma/client"
import bcrypt from 'bcrypt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, oldPassword, newPassword } = body;
    
    // 验证所有必需字段
    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "所有字段都是必需的" },
        { status: 400 }
      );
    }
    
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user || !user.hashedPassword) {
      return NextResponse.json(
        { error: "用户不存在或密码未设置" },
        { status: 404 }
      );
    }
    
    // 验证旧密码
    const isValidPassword = await bcrypt.compare(oldPassword, user.hashedPassword);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "旧密码不正确" },
        { status: 400 }
      );
    }
    
    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // 更新用户密码
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword }
    });
    
    return NextResponse.json({ success: true, message: "密码已成功更新" });
    
  } catch (error) {
    console.error('重置密码时出错:', error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}