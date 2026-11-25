// CẤU HÌNH NGÔN NGỮ GIAO DIỆN
// - Hiện bật 2 ngôn ngữ chính: tiếng Hàn (mặc định) và tiếng Anh.
// - Muốn bật thêm ngôn ngữ: thêm mã vào UI_LANGS (ví dụ "vi").
//   Chữ nào chưa dịch sang ngôn ngữ đó sẽ tự hiện bằng tiếng Anh.
// - Lời giải thích của AI luôn được viết bằng ngôn ngữ đang chọn.

import type { Lang } from "./types";

export const DEFAULT_LANG: Lang = "ko";

/** Thứ tự hiển thị trên nút chọn ngôn ngữ */
export const UI_LANGS: Lang[] = ["ko", "en"];
// Đã dịch sẵn, chỉ cần bật:  "vi"
// Dự kiến mở rộng:          "zh", "ja", "hi"

export const LANG_BUTTON: Record<Lang, string> = {
  ko: "한국어",
  en: "English",
  vi: "Tiếng Việt",
  zh: "中文",
  ja: "日本語",
  hi: "हिन्दी",
};

/** Tên ngôn ngữ gửi cho AI để AI viết đúng ngôn ngữ */
export const LANG_NAME_FOR_AI: Record<Lang, string> = {
  ko: "Korean",
  en: "English",
  vi: "Vietnamese",
  zh: "Simplified Chinese",
  ja: "Japanese",
  hi: "Hindi",
};

export const isUiLang = (x: unknown): x is Lang => UI_LANGS.includes(x as Lang);
