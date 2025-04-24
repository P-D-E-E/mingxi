import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token; // 获取用户 token

    // 如果没有 token，直接返回未授权页面
    if (!token) {
      return NextResponse.redirect(new URL("/not-found", req.url));
    }

    // 获取用户角色
    const userRole = token.role;

    // 检查路径和角色
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      // 如果用户访问 /dashboard 且不是 ADMIN
      if (userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/not-found", req.url)); // 重定向到 /not-found
      }
    }

    if (req.nextUrl.pathname.startsWith("/resources")) {
      // 如果用户访问 /resources 且没有对应的权限
      if (!userRole || !["ADMIN", "PREMIUM", "TRIAL"].includes(userRole)) {
        return NextResponse.redirect(new URL("/not-found", req.url));
      }
    }

    // 默认允许访问
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // 在 middleware 中手动处理授权逻辑，所以这里总是返回 true
    },
  }
);

export const config = {
  matcher: [
    "/resources/:path*", // 保护 /resources 及其子路由
    "/dashboard/:path*", // 保护 /dashboard 及其子路由
  ],
};
