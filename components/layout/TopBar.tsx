"use client";
import { Bell, Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { TierName } from "@/types";

interface TopBarProps {
  title: string;
  userTier: TierName;
  userEmail?: string;
}

export function TopBar({ title, userTier, userEmail }: TopBarProps) {
  return (
    <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-white/[0.06] bg-surface-800/50 backdrop-blur-sm sticky top-0 z-30">
      <h1 className="text-base font-semibold text-white">{title}</h1>
      <div className="flex items-center gap-3">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-surface-700 transition-colors" aria-label="Search">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-surface-700 relative transition-colors" aria-label="Notifications">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-400" />
        </button>
        <div className="flex items-center gap-2">
          <Badge variant={userTier}>{userTier.charAt(0).toUpperCase() + userTier.slice(1)}</Badge>
          <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-xs font-bold text-white">
            {userEmail?.charAt(0).toUpperCase() ?? "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
