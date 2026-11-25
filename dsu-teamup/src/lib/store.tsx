"use client";

// "Kho" dữ liệu của bản demo: lưu trong trình duyệt (localStorage).
// Nút "Đặt lại dữ liệu demo" ở trang Quản trị đưa mọi thứ về ban đầu.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SAMPLE_CONTESTS, SAMPLE_STUDENTS, SAMPLE_TEAMS } from "@/data/sample";
import { translate, type DictKey } from "./i18n";
import { DEFAULT_LANG, isUiLang } from "./langs";
import type { Actor, AiLogEntry, Contest, Invite, InviteStatus, Lang, Student, Team } from "./types";

interface DemoData {
  contests: Contest[];
  students: Student[];
  teams: Team[];
  invites: Invite[];
  saved: Record<string, string[]>;
  aiLog: AiLogEntry[];
  aiCache: Record<string, unknown>;
}

const DATA_KEY = "teamup-demo-data-v1";
const UI_KEY = "teamup-demo-ui-v1";

const freshData = (): DemoData => ({
  contests: structuredClone(SAMPLE_CONTESTS),
  students: structuredClone(SAMPLE_STUDENTS),
  teams: structuredClone(SAMPLE_TEAMS),
  invites: [],
  saved: {},
  aiLog: [],
  aiCache: {},
});

interface Store extends DemoData {
  hydrated: boolean;
  lang: Lang;
  setLang: (l: Lang) => void;
  actor: Actor;
  setActor: (a: Actor) => void;
  t: (key: DictKey, vars?: Record<string, string | number>) => string;
  currentStudent?: Student;
  currentTeam?: Team;
  updateStudent: (s: Student) => void;
  sendRequest: (from: "team" | "student", teamId: string, studentId: string) => void;
  setInviteStatus: (id: string, status: InviteStatus) => void;
  toggleSaved: (studentId: string, contestId: string) => void;
  logAi: (e: AiLogEntry) => void;
  cacheGet: (key: string) => unknown;
  cacheSet: (key: string, value: unknown) => void;
  reset: () => void;
}

const StoreContext = createContext<Store | null>(null);

function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* bỏ qua nếu trình duyệt chặn lưu trữ */
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DemoData>(freshData);
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  const [actor, setActor] = useState<Actor>({ type: "student", id: "s1" });
  const [hydrated, setHydrated] = useState(false);

  // Đọc dữ liệu đã lưu sau khi trang tải xong
  useEffect(() => {
    const saved = readJson<DemoData>(DATA_KEY);
    const ui = readJson<{ lang: Lang; actor: Actor }>(UI_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ một lần từ localStorage
    if (saved) setData({ ...freshData(), ...saved });
    if (isUiLang(ui?.lang)) setLang(ui.lang);
    if (ui?.actor) setActor(ui.actor);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJson(DATA_KEY, data);
  }, [data, hydrated]);

  useEffect(() => {
    if (hydrated) writeJson(UI_KEY, { lang, actor });
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang, actor, hydrated]);

  const t = useCallback((key: DictKey, vars?: Record<string, string | number>) => translate(lang, key, vars), [lang]);

  const updateStudent = useCallback((s: Student) => {
    setData((d) => ({ ...d, students: d.students.map((x) => (x.id === s.id ? s : x)) }));
  }, []);

  const sendRequest = useCallback((from: "team" | "student", teamId: string, studentId: string) => {
    setData((d) => {
      if (d.invites.some((i) => i.teamId === teamId && i.studentId === studentId && i.status === "pending")) return d;
      const invite: Invite = {
        id: `${from}-${teamId}-${studentId}-${Date.now()}`,
        from,
        teamId,
        studentId,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      return { ...d, invites: [invite, ...d.invites] };
    });
  }, []);

  const setInviteStatus = useCallback((id: string, status: InviteStatus) => {
    setData((d) => {
      const inv = d.invites.find((i) => i.id === id);
      if (!inv || inv.status !== "pending") return d;
      const invites = d.invites.map((i) => (i.id === id ? { ...i, status } : i));
      if (status !== "accepted") return { ...d, invites };
      // Chấp nhận: đội thêm 1 người, sinh viên không còn tìm đội
      const teams = d.teams.map((tm) =>
        tm.id === inv.teamId
          ? { ...tm, memberCount: tm.memberCount + 1, recruiting: tm.memberCount + 1 < tm.maxSize }
          : tm,
      );
      const students = d.students.map((s) => (s.id === inv.studentId ? { ...s, seekingTeam: false } : s));
      return { ...d, invites, teams, students };
    });
  }, []);

  const toggleSaved = useCallback((studentId: string, contestId: string) => {
    setData((d) => {
      const list = d.saved[studentId] ?? [];
      const next = list.includes(contestId) ? list.filter((c) => c !== contestId) : [...list, contestId];
      return { ...d, saved: { ...d.saved, [studentId]: next } };
    });
  }, []);

  const logAi = useCallback((e: AiLogEntry) => {
    setData((d) => ({ ...d, aiLog: [e, ...d.aiLog].slice(0, 200) }));
  }, []);

  const cacheGet = useCallback((key: string) => data.aiCache[key], [data.aiCache]);
  const cacheSet = useCallback((key: string, value: unknown) => {
    setData((d) => ({ ...d, aiCache: { ...d.aiCache, [key]: value } }));
  }, []);

  const reset = useCallback(() => {
    setData(freshData());
    setActor({ type: "student", id: "s1" });
  }, []);

  const value = useMemo<Store>(
    () => ({
      ...data,
      hydrated,
      lang,
      setLang,
      actor,
      setActor,
      t,
      currentStudent: actor.type === "student" ? data.students.find((s) => s.id === actor.id) : undefined,
      currentTeam: actor.type === "team" ? data.teams.find((tm) => tm.id === actor.id) : undefined,
      updateStudent,
      sendRequest,
      setInviteStatus,
      toggleSaved,
      logAi,
      cacheGet,
      cacheSet,
      reset,
    }),
    [data, hydrated, lang, actor, t, updateStudent, sendRequest, setInviteStatus, toggleSaved, logAi, cacheGet, cacheSet, reset],
  );

  // Bản demo chạy hoàn toàn trên trình duyệt: chờ đọc xong dữ liệu đã lưu rồi mới hiển thị
  return (
    <StoreContext.Provider value={value}>
      {hydrated ? children : <p className="p-8 text-center text-ink-soft">…</p>}
    </StoreContext.Provider>
  );
}

export function useStore(): Store {
  const s = useContext(StoreContext);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}
