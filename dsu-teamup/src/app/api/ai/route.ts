// SERVER: nơi duy nhất gọi Claude API.
// - Key đọc từ biến môi trường ANTHROPIC_API_KEY (cài trên Vercel), không bao giờ gửi ra trình duyệt.
// - Model đọc từ ANTHROPIC_MODEL (tên model trường cho phép).
// - Mỗi phản hồi trả kèm số token thật để ghi log.
// (Route handler mặc định chạy trên Node.js)

import Anthropic from "@anthropic-ai/sdk";
import { ALL_FIELDS, ALL_GOALS, ALL_LANGS, ALL_ROLES, ALL_SKILLS, ALL_SLOTS } from "@/data/taxonomy";
import { LANG_NAME_FOR_AI } from "@/lib/langs";
import type { Lang } from "@/lib/types";


const LANG_NAME = LANG_NAME_FOR_AI;
type UiLang = Lang;
const ACTIONS = ["ping", "explain_contests", "explain_matches", "normalize_profile"] as const;
type Action = (typeof ACTIONS)[number];

// Giới hạn đơn giản để người lạ không dùng hết token của trường
const WINDOW_MS = 10 * 60 * 1000;
const MAX_CALLS = Number(process.env.AI_MAX_CALLS_PER_10MIN ?? 40);
const recentCalls: number[] = [];

const RULES = (lang: UiLang) => `You write short texts inside "DSU TeamUp AI", a university demo that uses fictional data only.
Rules:
- Use only facts in the given JSON. Never invent skills, experience, achievements, people, teams or contest conditions.
- Never infer ability or preferences from nationality, name or language.
- No percentages, scores, or promises of winning or of team success.
- The ranking was already decided by rules. Do not re-rank, drop or add items.
- Write in ${LANG_NAME[lang]}. Plain, friendly, concise.
- Reply with one JSON object only, no markdown.`;

function buildPrompt(action: Action, lang: UiLang, payload: unknown): { system: string; user: string; maxTokens: number } {
  const data = JSON.stringify(payload);
  switch (action) {
    case "ping":
      return { system: "Reply with the single word OK.", user: "ping", maxTokens: 5 };
    case "explain_contests":
      return {
        system: RULES(lang),
        user: `Task: for each contest, write "why" (max 2 sentences citing concrete matching facts about this student) and "check" (0-2 short items taken only from "warnings" or "unclear"; empty list if none).
Output: {"items":[{"id":"","why":"","check":[]}]}
DATA: ${data}`,
        maxTokens: 700,
      };
    case "explain_matches":
      return {
        system: RULES(lang),
        user: `Task: for each match between a student and a team, write:
"why": max 2 sentences on the fit, citing the student's matching skills and evidence, shared language and overlapping time;
"adds": 1 sentence on what ${(payload as { direction?: string })?.direction === "team_to_student" ? "this student adds to the team" : "the student would add to this team"};
"discuss": 1-2 short items both sides should agree on first, based on the data (remaining missing skills, time, commitment);
"missing": information absent from the data that matters (empty list if none).
Output: {"items":[{"id":"","why":"","adds":"","discuss":[],"missing":[]}]}
DATA: ${data}`,
        maxTokens: 800,
      };
    case "normalize_profile":
      return {
        system: RULES(lang),
        user: `Task: turn a student's free text into profile fields. Use ONLY these codes.
skills: ${ALL_SKILLS.join(",")}
interests: ${ALL_FIELDS.join(",")}
goals: ${ALL_GOALS.join(",")}
roles: ${ALL_ROLES.join(",")}
languages: ${ALL_LANGS.join(",")}
slots: ${ALL_SLOTS.join(",")}
commitment: low (<=3h/week) | mid (4-8h) | high (9h+) | null
Include only what the text states or clearly implies. For each skill, "evidence" briefly restates what the text says (in ${LANG_NAME[lang]}). Do not guess; leave lists empty when unsure.
Output: {"skills":[{"tag":"","evidence":""}],"interests":[],"goals":[],"roles":[],"languages":[],"slots":[],"commitment":null}
TEXT: ${data}`,
        maxTokens: 500,
      };
  }
}

function parseJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("AI did not return JSON");
  return JSON.parse(text.slice(start, end + 1));
}

// Kiểm tra lại kết quả chuẩn hoá hồ sơ: bỏ mọi mã không có trong danh sách cố định
function cleanProfile(raw: unknown) {
  const r = (raw ?? {}) as Record<string, unknown>;
  const pick = <T extends string>(v: unknown, allowed: readonly T[]) =>
    Array.isArray(v) ? (v.filter((x) => allowed.includes(x as T)) as T[]) : [];
  const skills = Array.isArray(r.skills)
    ? (r.skills as { tag?: string; evidence?: string }[])
        .filter((s) => ALL_SKILLS.includes(s?.tag as never))
        .map((s) => ({ tag: s.tag, evidence: String(s.evidence ?? "").slice(0, 200) }))
    : [];
  const commitment = ["low", "mid", "high"].includes(r.commitment as string) ? r.commitment : null;
  return {
    skills,
    interests: pick(r.interests, ALL_FIELDS),
    goals: pick(r.goals, ALL_GOALS),
    roles: pick(r.roles, ALL_ROLES),
    languages: pick(r.languages, ALL_LANGS),
    slots: pick(r.slots, ALL_SLOTS),
    commitment,
  };
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ code: "no_key", error: "ANTHROPIC_API_KEY is not set on the server" }, { status: 503 });
  }

  const raw = await req.text();
  if (raw.length > 20_000) return Response.json({ code: "bad_request", error: "Request too large" }, { status: 413 });

  let body: { action?: string; lang?: string; payload?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ code: "bad_request", error: "Invalid JSON" }, { status: 400 });
  }
  const action = body.action as Action;
  const lang = (body.lang ?? "ko") as UiLang;
  if (!ACTIONS.includes(action) || !(lang in LANG_NAME)) {
    return Response.json({ code: "bad_request", error: "Unknown action or language" }, { status: 400 });
  }

  const now = Date.now();
  while (recentCalls.length && now - recentCalls[0] > WINDOW_MS) recentCalls.shift();
  if (recentCalls.length >= MAX_CALLS) {
    return Response.json({ code: "rate_limited", error: "Too many AI calls. Try again in a few minutes." }, { status: 429 });
  }
  recentCalls.push(now);

  const model = process.env.ANTHROPIC_MODEL || "claude-haiku-5-5";
  const { system, user, maxTokens } = buildPrompt(action, lang, body.payload);
  const client = new Anthropic({ apiKey });
  const t0 = Date.now();

  try {
    const msg = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    });
    const text = msg.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { text: string }).text)
      .join("");
    let data: unknown = { text };
    if (action !== "ping") {
      data = parseJson(text);
      if (action === "normalize_profile") data = cleanProfile(data);
    }
    return Response.json({
      data,
      usage: { input: msg.usage.input_tokens, output: msg.usage.output_tokens },
      ms: Date.now() - t0,
      model: msg.model,
    });
  } catch (e) {
    const status = (e as { status?: number }).status ?? 502;
    const message = e instanceof Error ? e.message : "Unknown error";
    // Không bao giờ in key ra log; chỉ ghi loại lỗi
    console.error("[ai] call failed", action, status);
    return Response.json({ code: "upstream", error: message.slice(0, 300) }, { status: status >= 400 && status < 600 ? status : 502 });
  }
}
