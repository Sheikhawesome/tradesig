"use client";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "buy" | "sell" | "hold" | "free" | "pro" | "elite" | "default";
  className?: string;
}

const variantClasses = {
  buy: "bg-emerald-900/40 text-emerald-300 border border-emerald-700/30",
  sell: "bg-red-900/40 text-red-300 border border-red-700/30",
  hold: "bg-amber-900/40 text-amber-300 border border-amber-700/30",
  free: "bg-surface-500 text-slate-400",
  pro: "bg-brand-900/60 text-brand-300",
  elite: "bg-amber-900/40 text-amber-300",
  default: "bg-surface-500 text-slate-400",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide", variantClasses[variant], className)}>
      {children}
    </span>
  );
}
