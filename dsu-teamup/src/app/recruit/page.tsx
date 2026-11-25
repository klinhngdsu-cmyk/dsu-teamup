"use client";

import { useMemo } from "react";
import { useLabels } from "@/components/labels";
import { MatchList } from "@/components/MatchList";
import { NeedActor, PageTitle, Tag } from "@/components/ui";
import { rankStudentsForTeam } from "@/lib/match";
import { useStore } from "@/lib/store";

export default function RecruitPage() {
  const { t, currentTeam: tm, students, contests } = useStore();
  const { L } = useLabels();
  const results = useMemo(() => (tm ? rankStudentsForTeam(tm, students) : []), [tm, students]);
  if (!tm) return <NeedActor kind="team" />;
  const contest = contests.find((c) => c.id === tm.contestId);
  return (
    <div>
      <PageTitle sub={`${tm.name} · ${contest?.name ?? ""}`}>{t("recruit_title")}</PageTitle>
      <section className="mb-6 rounded-xl border border-line bg-white p-4">
        <p className="text-xs font-semibold text-ink-soft">{t("team_needs")}</p>
        <ul className="mt-1 space-y-1">
          {tm.needs.map((n) => (
            <li key={n.role} className="flex flex-wrap items-center gap-1.5">
              <strong>{L.role(n.role)}</strong>
              {n.skills.map((sk) => (
                <Tag key={sk}>{L.skill(sk)}</Tag>
              ))}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-ink-soft">
          {t("profile_langs")}: {tm.languages.map(L.lang).join(", ")} · {t("team_time")}: {tm.slots.map(L.slot).join(", ")}
        </p>
      </section>
      <MatchList results={results} direction="team_to_student" />
    </div>
  );
}
