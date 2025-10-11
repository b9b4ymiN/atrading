import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const key = req.cookies.get("ct_api_key")?.value;
  const url = req.nextUrl.clone();
  const isPublic = url.pathname.startsWith("/login") || url.pathname.startsWith("/health") || url.pathname.startsWith("/_next") || url.pathname.startsWith("/api");

  if (!key && !isPublic) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
