import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server'; // 导入 NextRequest
import prisma from '@/prisma/client'; // 确保你有正确的 prisma 实例

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url); // 获取查询参数
  const filename = searchParams.get('uniquefilename'); // 获取uniquefilename参数

  try {
    if (filename && filename.endsWith('.pdf')) {
      // 如果uniquefilename存在且以.pdf结尾，查询对应的资源
      const resource = await prisma.resource.findFirst({
        where: { 
          uniquefilename: filename 
        }
      });

      if (!resource) {
        return NextResponse.json({ error: '资源未找到' }, { status: 404 });
      }

      return NextResponse.json(resource, { status: 200 });
    } else {
      // 否则，查询所有资源
      const resources = await prisma.resource.findMany({
        orderBy: {
          createdAt: 'desc' // 按创建时间降序排序，从最新到最旧
        }
      });
      return NextResponse.json(resources, { status: 200 });
    }
  } catch (error) {
    console.error('获取资源失败:', error); // 打印错误信息
    return NextResponse.json({ error: '获取资源失败' }, { status: 500 });
  }
}
