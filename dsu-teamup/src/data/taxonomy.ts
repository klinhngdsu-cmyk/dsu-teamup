// Danh sách cố định: kỹ năng, lĩnh vực, mục tiêu, vai trò, ngôn ngữ, khung giờ.
// AI chỉ được chọn trong các danh sách này -> so khớp được dù người dùng viết bằng ngôn ngữ nào.

import type { Field, Goal, Labels, Lang, Level3, Role, Skill, Slot, SpokenLang } from "@/lib/types";

/** Lấy chữ theo ngôn ngữ; thiếu bản dịch thì dùng tiếng Anh */
export const pick = (l: Labels | undefined, lang: Lang, fallback = ""): string => (l ? (l[lang] ?? l.en) : fallback);

export const SKILLS: Record<Skill, Labels> = {
  market_research: { ko: "시장조사", en: "Market research", vi: "Nghiên cứu thị trường" },
  marketing: { ko: "마케팅", en: "Marketing", vi: "Marketing" },
  content_writing: { ko: "콘텐츠 작성", en: "Content writing", vi: "Viết nội dung" },
  presentation: { ko: "발표", en: "Presenting", vi: "Thuyết trình" },
  business_plan: { ko: "사업계획서", en: "Business planning", vi: "Kế hoạch kinh doanh" },
  planning_pm: { ko: "기획·PM", en: "Planning & PM", vi: "Lên kế hoạch & quản lý" },
  uiux_design: { ko: "UI/UX 디자인", en: "UI/UX design", vi: "Thiết kế UI/UX" },
  graphic_design: { ko: "그래픽 디자인", en: "Graphic design", vi: "Thiết kế đồ hoạ" },
  video_editing: { ko: "영상 편집", en: "Video editing", vi: "Dựng video" },
  frontend: { ko: "프론트엔드 개발", en: "Frontend dev", vi: "Lập trình giao diện" },
  backend: { ko: "백엔드 개발", en: "Backend dev", vi: "Lập trình server" },
  ai_ml: { ko: "AI·머신러닝", en: "AI & ML", vi: "AI & học máy" },
  data_analysis: { ko: "데이터 분석", en: "Data analysis", vi: "Phân tích dữ liệu" },
  survey_research: { ko: "설문·사용자 조사", en: "Surveys & user research", vi: "Khảo sát người dùng" },
  translation: { ko: "번역", en: "Translation", vi: "Dịch thuật" },
  finance: { ko: "재무·회계", en: "Finance", vi: "Tài chính" },
};

export const FIELDS: Record<Field, Labels> = {
  ai_tech: { ko: "AI·기술", en: "AI & tech", vi: "AI & công nghệ" },
  marketing_brand: { ko: "마케팅·브랜드", en: "Marketing & brand", vi: "Marketing & thương hiệu" },
  startup: { ko: "창업", en: "Startup", vi: "Khởi nghiệp" },
  design: { ko: "디자인", en: "Design", vi: "Thiết kế" },
  data: { ko: "데이터", en: "Data", vi: "Dữ liệu" },
  social_impact: { ko: "사회문제 해결", en: "Social impact", vi: "Giải quyết vấn đề xã hội" },
  culture_content: { ko: "문화·콘텐츠", en: "Culture & content", vi: "Văn hoá & nội dung" },
  global: { ko: "글로벌", en: "Global", vi: "Quốc tế" },
};

export const GOALS: Record<Goal, Labels> = {
  prize: { ko: "수상·상금", en: "Winning a prize", vi: "Đạt giải" },
  learning: { ko: "배움·첫 도전", en: "Learning", vi: "Học hỏi" },
  portfolio: { ko: "포트폴리오", en: "Portfolio", vi: "Portfolio" },
  network: { ko: "인맥·교류", en: "Networking", vi: "Mở rộng quan hệ" },
  startup: { ko: "창업 준비", en: "Startup prep", vi: "Chuẩn bị khởi nghiệp" },
};

export const ROLES: Record<Role, Labels> = {
  developer: { ko: "개발", en: "Developer", vi: "Lập trình" },
  designer: { ko: "디자인", en: "Designer", vi: "Thiết kế" },
  planner: { ko: "기획", en: "Planner", vi: "Lên kế hoạch" },
  marketer_researcher: { ko: "마케팅·리서치", en: "Marketing & research", vi: "Marketing & nghiên cứu" },
  presenter: { ko: "발표", en: "Presenter", vi: "Thuyết trình" },
  data_analyst: { ko: "데이터 분석", en: "Data analyst", vi: "Phân tích dữ liệu" },
  content_creator: { ko: "콘텐츠 제작", en: "Content creator", vi: "Sáng tạo nội dung" },
};

export const LANGS: Record<SpokenLang, Labels> = {
  ko: { ko: "한국어", en: "Korean", vi: "Tiếng Hàn" },
  en: { ko: "영어", en: "English", vi: "Tiếng Anh" },
  vi: { ko: "베트남어", en: "Vietnamese", vi: "Tiếng Việt" },
  zh: { ko: "중국어", en: "Chinese", vi: "Tiếng Trung" },
  ja: { ko: "일본어", en: "Japanese", vi: "Tiếng Nhật" },
  hi: { ko: "힌디어", en: "Hindi", vi: "Tiếng Hindi" },
};

export const SLOTS: Record<Slot, Labels> = {
  mon_eve: { ko: "월 저녁", en: "Mon evening", vi: "Tối thứ 2" },
  tue_eve: { ko: "화 저녁", en: "Tue evening", vi: "Tối thứ 3" },
  wed_eve: { ko: "수 저녁", en: "Wed evening", vi: "Tối thứ 4" },
  thu_eve: { ko: "목 저녁", en: "Thu evening", vi: "Tối thứ 5" },
  fri_eve: { ko: "금 저녁", en: "Fri evening", vi: "Tối thứ 6" },
  weekend: { ko: "주말", en: "Weekend", vi: "Cuối tuần" },
  weekday_day: { ko: "평일 낮", en: "Weekday daytime", vi: "Ban ngày trong tuần" },
};

export const COMMITMENT: Record<Level3, Labels> = {
  low: { ko: "주 3시간 이하", en: "Up to 3 h/week", vi: "Tối đa 3 giờ/tuần" },
  mid: { ko: "주 4–8시간", en: "4–8 h/week", vi: "4–8 giờ/tuần" },
  high: { ko: "주 9시간 이상", en: "9+ h/week", vi: "Từ 9 giờ/tuần" },
};

export const EFFORT: Record<Level3, Labels> = {
  low: { ko: "가벼움", en: "Light", vi: "Nhẹ" },
  mid: { ko: "보통", en: "Medium", vi: "Vừa" },
  high: { ko: "많음", en: "Heavy", vi: "Nặng" },
};

export const SCALE: Record<"campus" | "regional" | "national" | "global", Labels> = {
  campus: { ko: "교내", en: "Campus", vi: "Trong trường" },
  regional: { ko: "지역", en: "Regional", vi: "Khu vực" },
  national: { ko: "전국", en: "National", vi: "Toàn quốc" },
  global: { ko: "국제", en: "International", vi: "Quốc tế" },
};

export const ALL_SKILLS = Object.keys(SKILLS) as Skill[];
export const ALL_FIELDS = Object.keys(FIELDS) as Field[];
export const ALL_GOALS = Object.keys(GOALS) as Goal[];
export const ALL_ROLES = Object.keys(ROLES) as Role[];
export const ALL_LANGS = Object.keys(LANGS) as SpokenLang[];
export const ALL_SLOTS = Object.keys(SLOTS) as Slot[];
