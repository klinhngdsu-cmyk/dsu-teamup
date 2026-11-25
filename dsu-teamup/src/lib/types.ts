// Kiểu dữ liệu dùng chung cho toàn bộ web.
// Mọi dữ liệu trong bản demo đều là dữ liệu giả lập.

/** Ngôn ngữ giao diện. Bật/tắt trong src/lib/langs.ts */
export type Lang = "ko" | "en" | "vi" | "zh" | "ja" | "hi";

/** Chữ hiển thị: bắt buộc có tiếng Hàn và tiếng Anh; ngôn ngữ khác thiếu thì dùng tiếng Anh */
export type Labels = { ko: string; en: string } & Partial<Record<Lang, string>>;

export type Skill =
  | "market_research"
  | "marketing"
  | "content_writing"
  | "presentation"
  | "business_plan"
  | "planning_pm"
  | "uiux_design"
  | "graphic_design"
  | "video_editing"
  | "frontend"
  | "backend"
  | "ai_ml"
  | "data_analysis"
  | "survey_research"
  | "translation"
  | "finance";

export type Field =
  | "ai_tech"
  | "marketing_brand"
  | "startup"
  | "design"
  | "data"
  | "social_impact"
  | "culture_content"
  | "global";

export type Goal = "prize" | "learning" | "portfolio" | "network" | "startup";

export type Role =
  | "developer"
  | "designer"
  | "planner"
  | "marketer_researcher"
  | "presenter"
  | "data_analyst"
  | "content_creator";

export type SpokenLang = "ko" | "en" | "vi" | "zh" | "ja" | "hi";

export type Slot =
  | "mon_eve"
  | "tue_eve"
  | "wed_eve"
  | "thu_eve"
  | "fri_eve"
  | "weekend"
  | "weekday_day";

export type Level3 = "low" | "mid" | "high";

export interface Contest {
  id: string;
  name: string;
  organizer: string;
  summary: string;
  fields: Field[];
  usefulSkills: Skill[];
  /** Ngôn ngữ được phép dùng để nộp bài / làm việc */
  languages: SpokenLang[];
  /** Chỉ năm học này được dự thi (bỏ trống = không giới hạn) */
  eligibleYears?: number[];
  minTeam: number;
  maxTeam: number;
  deadline: string; // YYYY-MM-DD
  prizeLevel: 0 | 1 | 2 | 3;
  prizeText: string;
  beginnerFriendly: boolean;
  scale: "campus" | "regional" | "national" | "global";
  effort: Level3;
  /** Điều kiện chưa rõ trong thông báo, cần người dùng tự kiểm tra */
  unclear?: string[];
  sourceUrl: string;
}

export interface SkillEvidence {
  tag: Skill;
  evidence: string;
}

export interface Student {
  id: string;
  name: string;
  major: string;
  year: number;
  languages: SpokenLang[];
  skills: SkillEvidence[];
  interests: Field[];
  goals: Goal[];
  roles: Role[];
  slots: Slot[];
  commitment: Level3;
  bio: string;
  seekingTeam: boolean;
}

export interface TeamNeed {
  role: Role;
  skills: Skill[];
}

export interface Team {
  id: string;
  name: string;
  contestId: string;
  memberCount: number;
  maxSize: number;
  haveSkills: Skill[];
  needs: TeamNeed[];
  languages: SpokenLang[];
  slots: Slot[];
  goals: Goal[];
  commitment: Level3;
  description: string;
  recruiting: boolean;
}

export type InviteStatus = "pending" | "accepted" | "declined";

export interface Invite {
  id: string;
  /** "team" = đội mời sinh viên; "student" = sinh viên ứng tuyển vào đội */
  from: "team" | "student";
  teamId: string;
  studentId: string;
  status: InviteStatus;
  createdAt: string;
}

export interface Actor {
  type: "student" | "team";
  id: string;
}

export interface AiLogEntry {
  at: string;
  action: string;
  inputTokens: number;
  outputTokens: number;
  ms: number;
  model: string;
  cached: boolean;
}
