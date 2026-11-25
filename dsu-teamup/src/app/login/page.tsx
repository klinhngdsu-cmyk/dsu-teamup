"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Notice } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const { t } = useStore();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [wrong, setWrong] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: code }),
    });
    if (res.ok) {
      router.replace("/");
      router.refresh();
    }
    else setWrong(true);
  };

  return (
    <form onSubmit={submit} className="mx-auto mt-16 max-w-sm rounded-xl border border-line bg-white p-6">
      <h1 className="text-xl font-bold text-ink">
        DSU <span className="text-brand">TeamUp</span> AI
      </h1>
      <p className="mt-1 text-sm text-ink-soft">{t("login_hint")}</p>
      <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="code">
        {t("login_title")}
      </label>
      <input
        id="code"
        type="password"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          setWrong(false);
        }}
        className="mt-1 w-full rounded-lg border border-line px-3 py-2"
        autoFocus
      />
      <div className="mt-4 flex items-center gap-3">
        <Button type="submit">{t("login_go")}</Button>
      </div>
      {wrong ? (
        <div className="mt-3">
          <Notice tone="error">{t("login_wrong")}</Notice>
        </div>
      ) : null}
    </form>
  );
}
