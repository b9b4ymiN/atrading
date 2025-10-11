import { cookies } from "next/headers";

const COOKIE = "ct_api_key";
const MAX_AGE = 60 * 60 * 24 * 30; // 30d

export async function readApiKeyFromSession() {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE)?.value || "";
  } catch {
    return "";
  }
}

export async function setApiKeyCookie(key: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE, key, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearApiKeyCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
}
