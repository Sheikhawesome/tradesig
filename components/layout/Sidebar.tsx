"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, TrendingUp, LineChart, Briefcase, Settings, Crown, Zap, MessageSquare,
} from "lucide-react";
import type { TierName } from "@/types";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, tier: "free" },
  { href: "/signals", label: "Signals", icon: TrendingUp, tier: "free" },
  { href: "/chart", label: "Chart", icon: LineChart, tier: "free" },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase, tier: "elite" },
  { href: "/ai-chat", label: "Hamilton AI", icon: MessageSquare, tier: "elite" },
];

interface SidebarProps {
  userTier: TierName;
}

export function Sidebar({ userTier }: SidebarProps) {
  const pathname = usePathname();
  const tierOrder: Record<TierName, number> = { free: 0, pro: 1, elite: 2 };

  return (
    <aside className="fixed left-0 top-0 h-full w-16 lg:w-56 z-40 flex flex-col bg-surface-800 border-r border-white/[0.06]">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg hidden lg:block">TradeSig</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {nav.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const itemTierLevel = tierOrder[item.tier as TierName] ?? 0;
          const userTierLevel = tierOrder[userTier];
          const isLocked = itemTierLevel > userTierLevel;

          return (
            <Link
              key={item.href}
              href={isLocked ? "/pricing" : item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-brand-500/15 text-brand-400" : "text-slate-400 hover:text-slate-200 hover:bg-surface-700",
                isLocked && "opacity-50"
              )}
              aria-label={item.label}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-brand-400")} />
              <span className="hidden lg:block">{item.label}</span>
              {isLocked && <Crown className="w-3 h-3 hidden lg:block ml-auto text-amber-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade CTA */}
      {userTier === "free" && (
        <div className="p-3 hidden lg:block">
          <Link href="/pricing" className="block rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 p-3 text-center hover:from-brand-500 hover:to-brand-700 transition-all">
            <Crown className="w-5 h-5 text-amber-300 mx-auto mb-1" />
            <p className="text-xs font-semibold text-white">Upgrade to Pro</p>
            <p className="text-[10px] text-brand-200 mt-0.5">Unlock all signals</p>
          </Link>
        </div>
      )}

      {/* Settings */}
      <div className="p-2 border-t border-white/[0.06]">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-surface-700 transition-colors">
          <Settings className="w-5 h-5" />
          <span className="hidden lg:block">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
