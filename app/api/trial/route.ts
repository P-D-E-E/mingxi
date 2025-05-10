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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333;">
        <div style="background-color: #f7fafc; border-radius: 6px; padding: 20px; margin: 25px 0;">
          <p style="font-weight: bold; margin-bottom: 12px; font-size: 16px;">申请信息详情：</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            <tr>
              <td style="padding: 10px 15px 10px 0; border-bottom: 1px solid #e2e8f0; width: 30%; color: #4a5568;">姓名</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${name}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px 15px 10px 0; border-bottom: 1px solid #e2e8f0; color: #4a5568;">邮箱</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${email}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px 15px 10px 0; border-bottom: 1px solid #e2e8f0; color: #4a5568;">微信号</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${wechatAccount}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px 15px 10px 0; border-bottom: 1px solid #e2e8f0; color: #4a5568;">公司</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${company}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px 15px 10px 0; vertical-align: top; color: #4a5568;">申请原因</td>
              <td style="padding: 10px 0;"><strong>${ApplyReason || '未提供'}</strong></td>
            </tr>
          </table>
        </div>
      </div>
    `,
    };

    // 发送确认邮件给用户
    const userMailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '明曦试用申请确认',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #2c5282; margin-bottom: 15px;">感谢您的试用申请</h1>
        </div>
        
        <div style="font-size: 15px; line-height: 1.6;">
          <p>尊敬的 <strong>${name}</strong>：</p>
          <p>我们已收到您的明曦咨询试用申请。我们的团队将尽快审核您的申请并与您联系。</p>
          
          <div style="background-color: #f7fafc; border-radius: 6px; padding: 20px; margin: 25px 0;">
            <p style="font-weight: bold; margin-bottom: 12px;">以下是您提交的信息：</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 15px 8px 0; border-bottom: 1px solid #e2e8f0; width: 30%;">姓名</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>${name}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 15px 8px 0; border-bottom: 1px solid #e2e8f0;">邮箱</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>${email}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 15px 8px 0; border-bottom: 1px solid #e2e8f0;">微信号</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>${wechatAccount}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 15px 8px 0;">公司</td>
                <td style="padding: 8px 0;"><strong>${company}</strong></td>
              </tr>
            </table>
          </div>
          
          <p>如有任何疑问，请随时与我们联系。</p>
          
          <div style="margin-top: 30px;">
            <p style="margin-bottom: 5px;">祝好，</p>
            <p style="font-weight: bold; color: #2c5282;">明曦咨询团队</p>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #718096; text-align: center;">
          <p>此邮件由明曦咨询自动发送，请勿回复。</p>
        </div>
      </div>
    `,
    };

    // 更新或创建记录
    let trial;
    if (exist) {
      // 如果记录已存在，则更新
      trial = await prisma.trial.update({
        where: {
          email: email
        },
        data: {
          name,
          company,
          wechatAccount,
          ApplyReason,
        }
      });
    } else {
      // 如果记录不存在，则创建新记录
      trial = await prisma.trial.create({
        data: {
          name,
          email,
          company,
          wechatAccount,
          ApplyReason
        }
      });
    }
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