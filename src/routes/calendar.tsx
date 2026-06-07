import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AiBadge } from "@/components/AiBadge";
import { categoryMeta, hours, weekDays, weekEvents } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Weekly Schedule · AI Life Manager" }] }),
  component: WeekView,
});

function WeekView() {
  const [day, setDay] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const events = weekEvents.filter((e) => e.day === day);
  const ROW = 56; // px per hour

  return (
    <AppShell>
      <PageHeader
        eyebrow="Week of Jun 8"
        title="Schedule"
        subtitle="Tuned by AI to your energy curve."
        right={<AiBadge label="Auto" />}
      />

      {/* Day pills */}
      <div className="px-5">
        <div className="flex items-center justify-between">
          <button className="grid h-8 w-8 place-items-center rounded-full bg-surface shadow-card active:scale-90 transition-transform">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-1.5">
            {weekDays.map((d, i) => {
              const active = i === day;
              const date = 8 + i;
              return (
                <button
                  key={d}
                  onClick={() => setDay(i)}
                  className={[
                    "flex flex-col items-center rounded-2xl px-2 py-1.5 transition active:scale-90",
                    active
                      ? "bg-primary text-primary-foreground shadow-card"
                      : "text-muted-foreground hover:bg-muted",
                  ].join(" ")}
                >
                  <span className="text-[10px] font-semibold uppercase">{d}</span>
                  <span className="text-[14px] font-semibold tabular-nums">{date}</span>
                </button>
              );
            })}
          </div>
          <button className="grid h-8 w-8 place-items-center rounded-full bg-surface shadow-card active:scale-90 transition-transform">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Day agenda */}
      <div className="mt-5 px-3">
        <div className="relative ml-12 rounded-3xl border border-border bg-card shadow-card">
          {/* hour grid */}
          {hours.map((h) => (
            <div
              key={h}
              className="relative border-b border-border/70 last:border-b-0"
              style={{ height: ROW }}
            >
              <span className="absolute -left-12 -translate-y-1/2 top-0 w-10 text-right text-[10px] font-medium tabular-nums text-muted-foreground">
                {h.toString().padStart(2, "0")}:00
              </span>
            </div>
          ))}

          {/* Now indicator on Mon (day 0) */}
          {mounted && day === 0 && <NowLine startHour={hours[0]} rowHeight={ROW} />}

          {/* events */}
          {events.map((e, i) => {
            const meta = categoryMeta[e.category];
            const top = (e.start - hours[0]) * ROW;
            const height = (e.end - e.start) * ROW - 4;
            return (
              <div
                key={i}
                className={`absolute left-2 right-2 overflow-hidden rounded-xl ${meta.bg} px-2.5 py-1.5 shadow-card animate-float-in`}
                style={{ top, height }}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${meta.ring}`} />
                  <span className={`text-[10px] font-semibold uppercase tracking-wide ${meta.color}`}>
                    {meta.label}
                  </span>
                </div>
                <p className="mt-0.5 text-[12px] font-semibold leading-tight text-foreground">
                  {e.title}
                </p>
                <p className="text-[10px] tabular-nums text-muted-foreground">
                  {fmt(e.start)} – {fmt(e.end)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* legend */}
      <div className="mt-5 px-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Legend</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(categoryMeta).map(([k, m]) => (
            <span key={k} className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ${m.bg} ${m.color} font-medium`}>
              <span className={`h-1.5 w-1.5 rounded-full ${m.ring}`} />
              {m.label}
            </span>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function fmt(h: number) {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
}

function NowLine({ startHour, rowHeight }: { startHour: number; rowHeight: number }) {
  const now = new Date();
  const h = now.getHours() + now.getMinutes() / 60;
  if (h < startHour || h > startHour + 16) return null;
  const top = (h - startHour) * rowHeight;
  return (
    <div className="pointer-events-none absolute left-0 right-0 z-10 flex items-center" style={{ top }}>
      <span className="ml-1 h-2.5 w-2.5 rounded-full bg-cat-placement shadow-ai" />
      <span className="h-px flex-1 bg-cat-placement" />
    </div>
  );
}
