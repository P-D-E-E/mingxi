import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'
import prisma from "@/prisma/client"

export async function POST(request: Request) {
    try {
    const body = await request.json()
    const { name, email, password, role, expiresAt } = body.data   // 1. 增加 expiresAt

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "所有字段都是必填的" },
        { status: 400 }
      )
    }

    const exist = await prisma.user.findUnique({
        where:{
            email: email
        }
    })

    if (exist) {
      return NextResponse.json(
        { message: "该邮箱已被注册" },
        { status: 400 }
      )
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            hashedPassword,
            role: role || 'TRIAL',
            expiresAt: expiresAt || null   // 2. 写入 expiresAt 字段
        }
    })
    
    return new NextResponse(JSON.stringify(user), {status: 200})

  } catch (error) {
    return NextResponse.json(
      { message: "注册失败" },
      { status: 500 }
    )
  }
}