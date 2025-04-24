import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { userSchema } from "../schema";
import prisma from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  const user = await prisma.user.findUnique({
    where: {
      email: params.email
    }
  });
  
  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(user);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  const body = await request.json();
  const validation = userSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }
  
  const user = await prisma.user.findUnique({
    where: {
      email: params.email
    }
  });
  
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: body.name,
      email: body.email
    }
  });
  
  return NextResponse.json(updatedUser);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  const user = await prisma.user.findUnique({
    where: {
      email: params.email
    }
  });
  
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  
  await prisma.user.delete({
    where: { id: user.id }
  });
  
  return NextResponse.json({ message: "User deleted" });
}

export async function PATCH(
  request: Request, 
  { params }: { params: { email: string } }
) {
  const { email } = params; // 从 URL 中获取 email
  const body = await request.json();
  const { role } = body; // 从请求体中获取角色

  try {
    const updatedUser = await prisma.user.update({
      where: { email }, // 使用 email 查找用户
      data: { role },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) { // 添加类型标注
    console.error(error); // 打印错误以便调试
    return NextResponse.json({ message: '更新失败', error: error.message }, { status: 500 });
  }
}