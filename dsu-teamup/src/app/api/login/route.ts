import { PASS_COOKIE, passToken } from "@/lib/passcode";

export async function POST(req: Request) {
  const pass = process.env.DEMO_PASSCODE;
  const body = (await req.json().catch(() => ({}))) as { passcode?: string };
  if (!pass || body.passcode !== pass) {
    return Response.json({ ok: false }, { status: 401 });
  }
  const token = await passToken(pass);
  const res = Response.json({ ok: true });
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.headers.append(
    "Set-Cookie",
    `${PASS_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${secure}`,
  );
  return res;
}
