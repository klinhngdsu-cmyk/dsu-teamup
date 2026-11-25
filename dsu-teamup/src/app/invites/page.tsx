"use client";

import { Button, Notice, PageTitle } from "@/components/ui";
import { useStore } from "@/lib/store";
import type { Invite } from "@/lib/types";

export default function InvitesPage() {
  const { t, actor, invites, students, teams, setInviteStatus } = useStore();
  const mine = invites.filter((i) => (actor.type === "student" ? i.studentId === actor.id : i.teamId === actor.id));
  const received = mine.filter((i) => i.from !== actor.type);
  const sent = mine.filter((i) => i.from === actor.type);
  const nameOf = (i: Invite) =>
    actor.type === "student"
      ? (teams.find((x) => x.id === i.teamId)?.name ?? i.teamId)
      : (students.find((x) => x.id === i.studentId)?.name ?? i.studentId);

  const statusText = (i: Invite) =>
    i.status === "pending" ? t("status_pending") : i.status === "accepted" ? t("status_accepted") : t("status_declined");

  const renderList = (items: Invite[], canRespond: boolean) =>
    items.length === 0 ? (
      <Notice>{t("invites_empty")}</Notice>
    ) : (
      <ul className="divide-y divide-line rounded-xl border border-line bg-white">
        {items.map((i) => (
          <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-semibold text-ink">{nameOf(i)}</p>
              <p className="text-sm text-ink-soft">
                {i.from === "team" ? t("invite_kind_team") : t("invite_kind_student")} · {new Date(i.createdAt).toLocaleString()}
              </p>
            </div>
            {canRespond && i.status === "pending" ? (
              <div className="flex gap-2">
                <Button onClick={() => setInviteStatus(i.id, "accepted")}>{t("accept")}</Button>
                <Button variant="ghost" onClick={() => setInviteStatus(i.id, "declined")}>
                  {t("decline")}
                </Button>
              </div>
            ) : (
              <span className={`text-sm font-semibold ${i.status === "accepted" ? "text-ok" : i.status === "declined" ? "text-stop" : "text-ink-soft"}`}>
                {statusText(i)}
              </span>
            )}
          </li>
        ))}
      </ul>
    );

  return (
    <div>
      <PageTitle>{t("invites_title")}</PageTitle>
      <h2 className="mb-2 mt-2 font-semibold text-ink">{t("invites_received")}</h2>
      {renderList(received, true)}
      <h2 className="mb-2 mt-8 font-semibold text-ink">{t("invites_sent")}</h2>
      {renderList(sent, false)}
    </div>
  );
}
