import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AiBadge } from "@/components/AiBadge";
import { categoryMeta, conflicts as initialConflicts } from "@/lib/mock-data";
import { useState } from "react";
import { AlertTriangle, Check, X, Sparkles } from "lucide-react";

export const Route = createFileRoute("/conflicts")({
  head: () => ({ meta: [{ title: "Conflict Resolution · AI Life Manager" }] }),
  component: ConflictsPage,
});

function ConflictsPage() {
  const [items, setItems] = useState(initialConflicts);
  const [resolved, setResolved] = useState<{ id: string; accepted: boolean }[]>([]);

  const act = (id: string, accepted: boolean) => {
    setItems((cs) => cs.filter((c) => c.id !== id));
    setResolved((r) => [...r, { id, accepted }]);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Conflicts"
        title="Resolution Center"
        subtitle="AI detected overlaps and prepared smart fixes."
        right={
          <span className="grid h-10 w-10 place-items-center rounded-full bg-cat-placement/15">
            <AlertTriangle className="h-5 w-5 text-cat-placement" />
          </span>
        }
      />

      <div className="px-5">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-ai shadow-ai">
            <Sparkles className="h-4 w-4 text-ai-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-medium text-foreground">
              {items.length} conflicts · {resolved.length} resolved
            </p>
            <p className="text-[11px] text-muted-foreground">
              Scanned across week of Jun 8 · updated 2 min ago
            </p>
          </div>
        </div>
      </div>

      <section className="mt-5 space-y-3 px-5">
        {items.length === 0 && resolved.length > 0 && (
          <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-card">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/15">
              <Check className="h-6 w-6 text-success" strokeWidth={2.5} />
            </span>
            <p className="mt-3 text-[15px] font-semibold text-foreground">Your week is clear</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              All conflicts handled. AI is monitoring for new ones.
            </p>
          </div>
        )}

        {items.map((c) => {
          const aMeta = categoryMeta[c.a.category];
          const bMeta = categoryMeta[c.b.category];
          return (
            <article
              key={c.id}
              className="overflow-hidden rounded-3xl border border-border bg-card shadow-card animate-float-in"
            >
              <div className="grid grid-cols-2">
                <ConflictHalf title={c.a.title} time={c.a.time} meta={aMeta} />
                <div className="relative">
                  <ConflictHalf title={c.b.title} time={c.b.time} meta={bMeta} />
                  <span className="absolute -left-4 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border-4 border-card bg-cat-placement text-[11px] font-bold text-white shadow-card">
                    VS
                  </span>
                </div>
              </div>

              <div className="border-t border-border bg-gradient-surface px-4 py-3">
                <div className="flex items-start gap-2">
                  <AiBadge label="Fix" />
                  <p className="flex-1 text-[13px] leading-relaxed text-foreground">{c.suggestion}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => act(c.id, false)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border bg-surface px-3 py-2 text-[12px] font-medium text-foreground hover:bg-muted"
                  >
                    <X className="h-3.5 w-3.5" />
                    Reject
                  </button>
                  <button
                    onClick={() => act(c.id, true)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 text-[12px] font-semibold text-primary-foreground shadow-card"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    Accept
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {resolved.length > 0 && (
          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Recently resolved
            </p>
            <ul className="mt-2 space-y-1.5">
              {resolved.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-[12px] shadow-card"
                >
                  <span className="text-muted-foreground">Conflict {r.id.toUpperCase()}</span>
                  <span
                    className={
                      r.accepted
                        ? "rounded-full bg-success/15 px-2 py-0.5 font-semibold text-success"
                        : "rounded-full bg-muted px-2 py-0.5 font-semibold text-muted-foreground"
                    }
                  >
                    {r.accepted ? "Applied" : "Dismissed"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </AppShell>
  );
}

function ConflictHalf({
  title,
  time,
  meta,
}: {
  title: string;
  time: string;
  meta: { label: string; color: string; bg: string; ring: string };
}) {
  return (
    <div className={`p-4 ${meta.bg}`}>
      <span className={`inline-flex rounded-full bg-card/70 px-2 py-0.5 text-[10px] font-semibold ${meta.color}`}>
        {meta.label}
      </span>
      <p className="mt-2 text-[13px] font-semibold leading-snug text-foreground">{title}</p>
      <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">{time}</p>
    </div>
  );
}
