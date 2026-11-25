"use client";

import { useState } from "react";
import { Button, Notice, PageTitle } from "@/components/ui";
import { callAi } from "@/lib/ai-client";
import { useStore } from "@/lib/store";

export default function AdminPage() {
  const store = useStore();
  const { t, lang, aiLog, reset } = store;
  const [ping, setPing] = useState<{ tone: "info" | "warn" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const real = aiLog.filter((e) => !e.cached);
  const totalIn = real.reduce((a, e) => a + e.inputTokens, 0);
  const totalOut = real.reduce((a, e) => a + e.outputTokens, 0);
  const avg = real.length ? Math.round((totalIn + totalOut) / real.length) : 0;

  const runPing = async () => {
    setBusy(true);
    const res = await callAi<{ text: string }>("ping", lang, null, store, { useCache: false });
    setBusy(false);
    if (res.ok) setPing({ tone: "info", text: `${t("admin_ping_ok", { m: res.model })} · ${t("ai_tokens", { i: res.usage.input, o: res.usage.output, ms: res.ms })}` });
    else setPing(res.code === "no_key" ? { tone: "warn", text: t("ai_no_key") } : { tone: "error", text: t("ai_error", { e: res.message }) });
  };

  return (
    <div>
      <PageTitle>{t("admin_title")}</PageTitle>

      <section className="mb-8 rounded-xl border border-line bg-white p-5">
        <h2 className="font-semibold text-ink">{t("admin_ai")}</h2>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button onClick={runPing} disabled={busy}>
            {busy ? t("ai_loading") : t("admin_ping")}
          </Button>
          {ping ? <Notice tone={ping.tone}>{ping.text}</Notice> : null}
        </div>
      </section>

      <section className="mb-8 rounded-xl border border-line bg-white p-5">
        <h2 className="font-semibold text-ink">{t("admin_log")}</h2>
        <p className="mt-1 text-sm text-ink-soft">
          {t("admin_total", { n: real.length, i: totalIn, o: totalOut, avg })}
        </p>
        {aiLog.length === 0 ? (
          <p className="mt-3 text-sm text-ink-soft">{t("admin_log_empty")}</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-ink-soft">
                  <th className="py-2 pr-3 font-medium">{t("col_time")}</th>
                  <th className="py-2 pr-3 font-medium">{t("col_action")}</th>
                  <th className="py-2 pr-3 text-right font-medium">{t("col_in")}</th>
                  <th className="py-2 pr-3 text-right font-medium">{t("col_out")}</th>
                  <th className="py-2 text-right font-medium">{t("col_ms")}</th>
                </tr>
              </thead>
              <tbody>
                {aiLog.slice(0, 50).map((e, i) => (
                  <tr key={i} className="border-b border-line/60">
                    <td className="py-1.5 pr-3 tabular-nums">{new Date(e.at).toLocaleTimeString()}</td>
                    <td className="py-1.5 pr-3">
                      {e.action}
                      {e.cached ? <span className="ml-2 text-xs text-ok">cache</span> : null}
                    </td>
                    <td className="py-1.5 pr-3 text-right tabular-nums">{e.inputTokens}</td>
                    <td className="py-1.5 pr-3 text-right tabular-nums">{e.outputTokens}</td>
                    <td className="py-1.5 text-right tabular-nums">{e.ms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mb-8 rounded-xl border border-line bg-white p-5">
        <h2 className="font-semibold text-ink">{t("admin_next")}</h2>
        <p className="mt-1 text-sm text-ink-soft">{t("admin_next_list")}</p>
      </section>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={() => {
            reset();
            setResetDone(true);
          }}
        >
          {t("admin_reset")}
        </Button>
        {resetDone ? <span className="text-sm text-ok">{t("admin_reset_done")}</span> : null}
      </div>
    </div>
  );
}
