"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DictKey } from "@/lib/i18n";
import { LANG_BUTTON, UI_LANGS } from "@/lib/langs";
import { useStore } from "@/lib/store";

const NAV: { href: string; key: DictKey }[] = [
  { href: "/", key: "nav_home" },
  { href: "/profile", key: "nav_profile" },
  { href: "/contests", key: "nav_contests" },
  { href: "/find-team", key: "nav_findTeam" },
  { href: "/recruit", key: "nav_recruit" },
  { href: "/invites", key: "nav_invites" },
  { href: "/admin", key: "nav_admin" },
];

export function Header() {
  const { t, lang, setLang, actor, setActor, students, teams, invites } = useStore();
  const pathname = usePathname();
  if (pathname === "/login") return null;

  const pending = invites.filter(
    (i) =>
      i.status === "pending" &&
      ((actor.type === "student" && i.studentId === actor.id && i.from === "team") ||
        (actor.type === "team" && i.teamId === actor.id && i.from === "student")),
  ).length;

  return (
    <header>
      {/* Hàng trên: tên sản phẩm, chọn vai trò, chọn ngôn ngữ — nền trắng */}
      <div className="bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-baseline gap-1.5 text-xl font-extrabold tracking-tight">
            <span className="text-brand">DSU</span>
            <span className="text-ink">TeamUp AI</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              {t("viewingAs")}
              <select
                className="max-w-56 rounded-md border border-line bg-white px-2 py-1.5 text-sm text-ink"
                value={`${actor.type}:${actor.id}`}
                onChange={(e) => {
                  const [type, id] = e.target.value.split(":");
                  setActor({ type: type as "student" | "team", id });
                }}
              >
                <optgroup label={t("student")}>
                  {students.map((s) => (
                    <option key={s.id} value={`student:${s.id}`}>
                      {s.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label={t("team")}>
                  {teams.map((tm) => (
                    <option key={tm.id} value={`team:${tm.id}`}>
                      {tm.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </label>
            {UI_LANGS.length > 1 ? (
              <div className="flex overflow-hidden rounded-md border border-line" role="group" aria-label="Language">
                {UI_LANGS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    aria-pressed={lang === l}
                    className={`px-3 py-1 text-sm ${lang === l ? "bg-brand text-white" : "bg-white text-ink-soft hover:text-ink"}`}
                  >
                    {LANG_BUTTON[l]}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Thanh menu đỏ DSU, mục đang chọn màu đỏ đậm */}
      <nav className="bg-brand" aria-label="Main">
        <ul className="mx-auto flex max-w-5xl overflow-x-auto px-2 sm:px-4">
          {NAV.map((n) => {
            const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={active ? "page" : undefined}
                  className={`block whitespace-nowrap px-4 py-3 text-[0.95rem] font-semibold text-white ${
                    active ? "bg-brand-deep" : "hover:bg-brand-deep/60"
                  }`}
                >
                  {t(n.key)}
                  {n.href === "/invites" && pending > 0 ? (
                    <span className="ml-1.5 rounded-full bg-white px-1.5 text-xs font-bold text-brand">{pending}</span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <p className="border-b border-line bg-white px-4 py-1.5 text-center text-xs text-ink-soft">{t("mockBanner")}</p>
    </header>
  );
}
