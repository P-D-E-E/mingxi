import { NextRequest, NextResponse } from 'next/server' 
import prisma from "@/prisma/client"
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { data } = await request.json();
    const { name, email, company, wechatAccount, ApplyReason } = data;
    
    // 验证必填字段
    if (!name || !email || !company || !wechatAccount) {      
      return NextResponse.json(      
        { error: "所有字段都是必填的" },         
        { status: 400 }      
      );
    }
    
    // 检查邮箱是否已存在
    const exist = await prisma.trial.findUnique({
      where: {
        email: email
      }
    });

    if (exist) {
      return NextResponse.json(      
        { error: "该邮箱已申请过" },         
        { status: 400 }      
      );
    }
    
    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER,
        port: Number(process.env.EMAIL_PORT),
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        connectionTimeout: 60000, // 增加连接超时时间为60秒
        greetingTimeout: 30000,   // 增加问候超时时间为30秒
        socketTimeout: 60000      // 增加套接字超时时间为60秒
      });

    // 构建邮件内容
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: '[明曦]试用申请',
      html: `
        <h1>收到新的试用申请</h1>
        <p><strong>姓名:</strong> ${name}</p>
        <p><strong>邮箱:</strong> ${email}</p>
        <p><strong>微信号:</strong> ${wechatAccount}</p>
        <p><strong>公司:</strong> ${company}</p>
        <p><strong>申请原因:</strong> ${ApplyReason || '未提供'}</p>
      `,
    };

    // 发送确认邮件给用户
    const userMailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '明曦试用申请确认',
      html: `
        <h1>感谢您的试用申请</h1>
        <p>尊敬的 ${name}：</p>
        <p>我们已收到您的明曦试用申请。我们的团队将尽快审核您的申请并与您联系。</p>
        <p>以下是您提交的信息：</p>
        <ul>
          <li>姓名: ${name}</li>
          <li>邮箱: ${email}</li>
          <li>微信号: ${wechatAccount}</li>
          <li>公司: ${company}</li>
        </ul>
        <p>如有任何疑问，请随时与我们联系。</p>
        <p>祝好，</p>
        <p>明曦团队</p>
      `,
    };

    // 保存到数据库
    const trial = await prisma.trial.create({
      data: {
        name,
        email,
        company,
        wechatAccount,
        ApplyReason
      }
    });
    console.log(data)
    // 发送邮件
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(userMailOptions);

    return NextResponse.json({ success: true, trial });
  } catch (error) {
    console.error('处理申请失败:', error);
    return NextResponse.json({ error: '提交失败，请稍后再试' }, { status: 500 });
  }
}