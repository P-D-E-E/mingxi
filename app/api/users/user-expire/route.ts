// app/api/user-expire/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/prisma/client";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.email) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: token.email }
  });
  if (!user) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }
  return NextResponse.json({ expiresAt: user.expiresAt });
}