import { NextRequest, NextResponse } from 'next/server'
import prisma from "@/prisma/client"
import bcrypt from 'bcrypt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, oldPassword } = body;
    
    // 验证所有必需字段
    if (!email || !oldPassword) {
      return NextResponse.json(
        { error: "邮箱和旧密码是必需的" },
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
    
    // 密码验证成功，返回成功响应
    return NextResponse.json({ 
      success: true, 
      message: "身份验证成功"
    });
    
  } catch (error) {
    console.error('验证旧密码时出错:', error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}