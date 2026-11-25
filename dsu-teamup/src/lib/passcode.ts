// Mật khẩu demo: chặn người lạ vào web và tiêu token của trường.
// Đặt biến môi trường DEMO_PASSCODE trên Vercel để bật. Không đặt = không khoá (khi chạy thử trên máy).

export const PASS_COOKIE = "teamup_pass";

export async function passToken(passcode: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`teamup:${passcode}`));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
