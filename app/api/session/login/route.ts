import { NextResponse } from "next/server";
import { setApiKeyCookie } from "@/lib/session";

export async function POST(req: Request) {
  const { apiKey } = await req.json().catch(() => ({ apiKey: "" }));
  if (!apiKey) {
    return NextResponse.json({ success: false, message: "Missing apiKey" }, { status: 400 });
  }
  await setApiKeyCookie(apiKey);
  return NextResponse.json({ success: true });
}
