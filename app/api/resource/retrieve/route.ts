import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('uniquefilename');
  
  // 获取分页参数
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  
  // 确保页码和每页数量是有效的
  const validPage = page > 0 ? page : 1;
  const validPageSize = pageSize > 0 ? pageSize : 10;
  
  // 计算跳过的记录数
  const skip = (validPage - 1) * validPageSize;

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
      // 查询符合分页条件的资源
      const resources = await prisma.resource.findMany({
        skip: skip,
        take: validPageSize,
        orderBy: {
          createdAt: 'desc' 
        }
      });
      
      // 获取资源总数，用于计算总页数
      const total = await prisma.resource.count();
      
      // 计算总页数
      const totalPages = Math.ceil(total / validPageSize);
      
      // 返回带有分页信息的响应
      return NextResponse.json({
        data: resources,
        page: validPage,
        pageSize: validPageSize,
        total: total,
        totalPages: totalPages
      }, { status: 200 });
    }
  } catch (error) {
    console.error('获取资源失败:', error);
    return NextResponse.json({ error: '获取资源失败' }, { status: 500 });
  }
}