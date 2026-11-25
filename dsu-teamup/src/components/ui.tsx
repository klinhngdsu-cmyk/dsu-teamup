"use client";

import { useStore } from "@/lib/store";
import type { FitLevel } from "@/lib/match";

export function PageTitle({ children, sub }: { children: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[1.75rem]">{children}</h1>
      {sub ? <p className="mt-1 max-w-[68ch] text-ink-soft">{sub}</p> : null}
    </div>
  );
}

/** Nhãn trung tính, ví dụ kỹ năng hay ngôn ngữ */
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-md border border-line bg-white px-2 py-0.5 text-sm text-ink-soft">{children}</span>
  );
}

/** Phần khớp nhau: đánh dấu bằng vệt bút dạ quang */
export function Marked({ children }: { children: React.ReactNode }) {
  return <span className="marker text-ink">{children}</span>;
}

export function LevelBadge({ level }: { level: FitLevel }) {
  const { t } = useStore();
  const style =
    level === "high"
      ? "bg-brand text-white"
      : level === "good"
        ? "border border-brand text-brand"
        : "border border-line text-ink-soft";
  return <span className={`inline-block shrink-0 rounded-full px-2.5 py-0.5 text-sm font-semibold ${style}`}>{t(`level_${level}`)}</span>;
}

export function WarnLine({ children }: { children: React.ReactNode }) {
  return <li className="border-l-2 border-warn-line pl-2 text-sm text-warn">{children}</li>;
}

export function RankNumber({ n }: { n: number }) {
  return (
    <span aria-hidden className="w-8 shrink-0 text-right text-2xl font-bold leading-none tabular-nums text-brand">
      {n}
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "quiet";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const style =
    variant === "primary"
      ? "bg-brand text-white hover:bg-brand-deep disabled:bg-ink-soft/40"
      : variant === "ghost"
        ? "border border-brand text-brand hover:bg-brand/5 disabled:border-line disabled:text-ink-soft"
        : "text-ink-soft underline underline-offset-4 hover:text-ink";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${style}`}
    >
      {children}
    </button>
  );
}

/** Danh sách đã bị loại, kèm lý do — gập lại mặc định */
export function ExcludedList({ title, items }: { title: string; items: { key: string; name: string; reason: string }[] }) {
  if (items.length === 0) return null;
  return (
    <details className="mt-8 rounded-xl border border-line bg-white/60 p-4">
      <summary className="cursor-pointer font-semibold text-ink">
        {title} <span className="font-normal text-ink-soft">({items.length})</span>
      </summary>
      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={it.key} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
            <span className="font-medium text-ink sm:w-64 sm:shrink-0">{it.name}</span>
            <span className="text-sm text-ink-soft">✕ {it.reason}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "warn" | "error"; children: React.ReactNode }) {
  const style =
    tone === "error"
      ? "border-stop/40 bg-stop/5 text-stop"
      : tone === "warn"
        ? "border-warn-line bg-white text-warn"
        : "border-line bg-white text-ink-soft";
  return <div className={`rounded-lg border px-3 py-2 text-sm ${style}`}>{children}</div>;
}

/** Hiển thị khi đang xem sai vai trò cho trang này */
export function NeedActor({ kind }: { kind: "student" | "team" }) {
  const { t } = useStore();
  return <Notice tone="warn">{kind === "student" ? t("switchToStudent") : t("switchToTeam")}</Notice>;
}
