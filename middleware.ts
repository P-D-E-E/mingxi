import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;

    if (!token) {
      return NextResponse.redirect(new URL("/trial", req.url));
    }

    const userRole = token.role;

    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      if (userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/not-found", req.url));
      }
    }

    if (req.nextUrl.pathname.startsWith("/resources")) {
      // 1. 校验角色
      if (!userRole || !["ADMIN", "PREMIUM", "TRIAL"].includes(userRole)) {
        return NextResponse.redirect(new URL("/not-found", req.url));
      }
      // 2. 校验到期时间
      if ([ "PREMIUM", "TRIAL"].includes(userRole)) {
        try {
          const baseUrl = req.nextUrl.origin || process.env.NEXTAUTH_URL;
          const res = await fetch(`${baseUrl}/api/users/user-expire`, {
            headers: {
              cookie: req.headers.get("cookie") || "",
            },
          });
          if (res.ok) {
            const data = await res.json();
            if (!data.expiresAt || new Date(data.expiresAt) < new Date()) {
              // 已过期
              return NextResponse.redirect(new URL("/notice", req.url));
            }
          } else {
            // 查询失败，默认拒绝
            return NextResponse.redirect(new URL("/notice", req.url));
          }
        } catch (e) {
          // 网络或其他错误，默认拒绝
          return NextResponse.redirect(new URL("/notice", req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    "/resources/:path*",
    "/dashboard/:path*",
  ],
};