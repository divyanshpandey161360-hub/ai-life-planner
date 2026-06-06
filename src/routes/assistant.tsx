import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AiBadge, AiOrb } from "@/components/AiBadge";
import { categoryMeta, type Category } from "@/lib/mock-data";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [{ title: "AI Planning Assistant · AI Life Manager" }],
  }),
  component: AssistantPage,
});

type Msg =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "ai"; text: string; plan?: PlanBlock[] };

type PlanBlock = { time: string; title: string; category: Category };

const seed: Msg[] = [
  {
    id: "m1",
    role: "ai",
    text: "Hey Aarav — I've reviewed your week. What goal should we plan around today?",
  },
  {
    id: "m2",
    role: "user",
    text: "I want to crack Google STEP and finish Striver DSA sheet in 4 weeks. I can give 5–6 hrs/day on weekdays.",
  },
  {
    id: "m3",
    role: "ai",
    text: "Got it. I'll protect your mornings for DSA when retention is highest, and slot placement prep after lectures. Here's a sample weekday:",
    plan: [
      { time: "06:30", title: "Gym — 45 min", category: "gym" },
      { time: "09:00", title: "Lectures", category: "academic" },
      { time: "10:30", title: "DSA — Graphs (deep work)", category: "dsa" },
      { time: "14:00", title: "Placement: Aptitude + DI", category: "placement" },
      { time: "17:30", title: "Capstone build", category: "project" },
      { time: "21:00", title: "Review + System Design notes", category: "focus" },
    ],
  },
];

const quickPrompts = [
  "Plan my week around mid-sems",
  "Add 1 hour of DSA every morning",
  "I missed gym yesterday — adjust",
  "Block deep focus after 9pm",
];

function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = synthesize(trimmed);
      setMessages((m) => [...m, reply]);
      setTyping(false);
      inputRef.current?.focus();
    }, 1100);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Assistant"
        title="AI Planner"
        subtitle="Describe your goals — I'll build the schedule."
        right={<AiOrb size={40} />}
      />

      <div className="px-5">
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <MessageBubble key={m.id} msg={m} />
          ))}
          {typing && <TypingBubble />}
          <div ref={endRef} />
        </div>
      </div>

      {/* Quick prompts */}
      <div className="mt-5 px-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Try</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {quickPrompts.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-[12px] font-medium text-foreground shadow-card hover:bg-muted"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div className="fixed bottom-[80px] left-1/2 z-30 w-full max-w-[460px] -translate-x-1/2 px-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2 rounded-3xl border border-border bg-surface/95 p-2 pl-4 shadow-elevated backdrop-blur-xl"
        >
          <Sparkles className="mb-2.5 h-4 w-4 text-gradient-ai text-primary" />
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            placeholder="Ask AI to plan, reschedule, or protect time…"
            className="max-h-28 flex-1 resize-none bg-transparent py-2 text-[14px] leading-snug text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-ai text-ai-foreground shadow-ai disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}

function MessageBubble({ msg }: { msg: Msg }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end animate-float-in">
        <div className="max-w-[82%] rounded-3xl rounded-br-md bg-primary px-4 py-2.5 text-[14px] leading-snug text-primary-foreground shadow-card">
          {msg.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2.5 animate-float-in">
      <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-ai shadow-ai">
        <Sparkles className="h-4 w-4 text-ai-foreground" />
      </div>
      <div className="max-w-[85%] space-y-2">
        <p className="text-[14px] leading-relaxed text-foreground">{msg.text}</p>
        {msg.plan && (
          <div className="rounded-2xl border border-border bg-card p-3 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Proposed day
              </p>
              <AiBadge label="Draft" />
            </div>
            <ol className="mt-2.5 space-y-1.5">
              {msg.plan.map((p, i) => {
                const meta = categoryMeta[p.category];
                return (
                  <li key={i} className="flex items-center gap-2.5">
                    <span className="w-12 shrink-0 text-[11px] font-semibold tabular-nums text-muted-foreground">
                      {p.time}
                    </span>
                    <span className={`h-2 w-2 rounded-full ${meta.ring}`} />
                    <span className="flex-1 text-[13px] text-foreground">{p.title}</span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-3 flex gap-2">
              <button className="flex-1 rounded-full border border-border px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-muted">
                Tweak
              </button>
              <button className="flex-1 rounded-full bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground shadow-card">
                Add to calendar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex gap-2.5">
      <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-ai shadow-ai">
        <Sparkles className="h-4 w-4 text-ai-foreground" />
      </div>
      <div className="flex items-center gap-1 rounded-3xl bg-muted px-4 py-3">
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

function synthesize(prompt: string): Msg {
  const p = prompt.toLowerCase();
  if (p.includes("missed") || p.includes("reschedule") || p.includes("adjust")) {
    return {
      id: crypto.randomUUID(),
      role: "ai",
      text:
        "No worries. I'll move yesterday's Push Day to today 06:30 and shift the Capstone block 30 min later. Your weekly gym streak stays intact (12 days).",
      plan: [
        { time: "06:30", title: "Gym Push Day (rescheduled)", category: "gym" },
        { time: "18:00", title: "Capstone — Auth refactor", category: "project" },
        { time: "21:00", title: "Deep work: System Design", category: "focus" },
      ],
    };
  }
  if (p.includes("focus") || p.includes("deep") || p.includes("block")) {
    return {
      id: crypto.randomUUID(),
      role: "ai",
      text:
        "Locked 21:00–22:30 as Focus on weekdays. Notifications and meeting invites will be auto-declined during this slot.",
    };
  }
  if (p.includes("dsa")) {
    return {
      id: crypto.randomUUID(),
      role: "ai",
      text: "Added 1 hour of DSA at 06:45 Mon–Sat, paired with your gym days. I'll rotate topics weekly based on your sheet progress.",
      plan: [
        { time: "06:45", title: "DSA — Arrays warmup", category: "dsa" },
        { time: "07:45", title: "Quick recap notes", category: "focus" },
      ],
    };
  }
  return {
    id: crypto.randomUUID(),
    role: "ai",
    text: "Done. I've restructured your week to balance lectures, DSA depth and placement prep — keeping evenings light for recovery.",
    plan: [
      { time: "06:30", title: "Gym + journaling", category: "gym" },
      { time: "10:30", title: "DSA — focused practice", category: "dsa" },
      { time: "16:00", title: "Placement mock test", category: "placement" },
      { time: "19:00", title: "Capstone build", category: "project" },
    ],
  };
}
