"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";

export default function Home() {
  const { t, setActor, students, teams } = useStore();
  const steps = [
    { title: t("home_step1"), desc: t("home_step1_d"), href: "/profile" },
    { title: t("home_step2"), desc: t("home_step2_d"), href: "/contests" },
    { title: t("home_step3"), desc: t("home_step3_d"), href: "/find-team" },
  ];

  return (
    <div className="py-6">
      <h1 className="max-w-[22ch] text-3xl font-bold leading-tight tracking-tight text-ink sm:text-[2.6rem]">
        {t("home_title")}
      </h1>
      <p className="mt-4 max-w-[62ch] text-lg text-ink-soft">{t("home_lead")}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/contests"
          onClick={() => setActor({ type: "student", id: students[0]?.id ?? "s1" })}
          className="rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-deep"
        >
          {t("home_cta_student")}
        </Link>
        <Link
          href="/recruit"
          onClick={() => setActor({ type: "team", id: teams[0]?.id ?? "t1" })}
          className="rounded-lg border border-brand px-4 py-2.5 font-semibold text-brand hover:bg-brand/5"
        >
          {t("home_cta_team")}
        </Link>
      </div>

      <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.href} className="bg-white p-5">
            <Link href={s.href} className="group block">
              <span className="text-3xl font-bold tabular-nums text-brand">{i + 1}</span>
              <h2 className="mt-2 font-bold text-ink group-hover:underline">{s.title}</h2>
              <p className="mt-1 text-sm text-ink-soft">{s.desc}</p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
