import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/prisma/client";
import { Prisma } from '@prisma/client';  // 添加这行导入

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    try {
        // 修改搜索条件，使用正确的枚举类型
        const searchCondition = search ? {
            OR: [
                { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
                { description: { contains: search, mode: Prisma.QueryMode.insensitive } }
            ]
        } : {};

        // 获取总数量
        const totalCount = await prisma.event.count({
            where: searchCondition
        });

        // 获取所有符合条件的事件
        const events = await prisma.event.findMany({
            where: searchCondition,
            skip: skip,
            take: limit,
            orderBy: [
                // 首先按状态排序，SELECTED在前
                { status: 'asc' },
                // 然后按创建时间降序排序
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json({
            events,
            pagination: {
                total: totalCount,
                page,
                limit,
                pages: Math.ceil(totalCount / limit)
            }
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}