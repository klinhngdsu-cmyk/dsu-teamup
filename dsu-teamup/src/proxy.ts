import { NextResponse, type NextRequest } from "next/server";
import { PASS_COOKIE, passToken } from "@/lib/passcode";

export async function proxy(req: NextRequest) {
  const pass = process.env.DEMO_PASSCODE;
  if (!pass) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (pathname === "/login" || pathname === "/api/login") return NextResponse.next();

  const expected = await passToken(pass);
  if (req.cookies.get(PASS_COOKIE)?.value === expected) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ code: "locked", error: "Demo passcode required" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
