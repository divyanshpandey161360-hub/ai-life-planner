import { Sparkles } from "lucide-react";

export function AiBadge({ label = "AI", className = "" }: { label?: string; className?: string }) {
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full bg-gradient-ai px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ai-foreground shadow-ai " +
        className
      }
    >
      <Sparkles className="h-3 w-3" strokeWidth={2.4} />
      {label}
    </span>
  );
}

export function AiOrb({ size = 44 }: { size?: number }) {
  return (
    <span
      className="relative inline-flex items-center justify-center rounded-full bg-gradient-ai shadow-ai animate-pulse-ring"
      style={{ width: size, height: size }}
    >
      <Sparkles className="text-ai-foreground" style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={2.2} />
    </span>
  );
}
