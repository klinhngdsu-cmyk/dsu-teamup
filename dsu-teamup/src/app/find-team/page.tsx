"use client";

import { useMemo } from "react";
import { MatchList } from "@/components/MatchList";
import { NeedActor, PageTitle } from "@/components/ui";
import { rankTeamsForStudent } from "@/lib/match";
import { useStore } from "@/lib/store";

export default function FindTeamPage() {
  const { t, currentStudent: s, teams } = useStore();
  const results = useMemo(() => (s ? rankTeamsForStudent(s, teams) : []), [s, teams]);
  if (!s) return <NeedActor kind="student" />;
  return (
    <div>
      <PageTitle sub={`${s.name} · ${s.major} ${s.year}`}>{t("findTeam_title")}</PageTitle>
      <MatchList results={results} direction="student_to_team" />
    </div>
  );
}
