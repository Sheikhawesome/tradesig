"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, Search, LogOut, Settings, Crown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/store";
import type { TierName } from "@/types";

interface TopBarProps {
  title: string;
  userTier: TierName;
  userEmail?: string;
}

// Demo notifications — replace with real feed later
const NOTIFICATIONS = [
  { id: 1, dir: "BUY", symbol: "XAU/USD", text: "New high-confidence BUY signal — 81% confidence", time: "2m ago", unread: true },
  { id: 2, dir: "SELL", symbol: "EUR/USD", text: "New SELL signal — bearish reversal at resistance", time: "18m ago", unread: true },
  { id: 3, dir: "BUY", symbol: "BTC/USD", text: "Bitcoin holding key support — BUY setup active", time: "1h ago", unread: false },
];

export function TopBar({ title, userTier, userEmail }: TopBarProps) {
  const router = useRouter();
  const logout = useAuth(s => s.logout);
  const name = useAuth(s => s.name);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const dirIcon = { BUY: TrendingUp, SELL: TrendingDown, HOLD: Minus };

  return (
    <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-white/[0.06] bg-surface-800/50 backdrop-blur-sm sticky top-0 z-30">
      <h1 className="text-base font-semibold text-white truncate">{title}</h1>
      <div className="flex items-center gap-2 sm:gap-3">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-surface-700 transition-colors" aria-label="Search">
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(o => !o)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-surface-700 relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-brand-500 text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl bg-surface-800 border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden animate-slide-up z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <span className="text-sm font-semibold text-white">Notifications</span>
                <span className="text-xs text-brand-400 cursor-pointer hover:text-brand-300">Mark all read</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {NOTIFICATIONS.map(n => {
                  const Icon = dirIcon[n.dir as keyof typeof dirIcon];
                  const color = n.dir === "BUY" ? "text-emerald-400" : n.dir === "SELL" ? "text-red-400" : "text-amber-400";
                  return (
                    <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-white/[0.04] hover:bg-surface-700/50 transition-colors ${n.unread ? "bg-brand-900/10" : ""}`}>
                      <div className={`w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center flex-shrink-0 ${color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-200">
                          <span className="font-mono font-semibold">{n.symbol}</span>
                        </p>
                        <p className="text-xs text-slate-400 leading-snug">{n.text}</p>
                        <p className="text-[10px] text-slate-600 mt-0.5">{n.time}</p>
                      </div>
                      {n.unread && <span className="w-2 h-2 rounded-full bg-brand-400 flex-shrink-0 mt-1.5" />}
                    </div>
                  );
                })}
              </div>
              <Link href="/signals" onClick={() => setNotifOpen(false)} className="block text-center py-2.5 text-xs text-brand-400 hover:text-brand-300 hover:bg-surface-700/50 transition-colors">
                View all signals
              </Link>
            </div>
          )}
        </div>

        <Badge variant={userTier}>{userTier.charAt(0).toUpperCase() + userTier.slice(1)}</Badge>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-xs font-bold text-white hover:ring-2 hover:ring-brand-500 transition-all"
            aria-label="User menu"
          >
            {(name ?? userEmail ?? "U").charAt(0).toUpperCase()}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-surface-800 border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden animate-slide-up z-50">
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <p className="text-sm font-semibold text-white truncate">{name ?? "Trader"}</p>
                <p className="text-xs text-slate-500 truncate">{userEmail ?? "—"}</p>
              </div>
              <div className="py-1">
                <Link href="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-surface-700 transition-colors">
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                {userTier !== "elite" && (
                  <Link href="/pricing" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-300 hover:bg-surface-700 transition-colors">
                    <Crown className="w-4 h-4" /> Upgrade plan
                  </Link>
                )}
              </div>
              <div className="py-1 border-t border-white/[0.06]">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-surface-700 transition-colors">
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
