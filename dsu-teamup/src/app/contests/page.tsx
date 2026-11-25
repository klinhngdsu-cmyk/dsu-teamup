"use client";

import { useMemo } from "react";
import { ALL_GOALS } from "@/data/taxonomy";
import { AiBar, AiNote, useAiExplain } from "@/components/AiExplain";
import { useLabels } from "@/components/labels";
import { Button, ExcludedList, LevelBadge, NeedActor, PageTitle, RankNumber, WarnLine } from "@/components/ui";
import { rankContests, type ContestResult, type ContestWarning } from "@/lib/match";
import { useStore } from "@/lib/store";
import type { Goal } from "@/lib/types";

interface ContestAi {
  id: string;
  why: string;
  check: string[];
}

function warningCode(w: ContestWarning): string {
  if (w.k === "need_team") return `needs a team of at least ${w.min}`;
  if (w.k === "deadline_soon") return `deadline in ${w.days} days`;
  if (w.k === "effort") return "workload is higher than the student's available time";
  return "";
}

export default function ContestsPage() {
  const { t, currentStudent: s, contests, updateStudent, saved, toggleSaved } = useStore();
  const { L, contestReason, contestWarning, contestExclusion } = useLabels();

  const results = useMemo(() => (s ? rankContests(s, contests) : []), [s, contests]);
  const shown = results.filter((r) => !r.excluded);
  const excluded = results.filter((r) => r.excluded);
  const resetKey = s ? `${s.id}|${s.goals.join(",")}|${s.skills.map((k) => k.tag).join(",")}|${s.interests.join(",")}` : "";
  const ai = useAiExplain<ContestAi>("explain_contests", resetKey);

  if (!s) return <NeedActor kind="student" />;

  const toggleGoal = (g: Goal) =>
    updateStudent({ ...s, goals: s.goals.includes(g) ? s.goals.filter((x) => x !== g) : [...s.goals, g] });

  const explain = () =>
    ai.run({
      student: {
        major: s.major,
        year: s.year,
        languages: s.languages,
        skills: s.skills,
        interests: s.interests,
        goals: s.goals,
        commitment: s.commitment,
      },
      contests: shown.slice(0, 3).map((r: ContestResult) => ({
        id: r.contest.id,
        name: r.contest.name,
        summary: r.contest.summary,
        fields: r.contest.fields,
        useful_skills: r.contest.usefulSkills,
        languages: r.contest.languages,
        days_left: r.daysLeft,
        team_size: `${r.contest.minTeam}-${r.contest.maxTeam}`,
        prize: r.contest.prizeText,
        workload: r.contest.effort,
        matched: r.reasons,
        warnings: r.warnings.map(warningCode).filter(Boolean),
        unclear: r.contest.unclear ?? [],
      })),
    });

  const savedList = saved[s.id] ?? [];

  return (
    <div>
      <PageTitle sub={`${s.name} · ${s.major} ${s.year}`}>{t("contests_title")}</PageTitle>

      <section className="mb-6 rounded-xl border border-line bg-white p-4">
        <h2 className="font-semibold text-ink">{t("contests_priority")}</h2>
        <p className="text-sm text-ink-soft">{t("contests_priority_hint")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ALL_GOALS.map((g) => {
            const on = s.goals.includes(g);
            return (
              <button
                key={g}
                onClick={() => toggleGoal(g)}
                aria-pressed={on}
                className={`rounded-full border px-3 py-1 text-sm ${
                  on ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-soft hover:text-ink"
                }`}
              >
                {L.goal(g)}
              </button>
            );
          })}
        </div>
      </section>

      <div className="mb-4">
        <AiBar state={ai.state} onRun={explain} disabled={shown.length === 0} />
      </div>

      <ol className="divide-y divide-line rounded-xl border border-line bg-white">
        {shown.map((r, i) => {
          const c = r.contest;
          const note = ai.state.items[c.id];
          const isSaved = savedList.includes(c.id);
          return (
            <li key={c.id} className="flex gap-4 p-5">
              <RankNumber n={i + 1} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-ink">{c.name}</h2>
                    <p className="text-sm text-ink-soft">{c.organizer}</p>
                  </div>
                  <LevelBadge level={r.level} />
                </div>
                <p className="mt-2 max-w-[70ch]">{c.summary}</p>
                <p className="mt-2 text-sm text-ink-soft">
                  {t("deadline")} {c.deadline} ({t("daysLeft", { n: r.daysLeft })}) · {t("teamSize", { a: c.minTeam, b: c.maxTeam })} ·{" "}
                  {t("effort")} {L.effort(c.effort)} · {L.scale(c.scale)} · {c.prizeText}
                </p>

                {r.reasons.length > 0 ? (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-ink-soft">{t("why")}</p>
                    <ul className="mt-1 space-y-0.5">
                      {r.reasons.map((reason, j) => (
                        <li key={j}>{contestReason(reason)}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {r.warnings.length > 0 ? (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-warn">{t("check")}</p>
                    <ul className="mt-1 space-y-1">
                      {r.warnings.map((w, j) => (
                        <WarnLine key={j}>{contestWarning(w)}</WarnLine>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {note ? (
                  <AiNote>
                    <p>{note.why}</p>
                    {note.check?.length ? (
                      <ul className="mt-1 list-disc pl-5 text-sm text-warn">
                        {note.check.map((x, j) => (
                          <li key={j}>{x}</li>
                        ))}
                      </ul>
                    ) : null}
                  </AiNote>
                ) : null}

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Button variant={isSaved ? "primary" : "ghost"} onClick={() => toggleSaved(s.id, c.id)}>
                    {isSaved ? t("saved") : t("save")}
                  </Button>
                  <a href={c.sourceUrl} target="_blank" rel="noreferrer" className="text-sm text-brand underline underline-offset-4">
                    {t("source")}
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <ExcludedList
        title={t("contests_excluded")}
        items={excluded.map((r) => ({ key: r.contest.id, name: r.contest.name, reason: contestExclusion(r.excluded!) }))}
      />
    </div>
  );
}
