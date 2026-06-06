import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AiBadge, AiOrb } from "@/components/AiBadge";
import {
  categoryMeta,
  deadlines,
  productivity,
  recommendations,
  student,
  todaySchedule,
} from "@/lib/mock-data";
import { ChevronRight, Lock, Check, Bell, Flame, Wand2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Life Manager — Your day, planned by AI" },
      { name: "description", content: "Goal-driven calendar that adapts to your life. Built for students." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [greeting, setGreeting] = useState("Hello");
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
  }, []);

  const nextUp = todaySchedule.find((t) => !t.done) ?? todaySchedule[0];
  const completed = todaySchedule.filter((t) => t.done).length;

  return (
    <AppShell>
      <PageHeader
        eyebrow={`Today · ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}`}
        title={`${greeting}, ${student.name}`}
        subtitle="Your AI has tuned today around your energy and deadlines."
        right={
          <button className="relative grid h-10 w-10 place-items-center rounded-full bg-surface shadow-card">
            <Bell className="h-5 w-5 text-foreground" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cat-placement" />
          </button>
        }
      />

      <section className="px-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-ai p-5 text-ai-foreground shadow-ai">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
          <div className="relative flex items-start gap-4">
            <AiOrb size={48} />
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-80">Next up · {nextUp.start}</p>
              <h2 className="mt-1 text-lg font-semibold leading-snug">{nextUp.title}</h2>
              <p className="mt-1 text-sm opacity-90">
                {completed}/{todaySchedule.length} done · {productivity.focusHours}h focus this week
              </p>
            </div>
          </div>
          <div className="relative mt-4 flex gap-2">
            <Link
              to="/calendar"
              className="flex-1 rounded-full bg-white/20 px-4 py-2 text-center text-sm font-medium backdrop-blur hover:bg-white/30 transition"
            >
              Open week
            </Link>
            <Link
              to="/assistant"
              className="flex-1 rounded-full bg-white px-4 py-2 text-center text-sm font-semibold text-primary shadow-card hover:bg-white/95 transition"
            >
              Talk to AI
            </Link>
          </div>
        </div>
      </section>

      {/* Plan a new goal CTA */}
      <section className="mt-4 px-5">
        <Link
          to="/plan"
          className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-card transition hover:bg-muted"
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-ai shadow-ai">
            <Wand2 className="h-4 w-4 text-ai-foreground" />
          </span>
          <div className="flex-1">
            <p className="text-[13.5px] font-semibold text-foreground">Plan a new goal</p>
            <p className="text-[11.5px] text-muted-foreground">
              AI builds milestones, study blocks, mocks & revisions.
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5" />
        </Link>
      </section>


      {/* AI recommendations */}
      <section className="mt-7 px-5">
        <SectionTitle title="AI suggestions" badge />
        <div className="mt-3 space-y-2.5">
          {recommendations.map((r) => (
            <article
              key={r.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-card animate-float-in"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent">
                  <span className="text-gradient-ai text-base font-bold">✦</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-[15px] font-semibold leading-snug text-foreground">{r.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{r.reason}</p>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button className="rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted">
                  Dismiss
                </button>
                <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-card hover:opacity-95">
                  {r.action}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Schedule */}
      <section className="mt-7 px-5">
        <SectionTitle title="Today's schedule" link={{ to: "/calendar", label: "Week" }} />
        <ol className="mt-3 space-y-2">
          {todaySchedule.map((t) => {
            const meta = categoryMeta[t.category];
            return (
              <li
                key={t.id}
                className="flex items-stretch gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
              >
                <div className="flex flex-col items-end pt-0.5">
                  <span className="text-[11px] font-semibold tabular-nums text-foreground">{t.start}</span>
                  <span className="text-[10px] tabular-nums text-muted-foreground">{t.end}</span>
                </div>
                <div className={`w-1 rounded-full ${meta.ring}`} />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      className={`text-[14px] font-medium leading-snug ${
                        t.done ? "text-muted-foreground line-through" : "text-foreground"
                      }`}
                    >
                      {t.title}
                    </h4>
                    {t.done ? (
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-success/15">
                        <Check className="h-3 w-3 text-success" strokeWidth={3} />
                      </span>
                    ) : t.protected ? (
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : null}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.bg} ${meta.color}`}>
                      {meta.label}
                    </span>
                    {t.location && (
                      <span className="text-[11px] text-muted-foreground">· {t.location}</span>
                    )}
                    {t.aiGenerated && <AiBadge className="ml-auto" label="AI" />}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Deadlines */}
      <section className="mt-7 px-5">
        <SectionTitle title="Upcoming deadlines" link={{ to: "/goals", label: "Goals" }} />
        <div className="mt-3 -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {deadlines.map((d) => {
            const meta = categoryMeta[d.category];
            const days = Math.max(
              0,
              Math.ceil((new Date(d.due).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            );
            return (
              <article
                key={d.id}
                className="min-w-[78%] snap-start rounded-2xl border border-border bg-card p-4 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.bg} ${meta.color}`}>
                    {meta.label}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground">in {days}d</span>
                </div>
                <h3 className="mt-2 text-[15px] font-semibold leading-snug text-foreground">{d.title}</h3>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full ${meta.ring}`}
                    style={{ width: `${d.progress}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{d.progress}% complete</span>
                  <span>
                    {d.milestones.filter((m) => m.done).length}/{d.milestones.length} milestones
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Progress summary */}
      <section className="mt-7 px-5">
        <SectionTitle title="This week" link={{ to: "/goals", label: "Details" }} />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Stat label="Focus hours" value={`${productivity.focusHours}`} unit={`/ ${productivity.focusTarget}h`} />
          <Stat
            label="Tasks done"
            value={`${productivity.tasksDone}`}
            unit={`/ ${productivity.tasksTotal}`}
          />
          <div className="col-span-2 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cat-placement/15">
              <Flame className="h-5 w-5 text-cat-placement" />
            </span>
            <div className="flex-1">
              <p className="text-[13px] text-muted-foreground">Productivity streak</p>
              <p className="text-lg font-semibold tabular-nums text-foreground">{productivity.streak} days</p>
            </div>
            <span className="rounded-full bg-success/15 px-2 py-1 text-[11px] font-semibold text-success">
              +18% vs last week
            </span>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function SectionTitle({
  title,
  link,
  badge,
}: {
  title: string;
  link?: { to: "/calendar" | "/goals"; label: string };
  badge?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-[15px] font-semibold tracking-tight text-foreground">{title}</h2>
        {badge && <AiBadge />}
      </div>
      {link && (
        <Link to={link.to} className="flex items-center text-[12px] font-medium text-primary">
          {link.label}
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <p className="mt-1.5 flex items-baseline gap-1 text-foreground">
        <span className="text-2xl font-semibold tabular-nums">{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </p>
    </div>
  );
}
