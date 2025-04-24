import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import prisma from "@/prisma/client";
import { existsSync } from 'fs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

export async function POST(req: NextRequest) {
  try {
    console.log("开始处理资源更新请求");
    
    // 获取当前用户会话
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    
    const userName = session.user.name || '未知用户';
    console.log(`当前用户: ${userName}`);
    
    // 解析表单数据
    const formData = await req.formData();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const file = formData.get('pdf') as File | null;  // 修改这里，从'file'改为'pdf'

    console.log(`更新资源ID: ${id}, 名称: ${name}, 描述长度: ${description?.length}`);
    console.log(`是否上传新文件: ${file ? '是' : '否'}`);

    // 验证必要字段
    if (!id) {
      console.log("错误: 缺少资源ID");
      return NextResponse.json({ error: '缺少资源ID' }, { status: 400 });
    }

    if (!name || !description) {
      console.log("错误: 名称或描述为空");
      return NextResponse.json({ error: '名称和描述为必填项' }, { status: 400 });
    }

    // 查找现有资源
    console.log(`查找资源ID: ${id}`);
    const existingResource = await prisma.resource.findUnique({
      where: { id }
    });

    if (!existingResource) {
      console.log(`错误: 未找到ID为 ${id} 的资源`);
      return NextResponse.json({ error: '资源不存在' }, { status: 404 });
    }

    console.log(`找到资源: ${existingResource.name}`);

    // 准备更新数据
    const updateData: any = {
      name,
      description,
      lastModifier: userName,
      // updatedAt 字段会由 Prisma 自动更新，因为我们在 schema 中使用了 @updatedAt
    };

    // 如果上传了新文件，处理文件
    if (file) {
      try {
        console.log("处理新上传的文件");
        
        // 生成唯一文件名
        const uniqueFilename = `${uuidv4()}.pdf`;
        console.log(`生成的唯一文件名: ${uniqueFilename}`);
        
        // 确保目录存在
        const uploadDir = join(process.cwd(), 'public', 'resource');
        if (!existsSync(uploadDir)) {
          console.log(`创建上传目录: ${uploadDir}`);
          await mkdir(uploadDir, { recursive: true });
        }
        
        // 保存文件
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = join(uploadDir, uniqueFilename);
        
        console.log(`保存文件到: ${filePath}`);
        await writeFile(filePath, buffer);
        
        // 更新文件相关字段 - 修改这里，确保路径格式与create API一致
        updateData.path = `/resource/${uniqueFilename}`;  // 存储相对路径
        updateData.uniquefilename = uniqueFilename;
        
        console.log("文件处理完成");
      } catch (fileError) {
        console.error("文件处理错误:", fileError);
        return NextResponse.json({ 
          error: '文件处理失败', 
          details: fileError instanceof Error ? fileError.message : String(fileError) 
        }, { status: 500 });
      }
    }

    // 更新数据库记录
    console.log("更新数据库记录", updateData);
    const updatedResource = await prisma.resource.update({
      where: { id },
      data: updateData
    });

    console.log("资源更新成功:", updatedResource.id);
    return NextResponse.json(updatedResource, { status: 200 });
  } catch (error) {
    console.error("资源更新失败:", error);
    // 返回更详细的错误信息
    return NextResponse.json({ 
      error: '更新资源失败', 
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}