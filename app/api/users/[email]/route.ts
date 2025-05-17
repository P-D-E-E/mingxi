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
// ... 其他代码 ...
export async function PATCH(
  request: Request, 
  { params }: { params: { email: string } }
) {
  const { email } = params;
  const body = await request.json();
  const { role, expiresAt } = body; // 支持 role 和 expiresAt

  try {
    // 构建要更新的数据对象
    const updateData: any = {};
    if (role !== undefined) updateData.role = role;
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt;

    const updatedUser = await prisma.user.update({
      where: { email },
      data: updateData,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: '更新失败', error: error.message }, { status: 500 });
  }
}