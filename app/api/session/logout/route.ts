import { NextResponse } from "next/server";
import { clearApiKeyCookie } from "@/lib/session";

export async function POST() {
  await clearApiKeyCookie();
  return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL || "http://localhost:3000"));
}
