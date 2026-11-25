"use client";

import { useState } from "react";
import { ALL_FIELDS, ALL_GOALS, ALL_LANGS, ALL_ROLES, ALL_SKILLS, ALL_SLOTS } from "@/data/taxonomy";
import { useLabels } from "@/components/labels";
import { Button, Notice, PageTitle, Tag } from "@/components/ui";
import { callAi } from "@/lib/ai-client";
import type { DictKey } from "@/lib/i18n";
import { missingProfileFields } from "@/lib/match";
import { useStore } from "@/lib/store";
import type { Field, Goal, Level3, Role, Skill, SkillEvidence, Slot, SpokenLang, Student } from "@/lib/types";

interface Suggestion {
  skills: SkillEvidence[];
  interests: Field[];
  goals: Goal[];
  roles: Role[];
  languages: SpokenLang[];
  slots: Slot[];
  commitment: Level3 | null;
}

function Toggles<T extends string>({
  all,
  selected,
  label,
  onChange,
}: {
  all: readonly T[];
  selected: T[];
  label: (x: T) => string;
  onChange: (next: T[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {all.map((x) => {
        const on = selected.includes(x);
        return (
          <button
            key={x}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(on ? selected.filter((y) => y !== x) : [...selected, x])}
            className={`rounded-full border px-3 py-1 text-sm ${
              on ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-soft hover:text-ink"
            }`}
          >
            {label(x)}
          </button>
        );
      })}
    </div>
  );
}

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 border-t border-line py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
      <h2 className="font-semibold text-ink">{title}</h2>
      <div>{children}</div>
    </div>
  );
}

const union = <T,>(a: T[], b: T[]) => Array.from(new Set([...a, ...b]));

export default function ProfilePage() {
  const store = useStore();
  const { t, lang, currentStudent: s, currentTeam: tm, updateStudent, contests } = store;
  const { L } = useLabels();
  const [busy, setBusy] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [aiMsg, setAiMsg] = useState<{ tone: "info" | "warn" | "error"; text: string } | null>(null);

  if (tm) {
    const contest = contests.find((c) => c.id === tm.contestId);
    return (
      <div>
        <PageTitle sub={contest?.name}>{tm.name}</PageTitle>
        <div className="rounded-xl border border-line bg-white px-5">
          <Row title={t("team_members")}>
            {tm.memberCount}/{tm.maxSize}
          </Row>
          <Row title={t("team_have")}>
            <div className="flex flex-wrap gap-1.5">{tm.haveSkills.map((k) => <Tag key={k}>{L.skill(k)}</Tag>)}</div>
          </Row>
          <Row title={t("team_needs")}>
            {tm.needs.map((n) => (
              <p key={n.role}>
                <strong>{L.role(n.role)}</strong>: {n.skills.map(L.skill).join(", ")}
              </p>
            ))}
          </Row>
          <Row title={t("profile_langs")}>{tm.languages.map(L.lang).join(", ")}</Row>
          <Row title={t("profile_slots")}>{tm.slots.map(L.slot).join(", ")}</Row>
          <Row title={t("profile_goals")}>{tm.goals.map(L.goal).join(", ")}</Row>
          <Row title={t("profile_free")}>{tm.description}</Row>
        </div>
        <p className="mt-4 text-sm text-ink-soft">{t("team_profile_note")}</p>
      </div>
    );
  }
  if (!s) return null;

  const set = (patch: Partial<Student>) => updateStudent({ ...s, ...patch });
  const missing = missingProfileFields(s);

  const runAi = async () => {
    if (!s.bio.trim()) return;
    setBusy(true);
    setAiMsg(null);
    const res = await callAi<Suggestion>("normalize_profile", lang, s.bio, store);
    setBusy(false);
    if (!res.ok) {
      setAiMsg(res.code === "no_key" ? { tone: "warn", text: t("ai_no_key") } : { tone: "error", text: t("ai_error", { e: res.message }) });
      return;
    }
    setSuggestion(res.data);
    setAiMsg({
      tone: "info",
      text: res.cached ? t("ai_cached") : t("ai_tokens", { i: res.usage.input, o: res.usage.output, ms: res.ms }),
    });
  };

  const applySuggestion = () => {
    if (!suggestion) return;
    const existing = new Set(s.skills.map((k) => k.tag));
    set({
      skills: [...s.skills, ...suggestion.skills.filter((k) => !existing.has(k.tag))],
      interests: union(s.interests, suggestion.interests),
      goals: union(s.goals, suggestion.goals),
      roles: union(s.roles, suggestion.roles),
      languages: union(s.languages, suggestion.languages),
      slots: union(s.slots, suggestion.slots),
      commitment: suggestion.commitment ?? s.commitment,
    });
    setSuggestion(null);
  };

  const setSkills = (tags: Skill[]) =>
    set({ skills: tags.map((tag) => s.skills.find((k) => k.tag === tag) ?? { tag, evidence: "" }) });

  return (
    <div>
      <PageTitle sub={s.name}>{t("profile_title")}</PageTitle>

      <div className="mb-6">
        {missing.length ? (
          <Notice tone="warn">
            {t("profile_missing")}: {missing.map((m) => t(`missing_${m}` as DictKey)).join(", ")}
          </Notice>
        ) : (
          <Notice>{t("profile_complete")}</Notice>
        )}
      </div>

      <section className="mb-6 rounded-xl border border-line bg-white p-5">
        <label htmlFor="bio" className="font-semibold text-ink">
          {t("profile_free")}
        </label>
        <textarea
          id="bio"
          rows={4}
          value={s.bio}
          placeholder={t("profile_free_ph")}
          onChange={(e) => set({ bio: e.target.value })}
          className="mt-2 w-full rounded-lg border border-line p-3"
        />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Button onClick={runAi} disabled={busy || !s.bio.trim()}>
            {busy ? t("ai_loading") : t("profile_ai_fill")}
          </Button>
          {aiMsg ? <Notice tone={aiMsg.tone}>{aiMsg.text}</Notice> : null}
        </div>

        {suggestion ? (
          <div className="mt-4 rounded-lg border-l-4 border-brand bg-brand-tint p-3">
            <p className="text-sm font-semibold text-brand">{t("profile_ai_review")}</p>
            <ul className="mt-2 space-y-1 text-sm">
              {suggestion.skills.map((k) => (
                <li key={k.tag}>
                  <span className="marker">{L.skill(k.tag)}</span> <span className="text-ink-soft">({k.evidence})</span>
                </li>
              ))}
              {suggestion.languages.length ? <li>{t("profile_langs")}: {suggestion.languages.map(L.lang).join(", ")}</li> : null}
              {suggestion.interests.length ? <li>{t("profile_interests")}: {suggestion.interests.map(L.field).join(", ")}</li> : null}
              {suggestion.goals.length ? <li>{t("profile_goals")}: {suggestion.goals.map(L.goal).join(", ")}</li> : null}
              {suggestion.roles.length ? <li>{t("profile_roles")}: {suggestion.roles.map(L.role).join(", ")}</li> : null}
              {suggestion.slots.length ? <li>{t("profile_slots")}: {suggestion.slots.map(L.slot).join(", ")}</li> : null}
              {suggestion.commitment ? <li>{t("profile_commitment")}: {L.commitment(suggestion.commitment)}</li> : null}
            </ul>
            <div className="mt-3 flex gap-2">
              <Button onClick={applySuggestion}>{t("profile_apply")}</Button>
              <Button variant="quiet" onClick={() => setSuggestion(null)}>
                {t("profile_discard")}
              </Button>
            </div>
          </div>
        ) : null}
      </section>

      <div className="rounded-xl border border-line bg-white px-5">
        <Row title={`${t("profile_major")} · ${t("profile_year")}`}>
          <div className="flex flex-wrap gap-3">
            <input
              value={s.major}
              onChange={(e) => set({ major: e.target.value })}
              className="rounded-lg border border-line px-3 py-1.5"
              aria-label={t("profile_major")}
            />
            <select
              value={s.year}
              onChange={(e) => set({ year: Number(e.target.value) })}
              className="rounded-lg border border-line px-2 py-1.5"
              aria-label={t("profile_year")}
            >
              {[1, 2, 3, 4].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </Row>
        <Row title={t("profile_langs")}>
          <Toggles all={ALL_LANGS} selected={s.languages} label={L.lang} onChange={(v) => set({ languages: v })} />
        </Row>
        <Row title={t("profile_skills")}>
          <Toggles all={ALL_SKILLS} selected={s.skills.map((k) => k.tag)} label={L.skill} onChange={setSkills} />
          {s.skills.length ? (
            <ul className="mt-3 space-y-2">
              {s.skills.map((k) => (
                <li key={k.tag} className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:items-center">
                  <span className="marker justify-self-start">{L.skill(k.tag)}</span>
                  <input
                    value={k.evidence}
                    placeholder={t("profile_evidence_ph")}
                    onChange={(e) =>
                      set({ skills: s.skills.map((x) => (x.tag === k.tag ? { ...x, evidence: e.target.value } : x)) })
                    }
                    className="w-full rounded-lg border border-line px-3 py-1.5 text-sm"
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </Row>
        <Row title={t("profile_interests")}>
          <Toggles all={ALL_FIELDS} selected={s.interests} label={L.field} onChange={(v) => set({ interests: v })} />
        </Row>
        <Row title={t("profile_goals")}>
          <Toggles all={ALL_GOALS} selected={s.goals} label={L.goal} onChange={(v) => set({ goals: v })} />
        </Row>
        <Row title={t("profile_roles")}>
          <Toggles all={ALL_ROLES} selected={s.roles} label={L.role} onChange={(v) => set({ roles: v })} />
        </Row>
        <Row title={t("profile_slots")}>
          <Toggles all={ALL_SLOTS} selected={s.slots} label={L.slot} onChange={(v) => set({ slots: v })} />
        </Row>
        <Row title={t("profile_commitment")}>
          <Toggles
            all={["low", "mid", "high"] as Level3[]}
            selected={[s.commitment]}
            label={L.commitment}
            onChange={(v) => v.length && set({ commitment: v[v.length - 1] })}
          />
        </Row>
        <Row title={t("profile_seeking")}>
          <input
            type="checkbox"
            className="h-5 w-5 accent-brand"
            checked={s.seekingTeam}
            onChange={(e) => set({ seekingTeam: e.target.checked })}
            aria-label={t("profile_seeking")}
          />
        </Row>
      </div>
    </div>
  );
}
