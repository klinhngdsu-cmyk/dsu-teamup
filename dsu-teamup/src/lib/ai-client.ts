// Gọi AI từ giao diện: luôn đi qua server của mình (/api/ai), không bao giờ gọi Claude trực tiếp.
// Kết quả được lưu lại: nếu dữ liệu không đổi thì dùng lại, không tốn token lần nữa.

import type { AiLogEntry, Lang } from "./types";

export type AiAction = "ping" | "explain_contests" | "explain_matches" | "normalize_profile";

export interface AiOk<T> {
  ok: true;
  data: T;
  usage: { input: number; output: number };
  ms: number;
  model: string;
  cached: boolean;
}
export interface AiFail {
  ok: false;
  code: "no_key" | "locked" | "rate_limited" | "bad_request" | "upstream" | "network";
  message: string;
}

function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

export async function callAi<T>(
  action: AiAction,
  lang: Lang,
  payload: unknown,
  hooks: {
    cacheGet: (k: string) => unknown;
    cacheSet: (k: string, v: unknown) => void;
    logAi: (e: AiLogEntry) => void;
  },
  opts: { useCache?: boolean } = { useCache: true },
): Promise<AiOk<T> | AiFail> {
  const body = JSON.stringify({ action, lang, payload });
  const key = `${action}:${hash(body)}`;

  if (opts.useCache !== false) {
    const hit = hooks.cacheGet(key) as AiOk<T> | undefined;
    if (hit) {
      hooks.logAi({ at: new Date().toISOString(), action, inputTokens: 0, outputTokens: 0, ms: 0, model: hit.model, cached: true });
      return { ...hit, cached: true };
    }
  }

  let res: Response;
  try {
    res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body });
  } catch (e) {
    return { ok: false, code: "network", message: String(e) };
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, code: json.code ?? "upstream", message: json.error ?? `HTTP ${res.status}` };

  const result: AiOk<T> = { ok: true, data: json.data, usage: json.usage, ms: json.ms, model: json.model, cached: false };
  hooks.logAi({
    at: new Date().toISOString(),
    action,
    inputTokens: result.usage.input,
    outputTokens: result.usage.output,
    ms: result.ms,
    model: result.model,
    cached: false,
  });
  if (opts.useCache !== false) hooks.cacheSet(key, result);
  return result;
}
