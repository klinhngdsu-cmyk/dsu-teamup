"use client";

// Chuyển mã (ví dụ "market_research") thành chữ theo ngôn ngữ đang chọn,
// và chuyển lý do/cảnh báo của logic gợi ý thành câu dễ đọc.

import { COMMITMENT, EFFORT, FIELDS, GOALS, LANGS, ROLES, SCALE, SKILLS, SLOTS, pick } from "@/data/taxonomy";
import type { ContestExclusion, ContestReason, ContestWarning, MatchExclusion, MatchWarning } from "@/lib/match";
import { useStore } from "@/lib/store";
import { Marked } from "./ui";

export function useLabels() {
  const { lang, t } = useStore();
  const L = {
    skill: (k: keyof typeof SKILLS) => pick(SKILLS[k], lang, k),
    field: (k: keyof typeof FIELDS) => pick(FIELDS[k], lang, k),
    goal: (k: keyof typeof GOALS) => pick(GOALS[k], lang, k),
    role: (k: keyof typeof ROLES) => pick(ROLES[k], lang, k),
    lang: (k: keyof typeof LANGS) => pick(LANGS[k], lang, k),
    slot: (k: keyof typeof SLOTS) => pick(SLOTS[k], lang, k),
    commitment: (k: keyof typeof COMMITMENT) => pick(COMMITMENT[k], lang, k),
    effort: (k: keyof typeof EFFORT) => pick(EFFORT[k], lang, k),
    scale: (k: keyof typeof SCALE) => pick(SCALE[k], lang, k),
  };

  const join = (xs: string[]) => xs.join(", ");

  const contestReason = (r: ContestReason) => {
    if (r.k === "interest")
      return (
        <>
          {t("reason_interest")}: <MarkedList items={r.tags.map(L.field)} />
        </>
      );
    if (r.k === "skill")
      return (
        <>
          {t("reason_skill")}: <MarkedList items={r.tags.map(L.skill)} />
        </>
      );
    return (
      <>
        {t("reason_goal")}: <MarkedList items={r.goals.map(L.goal)} />
      </>
    );
  };

  const contestWarning = (w: ContestWarning) => {
    switch (w.k) {
      case "effort":
        return t("warn_effort");
      case "need_team":
        return t("warn_need_team", { n: w.min });
      case "deadline_soon":
        return t("warn_deadline_soon", { n: w.days });
      case "unclear":
        return t("warn_unclear", { t: w.text });
    }
  };

  const contestExclusion = (e: ContestExclusion) => {
    switch (e.k) {
      case "deadline_passed":
        return t("excl_deadline_passed");
      case "year":
        return t("excl_year", { y: e.years.join("·") });
      case "language":
        return t("excl_language", { l: join(e.langs.map(L.lang)) });
    }
  };

  const missingName = (f: string) =>
    ({ skills: t("missing_skills"), slots: t("missing_slots"), bio: t("missing_bio") })[f] ?? f;

  const matchExclusion = (e: MatchExclusion) => {
    switch (e.k) {
      case "no_common_language":
        return t("excl_no_common_language");
      case "schedule_clash":
        return t("excl_schedule_clash");
      case "no_complement":
        return t("excl_no_complement");
      case "missing_info":
        return t("excl_missing_info", { f: join(e.fields.map(missingName)) });
      case "not_recruiting":
        return t("excl_not_recruiting");
    }
  };

  const matchWarning = (w: MatchWarning) =>
    w.k === "commitment_gap" ? t("warn_commitment_gap") : t("warn_missing_info", { f: join(w.fields.map(missingName)) });

  return { L, join, contestReason, contestWarning, contestExclusion, matchExclusion, matchWarning };
}

export function MarkedList({ items }: { items: string[] }) {
  return (
    <>
      {items.map((x, i) => (
        <span key={x}>
          {i > 0 ? ", " : ""}
          <Marked>{x}</Marked>
        </span>
      ))}
    </>
  );
}
