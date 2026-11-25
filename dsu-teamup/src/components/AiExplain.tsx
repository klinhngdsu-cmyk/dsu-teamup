"use client";

import { useCallback, useEffect, useState } from "react";
import { callAi, type AiAction } from "@/lib/ai-client";
import { useStore } from "@/lib/store";
import { Button, Notice } from "./ui";

export interface ExplainState<T> {
  status: "idle" | "loading" | "done" | "no_key" | "error";
  items: Record<string, T>;
  usage?: { input: number; output: number };
  ms?: number;
  cached?: boolean;
  error?: string;
}

/** Gọi AI để giải thích danh sách đã xếp hạng. `resetKey` đổi thì xoá kết quả cũ. */
export function useAiExplain<T extends { id: string }>(action: AiAction, resetKey: string) {
  const { lang, cacheGet, cacheSet, logAi } = useStore();
  const [state, setState] = useState<ExplainState<T>>({ status: "idle", items: {} });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- xoá kết quả khi dữ liệu đầu vào đổi
    setState({ status: "idle", items: {} });
  }, [resetKey, lang]);

  const run = useCallback(
    async (payload: unknown) => {
      setState((s) => ({ ...s, status: "loading" }));
      const res = await callAi<{ items: T[] }>(action, lang, payload, { cacheGet, cacheSet, logAi });
      if (!res.ok) {
        setState({ status: res.code === "no_key" ? "no_key" : "error", items: {}, error: res.message });
        return;
      }
      const items: Record<string, T> = {};
      for (const it of res.data?.items ?? []) if (it?.id) items[it.id] = it;
      setState({ status: "done", items, usage: res.usage, ms: res.ms, cached: res.cached });
    },
    [action, lang, cacheGet, cacheSet, logAi],
  );

  return { state, run };
}

export function AiBar<T>({ state, onRun, disabled }: { state: ExplainState<T>; onRun: () => void; disabled?: boolean }) {
  const { t } = useStore();
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <Button onClick={onRun} disabled={disabled || state.status === "loading"}>
        {state.status === "loading" ? t("ai_loading") : t("ai_explain")}
      </Button>
      {state.status === "done" ? (
        <span className="text-sm text-ink-soft">
          {state.cached
            ? t("ai_cached")
            : t("ai_tokens", { i: state.usage?.input ?? 0, o: state.usage?.output ?? 0, ms: state.ms ?? 0 })}
        </span>
      ) : null}
      {state.status === "no_key" ? <Notice tone="warn">{t("ai_no_key")}</Notice> : null}
      {state.status === "error" ? <Notice tone="error">{t("ai_error", { e: state.error ?? "" })}</Notice> : null}
    </div>
  );
}

/** Khung hiển thị lời giải thích của AI ngay dưới từng gợi ý */
export function AiNote({ children }: { children: React.ReactNode }) {
  const { t } = useStore();
  return (
    <div className="mt-3 rounded-lg border-l-4 border-brand bg-brand-tint px-3 py-2 text-[0.95rem]">
      <p className="mb-1 text-xs font-semibold text-brand">{t("ai_label")}</p>
      {children}
    </div>
  );
}
