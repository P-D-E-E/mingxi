import { NextRequest, NextResponse } from "next/server";
import { userSchema } from "./schema";
import prisma from "@/prisma/client";
import { Role } from "@prisma/client";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') as Role | null;
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const skip = (page - 1) * pageSize;

    // 查询总数
    const totalCount = await prisma.user.count({
        where: {
            ...(role ? { role } : {}),
            ...(search ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ]
            } : {})
        },
    });

    // 查询当前页数据
    const users = await prisma.user.findMany({
        where: {
            ...(role ? { role } : {}),
            ...(search ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ]
            } : {})
        },
        skip,
        take: pageSize,
        orderBy: {
            createdAt: 'desc'
        }
    });

    return NextResponse.json({
        users,
        totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize)
    });
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = userSchema.safeParse(body)
    if (!validation.success) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    // const { name, email, age } = validation.data;

    const updatedUser = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email
        }
    });
    return NextResponse.json(updatedUser, {status: 201});
}