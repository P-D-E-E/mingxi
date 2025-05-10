import { NextResponse } from 'next/server';
import prisma from "@/prisma/client"
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // 用于生成唯一的文件名

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const file = formData.get('pdf') as File;
  const lastModifier = formData.get('lastModifier') as string || null; // 获取最后修改者信息

  if (!file) {
    return NextResponse.json({ error: '文件未提供' }, { status: 400 });
  }

  // 生成唯一文件名并替换中文字符
  const uniqueFileName = `${uuidv4()}.pdf`;
  const uploadsDir = path.join("uploads", 'resource');

  // 确保 uploads 文件夹存在
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, uniqueFileName); // 确保文件路径正确

  try {
    // 将文件保存到指定路径
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(filePath, fileBuffer); // 使用 promises 处理文件写入

    // 将资源信息存储到数据库
    const resource = await prisma.resource.create({
      data: {
        name,
        description,
        uniquefilename: uniqueFileName,
        path: filePath,
        lastModifier, // 添加最后修改者信息
        // updatedAt 和 createdAt 会由 Prisma 自动处理
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('文件上传失败:', error); // 打印错误信息
    return NextResponse.json({ error: '资源创建失败' }, { status: 500 });
  }
}