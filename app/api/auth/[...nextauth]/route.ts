import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/prisma/client"
import { Role } from "@prisma/client"
import { authOptions } from "./auth-options"

declare module "next-auth" {
    interface User {
        role: Role;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: Role;
    }
}



const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };