// LOGIC GỢI Ý — chạy bằng quy tắc, KHÔNG tốn token.
// Bước 1: lọc cứng (loại và ghi lý do)
// Bước 2: chấm điểm theo quy tắc để xếp hạng
// Bước 3 (ở chỗ khác): Claude chỉ đọc vài kết quả đầu để viết lời giải thích.

import type { Contest, Field, Goal, Level3, Role, Skill, Slot, SpokenLang, Student, Team } from "./types";

export type FitLevel = "high" | "good" | "consider";

// ---------- Gợi ý cuộc thi ----------

export type ContestReason =
  | { k: "interest"; tags: Field[] }
  | { k: "skill"; tags: Skill[] }
  | { k: "goal"; goals: Goal[] };

export type ContestWarning =
  | { k: "effort" }
  | { k: "need_team"; min: number }
  | { k: "deadline_soon"; days: number }
  | { k: "unclear"; text: string };

export type ContestExclusion =
  | { k: "deadline_passed" }
  | { k: "year"; years: number[] }
  | { k: "language"; langs: SpokenLang[] };

export interface ContestResult {
  contest: Contest;
  score: number;
  level: FitLevel;
  daysLeft: number;
  reasons: ContestReason[];
  warnings: ContestWarning[];
  excluded?: ContestExclusion;
}

const LEVEL_NUM: Record<Level3, number> = { low: 1, mid: 2, high: 3 };

export function daysUntil(dateStr: string, today: Date = new Date()): number {
  const d = new Date(dateStr + "T23:59:59+09:00");
  return Math.ceil((d.getTime() - today.getTime()) / 86_400_000);
}

const intersect = <T,>(a: readonly T[], b: readonly T[]) => a.filter((x) => b.includes(x));

function goalPoints(goal: Goal, c: Contest): number {
  switch (goal) {
    case "prize":
      return c.prizeLevel * 2;
    case "learning":
      return c.beginnerFriendly ? 3 : 0;
    case "portfolio":
      return { campus: 1, regional: 2, national: 3, global: 3 }[c.scale];
    case "network":
      return c.fields.includes("global") || c.maxTeam >= 4 ? 2 : 0;
    case "startup":
      return c.fields.includes("startup") ? 3 : 0;
  }
}

export function rankContests(student: Student, contests: Contest[], today = new Date()): ContestResult[] {
  const studentSkills = student.skills.map((s) => s.tag);

  const results = contests.map((c): ContestResult => {
    const daysLeft = daysUntil(c.deadline, today);
    const base = { contest: c, daysLeft, reasons: [] as ContestReason[], warnings: [] as ContestWarning[] };

    // Bước 1: lọc cứng
    if (daysLeft < 0) return { ...base, score: 0, level: "consider", excluded: { k: "deadline_passed" } };
    if (c.eligibleYears && !c.eligibleYears.includes(student.year))
      return { ...base, score: 0, level: "consider", excluded: { k: "year", years: c.eligibleYears } };
    if (intersect(c.languages, student.languages).length === 0)
      return { ...base, score: 0, level: "consider", excluded: { k: "language", langs: c.languages } };

    // Bước 2: chấm điểm
    let score = 0;
    const interestHit = intersect(student.interests, c.fields);
    if (interestHit.length) {
      score += Math.min(6, interestHit.length * 3);
      base.reasons.push({ k: "interest", tags: interestHit });
    }
    const skillHit = intersect(studentSkills, c.usefulSkills);
    if (skillHit.length) {
      score += Math.min(6, skillHit.length * 2);
      base.reasons.push({ k: "skill", tags: skillHit });
    }
    const goalHit: Goal[] = [];
    for (const g of student.goals) {
      const p = goalPoints(g, c);
      if (p > 0) {
        score += p;
        goalHit.push(g);
      }
    }
    if (goalHit.length) base.reasons.push({ k: "goal", goals: goalHit });
    if (LEVEL_NUM[c.effort] > LEVEL_NUM[student.commitment]) {
      score -= 3;
      base.warnings.push({ k: "effort" });
    }
    if (c.minTeam > 1) base.warnings.push({ k: "need_team", min: c.minTeam });
    if (daysLeft <= 21) base.warnings.push({ k: "deadline_soon", days: daysLeft });
    for (const u of c.unclear ?? []) base.warnings.push({ k: "unclear", text: u });

    const level: FitLevel = score >= 13 ? "high" : score >= 8 ? "good" : "consider";
    return { ...base, score, level };
  });

  return sortResults(results);
}

// ---------- Ghép đội hai chiều ----------

export type MatchExclusion =
  | { k: "no_common_language" }
  | { k: "schedule_clash" }
  | { k: "no_complement" }
  | { k: "missing_info"; fields: ("skills" | "slots")[] }
  | { k: "not_recruiting" };

export type MatchWarning = { k: "commitment_gap" } | { k: "missing_info"; fields: ("slots" | "bio")[] };

export interface MatchResult {
  student: Student;
  team: Team;
  score: number;
  level: FitLevel;
  /** Vai trò đội đang cần và kỹ năng sinh viên có thể bổ sung */
  fills: { role: Role; skills: Skill[]; roleWanted: boolean }[];
  /** Kỹ năng đội cần nhưng sinh viên chưa có */
  stillMissing: Skill[];
  commonLangs: SpokenLang[];
  commonSlots: Slot[];
  sharedGoals: Goal[];
  warnings: MatchWarning[];
  excluded?: MatchExclusion;
}

export function evaluateMatch(student: Student, team: Team): MatchResult {
  const studentSkills = student.skills.map((s) => s.tag);
  const commonLangs = intersect(student.languages, team.languages);
  const commonSlots = intersect(student.slots, team.slots);
  const sharedGoals = intersect(student.goals, team.goals);
  const neededSkills = team.needs.flatMap((n) => n.skills);
  const fills = team.needs
    .map((n) => ({ role: n.role, skills: intersect(studentSkills, n.skills), roleWanted: student.roles.includes(n.role) }))
    .filter((f) => f.skills.length > 0);
  const covered = new Set(fills.flatMap((f) => f.skills));
  const stillMissing = Array.from(new Set(neededSkills.filter((s) => !covered.has(s))));

  const base = { student, team, fills, stillMissing, commonLangs, commonSlots, sharedGoals, warnings: [] as MatchWarning[] };
  const out = (excluded: MatchExclusion): MatchResult => ({ ...base, score: 0, level: "consider", excluded });

  // Bước 1: lọc cứng
  if (!team.recruiting || team.memberCount >= team.maxSize) return out({ k: "not_recruiting" });
  if (studentSkills.length === 0) {
    const fields: ("skills" | "slots")[] = ["skills"];
    if (student.slots.length === 0) fields.push("slots");
    return out({ k: "missing_info", fields });
  }
  if (commonLangs.length === 0) return out({ k: "no_common_language" });
  if (student.slots.length > 0 && commonSlots.length === 0) return out({ k: "schedule_clash" });
  if (fills.length === 0) return out({ k: "no_complement" });

  // Bước 2: chấm điểm
  let score = 0;
  for (const f of fills) {
    score += Math.min(6, f.skills.length * 3);
    if (f.roleWanted) score += 2;
  }
  score += Math.min(4, sharedGoals.length * 2);
  score += Math.min(3, commonSlots.length);
  const gap = Math.abs(LEVEL_NUM[student.commitment] - LEVEL_NUM[team.commitment]);
  if (gap === 0) score += 2;
  if (gap === 2) {
    score -= 2;
    base.warnings.push({ k: "commitment_gap" });
  }
  const missing: ("slots" | "bio")[] = [];
  if (student.slots.length === 0) missing.push("slots");
  if (!student.bio.trim()) missing.push("bio");
  if (missing.length) base.warnings.push({ k: "missing_info", fields: missing });

  const level: FitLevel = score >= 12 ? "high" : score >= 7 ? "good" : "consider";
  return { ...base, score, level };
}

/** Chiều sinh viên → đội */
export function rankTeamsForStudent(student: Student, teams: Team[]): MatchResult[] {
  return sortResults(teams.map((t) => evaluateMatch(student, t)));
}

/** Chiều đội → ứng viên */
export function rankStudentsForTeam(team: Team, students: Student[]): MatchResult[] {
  return sortResults(students.filter((s) => s.seekingTeam).map((s) => evaluateMatch(s, team)));
}

function sortResults<T extends { score: number; excluded?: unknown }>(list: T[]): T[] {
  return [...list].sort((a, b) => {
    if (!!a.excluded !== !!b.excluded) return a.excluded ? 1 : -1;
    return b.score - a.score;
  });
}

/** Các thông tin hồ sơ còn thiếu — hiển thị để người dùng bổ sung, không tính phần trăm. */
export function missingProfileFields(s: Student): string[] {
  const m: string[] = [];
  if (s.skills.length === 0) m.push("skills");
  if (s.skills.some((k) => !k.evidence.trim())) m.push("evidence");
  if (s.slots.length === 0) m.push("slots");
  if (s.goals.length === 0) m.push("goals");
  if (s.roles.length === 0) m.push("roles");
  if (s.interests.length === 0) m.push("interests");
  if (!s.bio.trim()) m.push("bio");
  return m;
}
