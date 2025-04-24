// app/api/event/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from "@/prisma/client"
import { Prisma, EventType } from '@prisma/client';

// 处理GET请求 - 获取事件列表
export async function GET(request: NextRequest) {
    // GET 方法保持不变
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as EventType | null;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6'); // 默认每页6条
    const skip = (page - 1) * limit;

    if (!status) {
        return NextResponse.json(
            { message: "缺少 status 参数" },
            { status: 400 }
        );
    }

    const validStatuses = ["SELECTED", "NONSELECTED"];
    if (!validStatuses.includes(status)) {
        return NextResponse.json(
            { message: "status字段不符合要求" },
            { status: 400 }
        );
    }

    // 对SELECTED和NONSELECTED分别处理
    if (status === "SELECTED") {
        // SELECTED只返回最新的3个，不需要分页
        const events = await prisma.event.findMany({
            where: {
                status: status as EventType,  // 添加类型转换
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 3 // 只取最新的3个
        });
        
        return NextResponse.json(events, { status: 200 });
    } else {
        // NONSELECTED需要分页
        // 获取总数量
        const totalCount = await prisma.event.count({
            where: {
                status: status as EventType,
            },
        });

        // 获取分页数据
        const events = await prisma.event.findMany({
            where: {
                status: status as EventType,  // 添加类型转换
            },
            skip: skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
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
    }
}

// 处理POST请求 - 创建新事件
export async function POST(request: NextRequest) {
    try {
        // 解析请求体
        const body = await request.json();
        
        // 从请求体中解构数据
        const { 
            name, 
            description, 
            article, 
            image, 
            author,
            status 
        } = body;
        
        // 基本验证
        if (!name || !description || !article) {
            return NextResponse.json(
                { error: '您需要提供所有必填字段' },
                { status: 400 }
            );
        }
        
        // 确定要使用的状态
        const eventStatus = status || 'NONSELECTED';
        
        // 验证状态值是否有效
        if (eventStatus !== 'SELECTED' && eventStatus !== 'NONSELECTED') {
            return NextResponse.json(
                { error: '无效的Event状态' },
                { status: 400 }
            );
        }
        
        // 如果是SELECTED类型，必须有图片
        if (eventStatus === 'SELECTED' && !image) {
            return NextResponse.json(
                { error: '精选Event必须提供封面图片' },
                { status: 400 }
            );
        }
        
        // 检查名称是否已存在
        const exist = await prisma.event.findFirst({ 
            where: { name } 
        });
        
        if (exist) {
            return NextResponse.json(
                { error: '该Event名称已存在' },
                { status: 400 }
            );
        }
        
        // 获取当前用户ID
        const authorId = author || "clqnvnvxs0000ufwwxvxvxvxv"; // 默认ID或从会话中获取
        
        // 创建新事件
        const event = await prisma.event.create({ 
            data: { 
                name, 
                description, 
                article, 
                image: image || null,
                authorId: authorId,
                status: eventStatus
            } 
        });
        
        return NextResponse.json(
            {
                message: '创建成功', 
                event: event
            }, 
            { status: 200 }
        );
    } catch (error: any) {
        console.error("创建Event失败:", error);
        return NextResponse.json(
            { error: error.message || "服务器内部错误" },
            { status: 500 }
        );
    }
}