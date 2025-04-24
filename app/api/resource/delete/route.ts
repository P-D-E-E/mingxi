// app/api/resource/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // 验证用户权限
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    // 获取请求体
    const data = await request.json();
    const { ids } = data;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: '请提供有效的资源ID' }, { status: 400 });
    }

    // 查询要删除的资源信息，以便后续删除文件
    const resources = await prisma.resource.findMany({
      where: {
        id: {
          in: ids
        }
      },
      select: {
        id: true,
        uniquefilename: true
      }
    });

    if (resources.length === 0) {
      return NextResponse.json({ error: '未找到指定的资源' }, { status: 404 });
    }

    // 删除数据库记录
    await prisma.resource.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    // 删除对应的文件
    const uploadDir = path.join(process.cwd(), 'public', 'resource');
    
    for (const resource of resources) {
      const filePath = path.join(uploadDir, resource.uniquefilename);
      
      // 检查文件是否存在，存在则删除
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`已删除文件: ${filePath}`);
      } else {
        console.log(`文件不存在: ${filePath}`);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `成功删除 ${resources.length} 个资源` 
    });

  } catch (error: any) {
    console.error('删除资源失败:', error);
    return NextResponse.json({ error: `删除资源失败: ${error.message}` }, { status: 500 });
  }
}