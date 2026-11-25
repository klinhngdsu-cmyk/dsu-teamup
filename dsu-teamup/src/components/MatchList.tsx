"use client";

import { AiBar, AiNote, useAiExplain } from "./AiExplain";
import { useLabels } from "./labels";
import { Button, ExcludedList, LevelBadge, Marked, Notice, RankNumber, Tag, WarnLine } from "./ui";
import type { MatchResult } from "@/lib/match";
import { useStore } from "@/lib/store";
import type { Student, Team } from "@/lib/types";

interface MatchAi {
  id: string;
  why: string;
  adds: string;
  discuss: string[];
  missing: string[];
}

const studentForAi = (s: Student) => ({
  name: s.name,
  major: s.major,
  year: s.year,
  skills: s.skills,
  roles: s.roles,
  goals: s.goals,
  languages: s.languages,
  free_time: s.slots,
  commitment: s.commitment,
  bio: s.bio,
});

const teamForAi = (tm: Team, contestName: string) => ({
  name: tm.name,
  contest: contestName,
  has_skills: tm.haveSkills,
  needs: tm.needs,
  languages: tm.languages,
  meeting_time: tm.slots,
  goals: tm.goals,
  commitment: tm.commitment,
  description: tm.description,
});

const matchForAi = (r: MatchResult) => ({
  fills: r.fills,
  still_missing: r.stillMissing,
  shared_languages: r.commonLangs,
  shared_time: r.commonSlots,
  shared_goals: r.sharedGoals,
  warnings: r.warnings.map((w) => (w.k === "commitment_gap" ? "large commitment gap" : `missing: ${w.fields.join(",")}`)),
});

export function MatchList({ results, direction }: { results: MatchResult[]; direction: "student_to_team" | "team_to_student" }) {
  const { t, contests, invites, sendRequest } = useStore();
  const { L, join, matchExclusion, matchWarning } = useLabels();
  const shown = results.filter((r) => !r.excluded);
  const excluded = results.filter((r) => r.excluded);
  const idOf = (r: MatchResult) => (direction === "student_to_team" ? r.team.id : r.student.id);
  const contestName = (id: string) => contests.find((c) => c.id === id)?.name ?? id;

  const subject = results[0] ? (direction === "student_to_team" ? results[0].student : results[0].team) : undefined;
  const resetKey = subject ? `${direction}|${JSON.stringify(subject)}` : "";
  const ai = useAiExplain<MatchAi>("explain_matches", resetKey);

  const explain = () => {
    const top = shown.slice(0, 3);
    if (top.length === 0) return;
    if (direction === "student_to_team") {
      ai.run({
        direction,
        student: studentForAi(top[0].student),
        teams: top.map((r) => ({ id: r.team.id, team: teamForAi(r.team, contestName(r.team.contestId)), match: matchForAi(r) })),
      });
    } else {
      ai.run({
        direction,
        team: teamForAi(top[0].team, contestName(top[0].team.contestId)),
        candidates: top.map((r) => ({ id: r.student.id, student: studentForAi(r.student), match: matchForAi(r) })),
      });
    }
  };

  const requestState = (r: MatchResult) =>
    invites.find((i) => i.teamId === r.team.id && i.studentId === r.student.id && i.status !== "declined");

  return (
    <div>
      <div className="mb-4">
        <AiBar state={ai.state} onRun={explain} disabled={shown.length === 0} />
      </div>

      {shown.length === 0 ? (
        <Notice tone="warn">{direction === "team_to_student" ? t("match_empty_team") : t("match_empty_student")}</Notice>
      ) : (
        <ol className="divide-y divide-line rounded-xl border border-line bg-white">
          {shown.map((r, i) => {
            const note = ai.state.items[idOf(r)];
            const existing = requestState(r);
            const evidence = (skill: string) => r.student.skills.find((k) => k.tag === skill)?.evidence;
            return (
              <li key={idOf(r)} className="flex gap-4 p-5">
                <RankNumber n={i + 1} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      {direction === "student_to_team" ? (
                        <>
                          <h2 className="text-lg font-bold text-ink">{r.team.name}</h2>
                          <p className="text-sm text-ink-soft">
                            {t("forContest")}: {contestName(r.team.contestId)} · {t("team_members")} {r.team.memberCount}/
                            {r.team.maxSize}
                          </p>
                        </>
                      ) : (
                        <>
                          <h2 className="text-lg font-bold text-ink">{r.student.name}</h2>
                          <p className="text-sm text-ink-soft">
                            {r.student.major} {r.student.year} · {L.commitment(r.student.commitment)}
                          </p>
                        </>
                      )}
                    </div>
                    <LevelBadge level={r.level} />
                  </div>

                  <p className="mt-2 max-w-[70ch]">{direction === "student_to_team" ? r.team.description : r.student.bio}</p>

                  <div className="mt-3 space-y-1.5">
                    <p className="text-xs font-semibold text-ink-soft">{t("why")}</p>
                    {r.fills.map((f) => (
                      <div key={f.role}>
                        <span className="text-sm text-ink-soft">{t("match_fills")} </span>
                        <strong>{L.role(f.role)}</strong>
                        {": "}
                        {f.skills.map((sk, j) => (
                          <span key={sk}>
                            {j > 0 ? ", " : ""}
                            <Marked>{L.skill(sk)}</Marked>
                            {evidence(sk) ? <span className="text-sm text-ink-soft"> ({evidence(sk)})</span> : null}
                          </span>
                        ))}
                      </div>
                    ))}
                    <p className="text-sm">
                      <span className="text-ink-soft">{t("match_langs")}:</span> {join(r.commonLangs.map(L.lang))}
                      {r.commonSlots.length ? (
                        <>
                          {" · "}
                          <span className="text-ink-soft">{t("match_slots")}:</span> {join(r.commonSlots.map(L.slot))}
                        </>
                      ) : null}
                      {r.sharedGoals.length ? (
                        <>
                          {" · "}
                          <span className="text-ink-soft">{t("match_goals")}:</span> {join(r.sharedGoals.map(L.goal))}
                        </>
                      ) : null}
                    </p>
                    {r.stillMissing.length ? (
                      <p className="flex flex-wrap items-center gap-1.5 text-sm">
                        <span className="text-ink-soft">{t("match_still")}:</span>
                        {r.stillMissing.map((sk) => (
                          <Tag key={sk}>{L.skill(sk)}</Tag>
                        ))}
                      </p>
                    ) : null}
                  </div>

                  {r.warnings.length ? (
                    <ul className="mt-3 space-y-1">
                      {r.warnings.map((w, j) => (
                        <WarnLine key={j}>{matchWarning(w)}</WarnLine>
                      ))}
                    </ul>
                  ) : null}

                  {note ? (
                    <AiNote>
                      <p>{note.why}</p>
                      {note.adds ? (
                        <p className="mt-1 text-sm">
                          <strong>{t("ai_adds")}:</strong> {note.adds}
                        </p>
                      ) : null}
                      {note.discuss?.length ? (
                        <div className="mt-1 text-sm">
                          <strong>{t("ai_discuss")}:</strong>
                          <ul className="list-disc pl-5">
                            {note.discuss.map((x, j) => (
                              <li key={j}>{x}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {note.missing?.length ? (
                        <p className="mt-1 text-sm text-warn">
                          <strong>{t("ai_missing")}:</strong> {note.missing.join(", ")}
                        </p>
                      ) : null}
                    </AiNote>
                  ) : null}

                  <div className="mt-3">
                    {existing ? (
                      <span className="text-sm font-semibold text-ok">
                        {existing.status === "accepted"
                          ? t("status_accepted")
                          : existing.from === "student"
                            ? t("applied")
                            : t("invited")}
                      </span>
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={() =>
                          sendRequest(direction === "student_to_team" ? "student" : "team", r.team.id, r.student.id)
                        }
                      >
                        {direction === "student_to_team" ? t("apply") : t("invite")}
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <ExcludedList
        title={t("match_excluded")}
        items={excluded.map((r) => ({
          key: idOf(r),
          name: direction === "student_to_team" ? r.team.name : r.student.name,
          reason: matchExclusion(r.excluded!),
        }))}
      />
    </div>
  );
}
