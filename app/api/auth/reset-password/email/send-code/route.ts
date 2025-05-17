import { NextRequest, NextResponse } from 'next/server'
import prisma from "@/prisma/client"
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: "邮箱是必需的" },
        { status: 400 }
      );
    }
    
    // 检查邮箱是否存在
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "该邮箱未注册" },
        { status: 404 }
      );
    }
    
    // 生成6位随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 计算验证码过期时间 (15分钟后)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    
    // 删除该邮箱的所有现有验证码
    await prisma.passwordReset.deleteMany({
      where: { email }
    });
    
    // 存储新验证码
    await prisma.passwordReset.create({
      data: {
        email,
        code,
        expiresAt
      }
    });
    
    // 配置邮件传输器
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER,
      port: Number(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    // 发送验证码邮件
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '明曦咨询-密码重置验证码',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #285174; margin-bottom: 10px;">明曦咨询密码修改</h1>
          <p style="font-size: 16px; margin-bottom: 25px;">请使用以下验证码完成密码修改操作</p>
        </div>
        
        <div style="background-color: #f7fafc; border-radius: 6px; padding: 20px; text-align: center; margin-bottom: 25px;">
          <p style="margin-bottom: 10px; font-size: 14px;">您的验证码是：</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #285174; margin: 15px 0;">
            ${code}
          </div>
          <p style="font-size: 14px; color: #718096;">该验证码将在5分钟后过期</p>
        </div>
        
        <div style="font-size: 14px; color: #718096; line-height: 1.6;">
          <p>如果您没有请求修改密码，请忽略此邮件。</p>
          <p style="margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
            此邮件由明曦咨询自动发送，请勿回复。<br>
            <span style="font-weight: bold;">明曦咨询团队</span>
          </p>
        </div>
      </div>
    `,
    });
    
    console.log('邮件发送响应:', info);
    return NextResponse.json({ 
      success: true, 
      message: "验证码已发送到您的邮箱" 
    });
    
  } catch (error) {
    console.error('发送验证码时出错:', error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}