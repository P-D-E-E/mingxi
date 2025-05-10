import { NextRequest, NextResponse } from 'next/server'
import prisma from "@/prisma/client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;
    
    // 验证所有必需字段
    if (!email || !code) {
      return NextResponse.json(
        { error: "邮箱和验证码是必需的" },
        { status: 400 }
      );
    }
    
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      );
    }
    
    // 查找验证码记录
    const passwordReset = await prisma.passwordReset.findFirst({
      where: { 
        email,
        code
      }
    });
    
    if (!passwordReset) {
      return NextResponse.json(
        { error: "验证码不正确" },
        { status: 400 }
      );
    }
    
    // 检查验证码是否过期
    if (new Date() > passwordReset.expiresAt) {
      // 删除过期的验证码
      await prisma.passwordReset.delete({
        where: { id: passwordReset.id }
      });
      
      return NextResponse.json(
        { error: "验证码已过期，请重新获取" },
        { status: 400 }
      );
    }
    
    // 验证码验证成功，返回成功响应（不删除验证码记录，以便在修改密码时再次验证）
    return NextResponse.json({ 
      success: true, 
      message: "验证码验证成功" 
    });
    
  } catch (error) {
    console.error('验证码验证时出错:', error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}