import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// 使用单例模式创建 Prisma 客户端实例,如果全局已存在则复用,否则创建新实例
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton() 

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma