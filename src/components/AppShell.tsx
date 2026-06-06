import { Link, useRouterState } from "@tanstack/react-router";
import { Home, MessageSquareText, CalendarDays, AlertTriangle, Target } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/assistant", label: "AI", icon: MessageSquareText },
  { to: "/calendar", label: "Week", icon: CalendarDays },
  { to: "/conflicts", label: "Resolve", icon: AlertTriangle },
  { to: "/goals", label: "Goals", icon: Target },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[460px] flex-col bg-background">
      <main className="flex-1 pb-24">{children}</main>
      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[460px] -translate-x-1/2 border-t border-border bg-surface/85 backdrop-blur-xl">
        <ul className="grid grid-cols-5 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            const isAI = to === "/assistant";
            return (
              <li key={to} className="flex justify-center">
                <Link
                  to={to}
                  className="group relative flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-1.5 transition-colors"
                >
                  <span
                    className={[
                      "flex h-9 w-14 items-center justify-center rounded-full transition-all",
                      active
                        ? isAI
                          ? "bg-gradient-ai text-ai-foreground shadow-ai"
                          : "bg-primary/12 text-primary"
                        : "text-muted-foreground group-hover:bg-muted",
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                  </span>
                  <span
                    className={[
                      "text-[10.5px] font-medium tracking-wide",
                      active ? "text-foreground" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <header className="px-5 pt-7 pb-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}
