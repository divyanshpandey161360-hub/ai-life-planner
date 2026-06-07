import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AiBadge, AiOrb } from "@/components/AiBadge";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Flag,
  GraduationCap,
  Repeat,
  Sparkles,
  Target,
  Wand2,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Plan a goal · AI Life Manager" },
      { name: "description", content: "Turn a goal into an adaptive AI-built roadmap." },
    ],
  }),
  component: PlanPage,
});

type Priority = "low" | "medium" | "high";

type Roadmap = {
  weeks: number;
  weeklyHours: number;
  milestones: { week: number; title: string; focus: string; hours: number }[];
  studyBlocks: { day: string; time: string; topic: string; minutes: number }[];
  mocks: { week: number; label: string; date: string }[];
  revisions: { week: number; label: string; cadence: string }[];
};

const samplePrompts = [
  "Prepare for placements in 90 days",
  "Finish Striver SDE sheet in 8 weeks",
  "Score 9+ CGPA this semester",
];

function buildRoadmap(input: {
  title: string;
  deadlineDays: number;
  weeklyHours: number;
  priority: Priority;
}): Roadmap {
  const weeks = Math.max(2, Math.round(input.deadlineDays / 7));
  const priorityBoost = input.priority === "high" ? 1.15 : input.priority === "low" ? 0.85 : 1;
  const wh = Math.round(input.weeklyHours * priorityBoost);

  const phases = [
    { name: "Foundations", focus: "Core concepts + baseline diagnostics" },
    { name: "Skill build", focus: "Topic-wise drills · daily practice" },
    { name: "Application", focus: "Pattern recognition · timed problems" },
    { name: "Mastery", focus: "Hard sets · system design · interviews" },
    { name: "Polish", focus: "Resume, behavioural, mock loops" },
    { name: "Final sprint", focus: "Full-length mocks + weak-area cleanup" },
  ];

  const milestones = Array.from({ length: weeks }).map((_, i) => {
    const phase = phases[Math.min(phases.length - 1, Math.floor((i / weeks) * phases.length))];
    return {
      week: i + 1,
      title: `Week ${i + 1} · ${phase.name}`,
      focus: phase.focus,
      hours: wh,
    };
  });

  const studyBlocks = [
    { day: "Mon", time: "07:00 – 08:30", topic: "DSA · pattern of the week", minutes: 90 },
    { day: "Tue", time: "20:00 – 21:30", topic: "Aptitude + Logical reasoning", minutes: 90 },
    { day: "Wed", time: "07:00 – 08:30", topic: "Core CS (OS / DBMS / CN)", minutes: 90 },
    { day: "Thu", time: "20:00 – 21:30", topic: "System design fundamentals", minutes: 90 },
    { day: "Fri", time: "17:00 – 18:30", topic: "Project work + GitHub polish", minutes: 90 },
    { day: "Sat", time: "10:00 – 12:00", topic: "Deep practice · timed set", minutes: 120 },
    { day: "Sun", time: "16:00 – 17:00", topic: "Weekly review with AI", minutes: 60 },
  ];

  const mocks = Array.from({ length: Math.max(2, Math.floor(weeks / 2)) }).map((_, i) => ({
    week: (i + 1) * 2,
    label: i === 0 ? "Diagnostic mock" : i % 2 === 0 ? "Full-length mock" : "Sectional mock",
    date: `Sat · week ${(i + 1) * 2}`,
  }));

  const revisions = [
    { week: 1, label: "Spaced recap of week's notes", cadence: "Sun · 30 min" },
    { week: 2, label: "Flashcards: weak topics", cadence: "Daily · 15 min" },
    { week: 3, label: "Rebuild solutions from scratch", cadence: "Fri · 45 min" },
    { week: 4, label: "Teach-back session", cadence: "Sat · 30 min" },
  ];

  return { weeks, weeklyHours: wh, milestones, studyBlocks, mocks, revisions };
}

function PlanPage() {
  const [title, setTitle] = useState("Prepare for placements in 90 days");
  const [deadlineDays, setDeadlineDays] = useState(90);
  const [weeklyHours, setWeeklyHours] = useState(14);
  const [priority, setPriority] = useState<Priority>("high");
  const [generated, setGenerated] = useState<Roadmap | null>(null);
  const [generating, setGenerating] = useState(false);

  const previewWeeks = useMemo(() => Math.max(2, Math.round(deadlineDays / 7)), [deadlineDays]);

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(null);
    window.setTimeout(() => {
      setGenerated(buildRoadmap({ title, deadlineDays, weeklyHours, priority }));
      setGenerating(false);
    }, 850);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Start here"
        title="Plan a goal"
        subtitle="Tell the AI what you want. It will build your weeks."
        right={<AiBadge label="Planner" />}
        backTo="/goals"
      />

      {/* Intro card */}
      {!generated && (
        <section className="px-5">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-ai p-5 text-ai-foreground shadow-ai">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
            <div className="relative flex items-start gap-4">
              <AiOrb size={44} />
              <div className="flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-80">
                  AI Life Manager
                </p>
                <h2 className="mt-1 text-lg font-semibold leading-snug">
                  One goal in. A whole roadmap out.
                </h2>
                <p className="mt-1 text-sm opacity-90">
                  Milestones, study blocks, mocks and revisions — auto-fit to your calendar.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Form */}
      <section className="mt-5 px-5">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
          <Field label="Goal" icon={<Target className="h-4 w-4 text-primary" />}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Prepare for placements in 90 days"
              className="w-full bg-transparent text-[15px] font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
          </Field>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {samplePrompts.map((s) => (
              <button
                key={s}
                onClick={() => setTitle(s)}
                className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Field label="Deadline" icon={<CalendarDays className="h-4 w-4 text-cat-placement" />}>
              <div className="flex items-baseline gap-1">
                <input
                  type="number"
                  min={7}
                  max={365}
                  value={deadlineDays}
                  onChange={(e) => setDeadlineDays(Number(e.target.value) || 0)}
                  className="w-14 bg-transparent text-[15px] font-semibold tabular-nums text-foreground outline-none"
                />
                <span className="text-xs text-muted-foreground">days</span>
              </div>
            </Field>

            <Field label="Weekly hours" icon={<Clock className="h-4 w-4 text-cat-dsa" />}>
              <div className="flex items-baseline gap-1">
                <input
                  type="number"
                  min={3}
                  max={60}
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value) || 0)}
                  className="w-14 bg-transparent text-[15px] font-semibold tabular-nums text-foreground outline-none"
                />
                <span className="text-xs text-muted-foreground">h / week</span>
              </div>
            </Field>
          </div>

          <div className="mt-4">
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Flag className="h-3 w-3" /> Priority
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(["low", "medium", "high"] as Priority[]).map((p) => {
                const active = priority === p;
                return (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={[
                      "rounded-2xl border px-3 py-2 text-[13px] font-medium capitalize transition",
                      active
                        ? "border-transparent bg-primary text-primary-foreground shadow-card"
                        : "border-border bg-surface text-muted-foreground hover:bg-muted",
                    ].join(" ")}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live preview */}
          <div className="mt-5 flex items-center justify-between rounded-2xl bg-accent/50 px-3 py-2.5">
            <div className="flex items-center gap-2 text-[12px] text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-ai" />
              AI will build{" "}
              <span className="font-semibold tabular-nums">{previewWeeks}</span> weeks,{" "}
              <span className="font-semibold tabular-nums">~{Math.round(weeklyHours * previewWeeks)}</span>{" "}
              hours total
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !title.trim()}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-ai px-4 py-3 text-sm font-semibold text-ai-foreground shadow-ai transition hover:opacity-95 disabled:opacity-60"
          >
            {generating ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
                Synthesising your roadmap…
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                {generated ? "Regenerate roadmap" : "Generate roadmap"}
              </>
            )}
          </button>
        </div>
      </section>

      {/* Generating shimmer */}
      {generating && (
        <section className="mt-5 space-y-2 px-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="relative h-16 overflow-hidden rounded-2xl border border-border bg-card shadow-card"
            >
              <div className="absolute inset-0 animate-shimmer" />
            </div>
          ))}
        </section>
      )}

      {/* Roadmap */}
      {generated && !generating && (
        <section className="mt-6 space-y-6 px-5 animate-float-in">
          {/* Summary */}
          <div className="rounded-3xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-accent">
                <Zap className="h-4 w-4 text-ai" />
              </span>
              <div className="flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Roadmap ready
                </p>
                <h3 className="text-[15px] font-semibold leading-snug text-foreground">{title}</h3>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <Stat value={`${generated.weeks}`} label="weeks" />
              <Stat value={`${generated.weeklyHours}h`} label="per week" />
              <Stat value={`${generated.mocks.length}`} label="mocks" />
            </div>
          </div>

          {/* Weekly milestones */}
          <Block
            title="Weekly milestones"
            sub="Phases adapt as you progress"
            icon={<GraduationCap className="h-4 w-4 text-cat-academic" />}
          >
            <ol className="relative ml-2 border-l border-dashed border-border pl-4">
              {generated.milestones.map((m, i) => (
                <li key={m.week} className="relative pb-4 last:pb-0">
                  <span className="absolute -left-[21px] top-1 grid h-4 w-4 place-items-center rounded-full bg-gradient-ai text-[9px] font-bold text-ai-foreground shadow-ai">
                    {m.week}
                  </span>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[13.5px] font-semibold text-foreground">{m.title}</p>
                      <p className="text-[12px] text-muted-foreground">{m.focus}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
                      {m.hours}h
                    </span>
                  </div>
                  {i === 0 && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
                      <CheckCircle2 className="h-3 w-3" /> Starts this week
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </Block>

          {/* Study blocks */}
          <Block
            title="Study blocks"
            sub="Reserved on your calendar"
            icon={<Clock className="h-4 w-4 text-cat-dsa" />}
          >
            <ul className="space-y-2">
              {generated.studyBlocks.map((b) => (
                <li
                  key={b.day}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-3 py-2.5"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-cat-dsa/12 text-[11px] font-bold uppercase text-cat-dsa">
                    {b.day}
                  </span>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-foreground">{b.topic}</p>
                    <p className="text-[11px] text-muted-foreground">{b.time}</p>
                  </div>
                  <span className="text-[11px] tabular-nums text-muted-foreground">{b.minutes}m</span>
                </li>
              ))}
            </ul>
          </Block>

          {/* Mock tests */}
          <Block
            title="Mock test schedule"
            sub="Calibrates difficulty as you improve"
            icon={<Target className="h-4 w-4 text-cat-placement" />}
          >
            <div className="grid grid-cols-2 gap-2">
              {generated.mocks.map((m, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-surface p-3"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-cat-placement">
                    {m.label}
                  </p>
                  <p className="mt-1 text-[13px] font-medium text-foreground">{m.date}</p>
                </div>
              ))}
            </div>
          </Block>

          {/* Revision */}
          <Block
            title="Revision sessions"
            sub="Spaced repetition built in"
            icon={<Repeat className="h-4 w-4 text-cat-focus" />}
          >
            <ul className="space-y-2">
              {generated.revisions.map((r, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-3 py-2.5"
                >
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{r.label}</p>
                    <p className="text-[11px] text-muted-foreground">From week {r.week}</p>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    {r.cadence}
                  </span>
                </li>
              ))}
            </ul>
          </Block>

          {/* CTA */}
          <div className="flex gap-2 pb-4">
            <button className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-card hover:bg-muted">
              Tweak
            </button>
            <Link
              to="/calendar"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-card hover:opacity-95"
            >
              Add to calendar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}
    </AppShell>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-3 py-2.5">
      <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-surface-2 py-2">
      <p className="text-lg font-semibold tabular-nums text-foreground">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function Block({
  title,
  sub,
  icon,
  children,
}: {
  title: string;
  sub: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-xl bg-accent">{icon}</span>
        <div>
          <h3 className="text-[14px] font-semibold leading-tight text-foreground">{title}</h3>
          <p className="text-[11px] text-muted-foreground">{sub}</p>
        </div>
      </div>
      <div className="rounded-3xl border border-border bg-card p-4 shadow-card">{children}</div>
    </div>
  );
}
