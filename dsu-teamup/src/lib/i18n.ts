// Chữ hiển thị trên giao diện (không tốn token AI).
// Bắt buộc: ko (chính), en (thứ hai). Đã dịch sẵn: vi. Thêm zh/ja/hi: thêm khoá vào từng mục.

import type { Labels, Lang } from "./types";

const dict = {
  appName: { ko: "DSU TeamUp AI", en: "DSU TeamUp AI", vi: "DSU TeamUp AI" },
  mockBanner: {
    ko: "시연용 버전입니다. 모든 학생·팀·대회 정보는 가상 데이터입니다.",
    en: "Demo version. Every student, team and contest here is fictional.",
    vi: "Bản trình diễn. Mọi sinh viên, đội và cuộc thi đều là dữ liệu giả lập.",
  },
  nav_home: { ko: "홈", en: "Home", vi: "Trang chủ" },
  nav_profile: { ko: "프로필", en: "Profile", vi: "Hồ sơ" },
  nav_contests: { ko: "대회 추천", en: "Contests", vi: "Gợi ý cuộc thi" },
  nav_findTeam: { ko: "팀 찾기", en: "Find a team", vi: "Tìm đội" },
  nav_recruit: { ko: "팀원 찾기", en: "Find members", vi: "Tìm thành viên" },
  nav_invites: { ko: "지원·초대", en: "Requests", vi: "Lời mời" },
  nav_admin: { ko: "관리자", en: "Admin", vi: "Quản trị" },
  viewingAs: { ko: "보는 사람", en: "Viewing as", vi: "Đang xem với tư cách" },
  student: { ko: "학생", en: "Student", vi: "Sinh viên" },
  team: { ko: "팀", en: "Team", vi: "Đội" },

  home_title: {
    ko: "나에게 맞는 대회와 팀원을, 이유와 함께 찾아요",
    en: "Find contests and teammates that fit you, with the reasons spelled out",
    vi: "Tìm cuộc thi và đồng đội phù hợp, kèm lý do rõ ràng",
  },
  home_lead: {
    ko: "프로필의 역량·목표·언어·가능한 시간을 비교해 추천하고, 왜 맞는지와 무엇을 더 확인해야 하는지 보여 줍니다. 결정은 언제나 사용자가 합니다.",
    en: "We compare skills, goals, languages and free time, then show why each option fits and what still needs checking. You always make the final call.",
    vi: "Hệ thống so sánh kỹ năng, mục tiêu, ngôn ngữ và thời gian rảnh, rồi cho biết vì sao phù hợp và điều gì cần kiểm tra thêm. Quyết định luôn là của bạn.",
  },
  home_step1: { ko: "프로필 작성", en: "Fill in your profile", vi: "Điền hồ sơ" },
  home_step1_d: {
    ko: "자유롭게 쓰면 AI가 항목으로 정리하고, 직접 확인·수정합니다.",
    en: "Write freely; AI turns it into fields you check and edit.",
    vi: "Viết tự do, AI chuyển thành các mục để bạn kiểm tra và sửa.",
  },
  home_step2: { ko: "추천 확인", en: "Review suggestions", vi: "Xem gợi ý" },
  home_step2_d: {
    ko: "규칙으로 거르고 순위를 매긴 뒤, AI가 근거를 설명합니다.",
    en: "Rules filter and rank; AI explains the reasons.",
    vi: "Quy tắc lọc và xếp hạng, AI giải thích căn cứ.",
  },
  home_step3: { ko: "지원·초대", en: "Apply or invite", vi: "Ứng tuyển hoặc mời" },
  home_step3_d: {
    ko: "학생은 팀에 지원하고, 팀은 학생을 초대합니다.",
    en: "Students apply to teams; teams invite students.",
    vi: "Sinh viên ứng tuyển vào đội, đội mời sinh viên.",
  },
  home_cta_student: { ko: "학생으로 시작", en: "Start as a student", vi: "Bắt đầu với vai sinh viên" },
  home_cta_team: { ko: "팀으로 시작", en: "Start as a team", vi: "Bắt đầu với vai đội" },

  switchToStudent: {
    ko: "이 화면은 학생 시점입니다. 위에서 학생을 선택하세요.",
    en: "This page is for students. Pick a student above.",
    vi: "Trang này dành cho sinh viên. Hãy chọn một sinh viên ở trên.",
  },
  switchToTeam: {
    ko: "이 화면은 팀 시점입니다. 위에서 팀을 선택하세요.",
    en: "This page is for teams. Pick a team above.",
    vi: "Trang này dành cho đội. Hãy chọn một đội ở trên.",
  },

  // Hồ sơ
  profile_title: { ko: "프로필", en: "Profile", vi: "Hồ sơ" },
  profile_free: { ko: "자유 소개", en: "About you, in your own words", vi: "Giới thiệu tự do" },
  profile_free_ph: {
    ko: "예: 마케팅 수업에서 설문 조사를 해 봤고, 화·목 저녁에 시간이 있어요. 영어와 한국어로 소통할 수 있어요.",
    en: "e.g. I ran a survey in a marketing class, I'm free Tue/Thu evenings, and I can work in English or Korean.",
    vi: "VD: Mình từng làm khảo sát trong môn marketing, rảnh tối thứ 3 và thứ 5, làm việc được bằng tiếng Anh và tiếng Hàn.",
  },
  profile_ai_fill: { ko: "AI로 항목 정리", en: "Turn into fields with AI", vi: "Dùng AI chuyển thành các mục" },
  profile_ai_review: {
    ko: "AI가 찾은 항목입니다. 맞는 것만 반영하세요.",
    en: "Here is what AI found. Apply only what is correct.",
    vi: "Đây là những gì AI tìm thấy. Chỉ áp dụng phần đúng.",
  },
  profile_apply: { ko: "반영", en: "Apply", vi: "Áp dụng" },
  profile_discard: { ko: "버리기", en: "Discard", vi: "Bỏ qua" },
  profile_major: { ko: "전공", en: "Major", vi: "Ngành" },
  profile_year: { ko: "학년", en: "Year", vi: "Năm học" },
  profile_langs: { ko: "사용 언어", en: "Languages", vi: "Ngôn ngữ" },
  profile_skills: { ko: "역량과 근거", en: "Skills and evidence", vi: "Kỹ năng và bằng chứng" },
  profile_evidence_ph: {
    ko: "근거: 어디서 무엇을 해 봤나요?",
    en: "Evidence: where and what did you do?",
    vi: "Bằng chứng: bạn đã làm gì, ở đâu?",
  },
  profile_interests: { ko: "관심 분야", en: "Interests", vi: "Lĩnh vực quan tâm" },
  profile_goals: { ko: "참가 목표", en: "Goals", vi: "Mục tiêu" },
  profile_roles: { ko: "맡고 싶은 역할", en: "Roles you want", vi: "Vai trò muốn đảm nhận" },
  profile_slots: { ko: "가능한 시간", en: "Free time", vi: "Thời gian rảnh" },
  profile_commitment: { ko: "투입 가능 시간", en: "Time you can commit", vi: "Thời gian có thể dành" },
  profile_seeking: { ko: "팀을 찾고 있어요", en: "I'm looking for a team", vi: "Mình đang tìm đội" },
  profile_missing: { ko: "더 채우면 추천이 정확해져요", en: "Add these for better suggestions", vi: "Bổ sung để gợi ý chính xác hơn" },
  profile_complete: { ko: "필요한 항목이 모두 채워졌어요.", en: "Everything needed is filled in.", vi: "Đã điền đủ các mục cần thiết." },
  missing_skills: { ko: "역량", en: "skills", vi: "kỹ năng" },
  missing_evidence: { ko: "역량 근거", en: "skill evidence", vi: "bằng chứng kỹ năng" },
  missing_slots: { ko: "가능한 시간", en: "free time", vi: "thời gian rảnh" },
  missing_goals: { ko: "목표", en: "goals", vi: "mục tiêu" },
  missing_roles: { ko: "역할", en: "roles", vi: "vai trò" },
  missing_interests: { ko: "관심 분야", en: "interests", vi: "lĩnh vực quan tâm" },
  missing_bio: { ko: "자기소개", en: "short bio", vi: "giới thiệu ngắn" },
  team_profile_note: {
    ko: "팀 정보 편집은 다음 버전에서 추가됩니다.",
    en: "Editing team details arrives in the next version.",
    vi: "Chỉnh sửa thông tin đội sẽ có ở phiên bản sau.",
  },
  team_needs: { ko: "찾는 역할", en: "Roles needed", vi: "Vai trò đang cần" },
  team_have: { ko: "팀이 가진 역량", en: "Skills the team has", vi: "Kỹ năng đội đã có" },
  team_time: { ko: "활동 시간", en: "Meeting time", vi: "Giờ sinh hoạt" },
  team_members: { ko: "현재 인원", en: "Members", vi: "Số thành viên" },

  // Gợi ý cuộc thi
  contests_title: { ko: "대회 추천", en: "Contest suggestions", vi: "Gợi ý cuộc thi" },
  contests_priority: { ko: "지금 중요한 목표", en: "What matters to you now", vi: "Điều bạn ưu tiên lúc này" },
  contests_priority_hint: {
    ko: "목표를 바꾸면 순위와 이유가 바로 달라집니다.",
    en: "Change your goals and the order and reasons update right away.",
    vi: "Đổi mục tiêu thì thứ tự và lý do thay đổi ngay.",
  },
  contests_excluded: { ko: "추천하지 않은 대회와 이유", en: "Not suggested, and why", vi: "Không gợi ý và lý do" },
  deadline: { ko: "마감", en: "Deadline", vi: "Hạn" },
  daysLeft: { ko: "D-{n}", en: "{n} days left", vi: "còn {n} ngày" },
  source: { ko: "원문 공고", en: "Original notice", vi: "Thông báo gốc" },
  save: { ko: "저장", en: "Save", vi: "Lưu" },
  saved: { ko: "저장됨", en: "Saved", vi: "Đã lưu" },
  teamSize: { ko: "팀 {a}–{b}명", en: "Team of {a}–{b}", vi: "Đội {a}–{b} người" },
  effort: { ko: "준비 부담", en: "Workload", vi: "Khối lượng" },
  why: { ko: "추천 근거", en: "Why it fits", vi: "Căn cứ gợi ý" },
  check: { ko: "확인 필요", en: "Check first", vi: "Cần kiểm tra" },

  reason_interest: { ko: "관심 분야 일치", en: "Matches your interests", vi: "Khớp lĩnh vực quan tâm" },
  reason_skill: { ko: "내 역량을 쓸 수 있음", en: "Uses your skills", vi: "Dùng được kỹ năng của bạn" },
  reason_goal: { ko: "목표에 맞음", en: "Fits your goal", vi: "Hợp mục tiêu" },
  warn_effort: {
    ko: "준비 부담이 투입 가능 시간보다 큽니다.",
    en: "Needs more time than you said you can give.",
    vi: "Cần nhiều thời gian hơn mức bạn có thể dành.",
  },
  warn_need_team: { ko: "최소 {n}명 팀이 필요합니다.", en: "Needs a team of at least {n}.", vi: "Cần đội tối thiểu {n} người." },
  warn_deadline_soon: { ko: "마감까지 {n}일 남았습니다.", en: "Only {n} days to the deadline.", vi: "Chỉ còn {n} ngày đến hạn." },
  warn_unclear: { ko: "공고에서 확인 필요: {t}", en: "Check the notice: {t}", vi: "Cần xem lại thông báo: {t}" },
  excl_deadline_passed: { ko: "마감이 지났습니다.", en: "The deadline has passed.", vi: "Đã hết hạn." },
  excl_year: { ko: "{y}학년만 참가할 수 있습니다.", en: "Only year {y} students can enter.", vi: "Chỉ sinh viên năm {y} được dự thi." },
  excl_language: {
    ko: "제출 언어({l})를 사용하지 않습니다.",
    en: "You don't list the submission language ({l}).",
    vi: "Bạn chưa có ngôn ngữ nộp bài ({l}).",
  },

  // Ghép đội
  findTeam_title: { ko: "나에게 맞는 팀", en: "Teams that need you", vi: "Đội phù hợp với bạn" },
  recruit_title: { ko: "우리 팀에 맞는 지원자", en: "People who fit your team", vi: "Ứng viên phù hợp với đội" },
  match_fills: { ko: "채워 줄 역할", en: "Fills the role", vi: "Bổ sung vai trò" },
  match_langs: { ko: "공통 언어", en: "Shared language", vi: "Ngôn ngữ chung" },
  match_slots: { ko: "겹치는 시간", en: "Overlapping time", vi: "Giờ trùng nhau" },
  match_goals: { ko: "같은 목표", en: "Shared goal", vi: "Cùng mục tiêu" },
  match_still: { ko: "아직 비어 있는 역량", en: "Still missing", vi: "Vẫn còn thiếu" },
  match_excluded: { ko: "추천하지 않은 경우와 이유", en: "Not suggested, and why", vi: "Không gợi ý và lý do" },
  match_empty_team: {
    ko: "지금 조건에 맞는 지원자가 없습니다. 사용 언어나 가능한 시간을 넓히거나 모집 역할을 조정해 보세요.",
    en: "Nobody fits these conditions yet. Try widening the languages or times, or adjust the roles you need.",
    vi: "Hiện chưa có ai phù hợp. Hãy mở rộng ngôn ngữ, khung giờ hoặc điều chỉnh vai trò cần tuyển.",
  },
  match_empty_student: {
    ko: "지금 맞는 팀이 없습니다. 프로필에 역량·시간을 더 채우거나 다른 역할도 선택해 보세요.",
    en: "No team fits yet. Add more skills or free time, or pick more roles.",
    vi: "Chưa có đội phù hợp. Hãy bổ sung kỹ năng, thời gian rảnh hoặc chọn thêm vai trò.",
  },
  excl_no_common_language: { ko: "함께 쓸 수 있는 언어가 없습니다.", en: "No shared working language.", vi: "Không có ngôn ngữ làm việc chung." },
  excl_schedule_clash: { ko: "겹치는 활동 시간이 없습니다.", en: "No overlapping free time.", vi: "Không có giờ rảnh trùng nhau." },
  excl_no_complement: {
    ko: "팀이 찾는 역량과 겹치지 않습니다.",
    en: "Doesn't cover any skill the team is looking for.",
    vi: "Không có kỹ năng nào đội đang cần.",
  },
  excl_missing_info: {
    ko: "프로필 정보가 부족해 판단할 수 없습니다 ({f}).",
    en: "Not enough profile information to judge ({f}).",
    vi: "Hồ sơ thiếu thông tin nên chưa đánh giá được ({f}).",
  },
  excl_not_recruiting: { ko: "모집이 끝났습니다.", en: "Not recruiting any more.", vi: "Đội đã ngừng tuyển." },
  warn_commitment_gap: {
    ko: "투입 가능 시간 차이가 큽니다. 미리 이야기해 보세요.",
    en: "Big difference in time commitment. Talk about it first.",
    vi: "Chênh lệch thời gian cam kết lớn. Nên trao đổi trước.",
  },
  warn_missing_info: { ko: "프로필에 없는 정보: {f}", en: "Missing from the profile: {f}", vi: "Hồ sơ còn thiếu: {f}" },
  apply: { ko: "지원하기", en: "Apply", vi: "Ứng tuyển" },
  invite: { ko: "초대하기", en: "Invite", vi: "Mời" },
  applied: { ko: "지원함", en: "Applied", vi: "Đã ứng tuyển" },
  invited: { ko: "초대함", en: "Invited", vi: "Đã mời" },
  forContest: { ko: "목표 대회", en: "Target contest", vi: "Cuộc thi hướng tới" },

  level_high: { ko: "매우 적합", en: "Strong fit", vi: "Rất phù hợp" },
  level_good: { ko: "적합", en: "Good fit", vi: "Phù hợp" },
  level_consider: { ko: "검토해 볼 만함", en: "Worth a look", vi: "Có thể cân nhắc" },

  // AI
  ai_explain: { ko: "AI 설명 보기 (상위 3개)", en: "Explain the top 3 with AI", vi: "AI giải thích 3 gợi ý đầu" },
  ai_loading: { ko: "AI가 설명을 쓰는 중…", en: "AI is writing…", vi: "AI đang viết…" },
  ai_label: { ko: "AI 설명", en: "AI explanation", vi: "AI giải thích" },
  ai_adds: { ko: "더해 주는 것", en: "What they add", vi: "Đóng góp được gì" },
  ai_discuss: { ko: "먼저 이야기할 것", en: "Talk about first", vi: "Nên trao đổi trước" },
  ai_missing: { ko: "부족한 정보", en: "Missing information", vi: "Thông tin còn thiếu" },
  ai_tokens: {
    ko: "토큰 입력 {i} · 출력 {o} · {ms}ms",
    en: "Tokens in {i} · out {o} · {ms} ms",
    vi: "Token vào {i} · ra {o} · {ms} ms",
  },
  ai_cached: {
    ko: "이전 결과를 다시 사용해 토큰을 쓰지 않았습니다.",
    en: "Reused an earlier result, so no tokens were spent.",
    vi: "Dùng lại kết quả trước nên không tốn token.",
  },
  ai_no_key: {
    ko: "AI가 아직 연결되지 않았습니다 (서버에 API 키 없음). 위의 규칙 기반 근거만 표시됩니다.",
    en: "AI is not connected yet (no API key on the server). Only the rule-based reasons above are shown.",
    vi: "AI chưa được kết nối (server chưa có API key). Hiện chỉ có căn cứ theo quy tắc ở trên.",
  },
  ai_error: { ko: "AI 호출에 실패했습니다: {e}", en: "The AI call failed: {e}", vi: "Gọi AI thất bại: {e}" },

  // Lời mời
  invites_title: { ko: "지원·초대", en: "Applications and invites", vi: "Ứng tuyển và lời mời" },
  invites_received: { ko: "받은 요청", en: "Received", vi: "Đã nhận" },
  invites_sent: { ko: "보낸 요청", en: "Sent", vi: "Đã gửi" },
  invites_empty: {
    ko: "아직 요청이 없습니다. 추천 화면에서 지원하거나 초대해 보세요.",
    en: "Nothing here yet. Apply or invite from the suggestions page.",
    vi: "Chưa có gì. Hãy ứng tuyển hoặc mời từ trang gợi ý.",
  },
  invite_kind_team: { ko: "팀의 초대", en: "Invite from a team", vi: "Lời mời từ đội" },
  invite_kind_student: { ko: "학생의 지원", en: "Application from a student", vi: "Đơn ứng tuyển của sinh viên" },
  accept: { ko: "수락", en: "Accept", vi: "Chấp nhận" },
  decline: { ko: "거절", en: "Decline", vi: "Từ chối" },
  status_pending: { ko: "응답 대기", en: "Waiting", vi: "Đang chờ" },
  status_accepted: { ko: "수락됨 · 팀 합류", en: "Accepted · joined", vi: "Đã chấp nhận · vào đội" },
  status_declined: { ko: "거절됨", en: "Declined", vi: "Đã từ chối" },

  // Quản trị
  admin_title: { ko: "관리자", en: "Admin", vi: "Quản trị" },
  admin_ai: { ko: "AI 연결 상태", en: "AI connection", vi: "Kết nối AI" },
  admin_ping: { ko: "AI 연결 확인", en: "Check the AI connection", vi: "Kiểm tra kết nối AI" },
  admin_ping_ok: { ko: "연결됨 · 모델 {m}", en: "Connected · model {m}", vi: "Đã kết nối · model {m}" },
  admin_log: { ko: "AI 사용 기록 (이 브라우저)", en: "AI usage log (this browser)", vi: "Nhật ký dùng AI (trên trình duyệt này)" },
  admin_log_empty: { ko: "아직 AI 호출이 없습니다.", en: "No AI calls yet.", vi: "Chưa có lần gọi AI nào." },
  admin_total: {
    ko: "호출 {n}회 · 입력 {i} · 출력 {o} · 평균 {avg} 토큰/회",
    en: "{n} calls · in {i} · out {o} · avg {avg} tokens/call",
    vi: "{n} lần gọi · vào {i} · ra {o} · trung bình {avg} token/lần",
  },
  admin_reset: { ko: "시연 데이터 초기화", en: "Reset demo data", vi: "Đặt lại dữ liệu demo" },
  admin_reset_done: { ko: "초기화했습니다.", en: "Demo data reset.", vi: "Đã đặt lại dữ liệu." },
  admin_next: { ko: "다음 단계에서 추가될 기능", en: "Coming next", vi: "Sẽ thêm ở bước sau" },
  admin_next_list: {
    ko: "공고 붙여넣기 → AI 항목 추출 · 지원 요청 AI 요약과 수요 통계 · 번역 버튼",
    en: "Paste a notice → AI extracts fields · AI summary of support requests · translate button",
    vi: "Dán thông báo → AI trích xuất · AI tóm tắt yêu cầu hỗ trợ · nút dịch",
  },
  col_time: { ko: "시각", en: "Time", vi: "Thời điểm" },
  col_action: { ko: "기능", en: "Feature", vi: "Chức năng" },
  col_in: { ko: "입력", en: "In", vi: "Vào" },
  col_out: { ko: "출력", en: "Out", vi: "Ra" },
  col_ms: { ko: "응답 시간", en: "Response time", vi: "Thời gian" },

  login_title: { ko: "시연 비밀번호", en: "Demo passcode", vi: "Mật khẩu demo" },
  login_hint: {
    ko: "심사·시연용 비밀번호를 입력하세요.",
    en: "Enter the passcode for the demo.",
    vi: "Nhập mật khẩu dành cho buổi demo.",
  },
  login_go: { ko: "들어가기", en: "Enter", vi: "Vào" },
  login_wrong: { ko: "비밀번호가 맞지 않습니다.", en: "That passcode is not right.", vi: "Mật khẩu chưa đúng." },
} as const satisfies Record<string, Labels>;

export type DictKey = keyof typeof dict;

export function translate(lang: Lang, key: DictKey, vars?: Record<string, string | number>): string {
  const entry: Labels = dict[key];
  let s: string = entry[lang] ?? entry.en;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}
