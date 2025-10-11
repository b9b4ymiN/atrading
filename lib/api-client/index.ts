import { readApiKeyFromSession } from "@/lib/session";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://crypto-test.duckdns.org";

type Opts = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
  cacheSeconds?: number;
  tag?: string;
};

function sleep(ms: number) { 
  return new Promise(res => setTimeout(res, ms)); 
}

async function fetchRetry(url: string, init: RequestInit, tries = 2) {
  let last: any;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, init);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (e) {
      last = e; 
      await sleep(150 * (i + 1) + Math.random() * 150);
    }
  }
  throw last;
}

export async function apiFetch<T = unknown>(path: string, opts: Opts = {}) {
  const { cacheSeconds, tag, headers, ...rest } = opts;
  const isGet = !rest.method || rest.method === "GET";
  const nextOpts: any = {};

  if (isGet && typeof cacheSeconds === "number") {
    nextOpts.next = { revalidate: cacheSeconds, tags: tag ? [tag] : undefined };
  } else if (isGet) {
    nextOpts.cache = "no-store";
  }

  const key = await readApiKeyFromSession();
  const res = await fetchRetry(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      "content-type": "application/json",
      ...(key ? { "X-API-Key": key } : {}),
      ...headers,
    },
    ...nextOpts,
  });

  const text = await res.text();
  try { 
    return JSON.parse(text) as T; 
  } catch { 
    return text as unknown as T; 
  }
}
