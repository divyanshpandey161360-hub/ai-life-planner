import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AiBadge } from "@/components/AiBadge";
import { categoryMeta, deadlines, goals, productivity, weekDays } from "@/lib/mock-data";
import { Flame, TrendingUp, Sparkles } from "lucide-react";

export const Route = createFileRoute("/goals")({
  head: () => ({ meta: [{ title: "Goal Progress · AI Life Manager" }] }),
  component: GoalsPage,
});

function GoalsPage() {
  const totalHours = productivity.weeklyByCategory.reduce((s, c) => s + c.hours, 0);

  return (
    <AppShell>
      <PageHeader
        eyebrow="This week"
        title="Goal Progress"
        subtitle="Where your hours actually went."
        right={<AiBadge label="Insights" />}
      />

      {/* Top stats */}
      <section className="px-5">
        <div className="grid grid-cols-3 gap-3">
          <Tile
            icon={<TrendingUp className="h-4 w-4 text-primary" />}
            label="Focus"
            value={`${productivity.focusHours}h`}
            sub={`of ${productivity.focusTarget}h`}
          />
          <Tile
            icon={<Sparkles className="h-4 w-4 text-ai" />}
            label="Tasks"
            value={`${productivity.tasksDone}`}
            sub={`/${productivity.tasksTotal}`}
          />
          <Tile
            icon={<Flame className="h-4 w-4 text-cat-placement" />}
            label="Streak"
            value={`${productivity.streak}d`}
            sub="best yet"
          />
        </div>
      </section>

      {/* Category split */}
      <section className="mt-6 px-5">
        <h2 className="text-[15px] font-semibold text-foreground">Time by category</h2>
        <div className="mt-3 rounded-3xl border border-border bg-card p-4 shadow-card">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
            {productivity.weeklyByCategory.map((c) => {
              const meta = categoryMeta[c.cat];
              return (
                <span
                  key={c.cat}
                  className={meta.ring}
                  style={{ width: `${(c.hours / totalHours) * 100}%` }}
                />
              );
            })}
          </div>
          <ul className="mt-4 space-y-2">
            {productivity.weeklyByCategory.map((c) => {
              const meta = categoryMeta[c.cat];
              return (
                <li key={c.cat} className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${meta.ring}`} />
                  <span className="flex-1 text-[13px] text-foreground">{meta.label}</span>
                  <span className="text-[12px] tabular-nums text-muted-foreground">{c.hours}h</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Goals */}
      <section className="mt-6 px-5">
        <h2 className="text-[15px] font-semibold text-foreground">Active goals</h2>
        <div className="mt-3 space-y-3">
          {goals.map((g) => {
            const meta = categoryMeta[g.category];
            const max = Math.max(...g.weekly, 1);
            return (
              <article key={g.id} className="rounded-3xl border border-border bg-card p-4 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.bg} ${meta.color}`}>
                      {meta.label}
                    </span>
                    <h3 className="mt-1.5 text-[15px] font-semibold leading-snug text-foreground">
                      {g.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold tabular-nums text-foreground">{g.progress}%</p>
                    <p className="flex items-center justify-end gap-1 text-[11px] text-cat-placement">
                      <Flame className="h-3 w-3" />
                      {g.streak}d
                    </p>
                  </div>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full ${meta.ring}`} style={{ width: `${g.progress}%` }} />
                </div>

                {/* Weekly mini-bars */}
                <div className="mt-4 flex items-end justify-between gap-1.5">
                  {g.weekly.map((v, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-md ${meta.ring} opacity-80`}
                        style={{ height: `${(v / max) * 36 + 4}px` }}
                      />
                      <span className="text-[9px] uppercase text-muted-foreground">{weekDays[i]}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-2 rounded-2xl bg-accent/60 px-3 py-2">
                  <Sparkles className="h-3.5 w-3.5 text-ai" />
                  <p className="text-[12px] leading-snug text-foreground">
                    Next: <span className="font-medium">{g.nextStep}</span>
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Milestones */}
      <section className="mt-6 px-5">
        <h2 className="text-[15px] font-semibold text-foreground">Milestone tracker</h2>
        <div className="mt-3 space-y-3">
          {deadlines.map((d) => {
            const meta = categoryMeta[d.category];
            return (
              <article key={d.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-semibold text-foreground">{d.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.bg} ${meta.color}`}>
                    {meta.label}
                  </span>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {d.milestones.map((m, i) => (
                    <li key={i} className="flex items-center gap-2 text-[12px]">
                      <span
                        className={[
                          "grid h-4 w-4 place-items-center rounded-full border",
                          m.done ? `${meta.ring} border-transparent text-white` : "border-border bg-surface",
                        ].join(" ")}
                      >
                        {m.done && <span className="text-[9px] font-bold">✓</span>}
                      </span>
                      <span className={m.done ? "text-muted-foreground line-through" : "text-foreground"}>
                        {m.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}

function Tile({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-card">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="mt-1.5 text-xl font-semibold tabular-nums text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{sub}</p>
    </div>
  );
}
