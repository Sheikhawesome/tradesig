"use client";
import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { SignalCard } from "@/components/signals/SignalCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Signal, TierName, AssetClass } from "@/types";
import { TrendingUp, TrendingDown, Minus, Zap, BarChart2, Target, Shield } from "lucide-react";
import Link from "next/link";

const USER_TIER: TierName = "free";

const ASSET_FILTERS: { label: string; value: AssetClass | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Stocks", value: "stocks" },
  { label: "Crypto", value: "crypto" },
  { label: "Forex", value: "forex" },
  { label: "Metals", value: "metals" },
];

export default function DashboardPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [filter, setFilter] = useState<AssetClass | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ tier: USER_TIER });
    if (filter !== "all") params.set("assetClass", filter);
    setLoading(true);
    fetch(`/api/signals?${params}`)
      .then(r => r.json())
      .then(d => { setSignals(d.signals ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filter]);

  const stats = {
    total: signals.length,
    buy: signals.filter(s => s.direction === "BUY").length,
    sell: signals.filter(s => s.direction === "SELL").length,
    hold: signals.filter(s => s.direction === "HOLD").length,
    avgConfidence: signals.length ? Math.round(signals.reduce((a, s) => a + s.confidence, 0) / signals.length) : 0,
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      <TopBar title="Dashboard" userTier={USER_TIER} userEmail="demo@tradesig.com" />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} label="Buy Signals" value={stats.buy} color="text-emerald-400" />
        <StatCard icon={<TrendingDown className="w-5 h-5 text-red-400" />} label="Sell Signals" value={stats.sell} color="text-red-400" />
        <StatCard icon={<Minus className="w-5 h-5 text-amber-400" />} label="Hold Signals" value={stats.hold} color="text-amber-400" />
        <StatCard icon={<Zap className="w-5 h-5 text-brand-400" />} label="Avg Confidence" value={`${stats.avgConfidence}%`} color="text-brand-400" />
      </div>

      {/* Win rate banner */}
      <div className="rounded-xl bg-gradient-to-r from-brand-900/40 to-surface-700/40 border border-brand-700/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">AI Analysis Engine</p>
            <p className="text-xs text-slate-400">RSI + MACD + EMA confluence + Fundamental scoring · Targeting 68-75% win rate</p>
          </div>
        </div>
        <div className="flex gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-emerald-400 font-mono">72%</p>
            <p className="text-[10px] text-slate-500">Avg Win Rate</p>
          </div>
          <div>
            <p className="text-lg font-bold text-brand-400 font-mono">2.1x</p>
            <p className="text-[10px] text-slate-500">Avg R/R</p>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-200 font-mono">1,240+</p>
            <p className="text-[10px] text-slate-500">Signals Issued</p>
          </div>
        </div>
      </div>

      {/* Signals */}
      <Card>
        <CardHeader>
          <CardTitle>Live Signals</CardTitle>
          <div className="flex gap-1 flex-wrap">
            {ASSET_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === f.value ? "bg-brand-500 text-white" : "bg-surface-600 text-slate-400 hover:text-slate-200"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </CardHeader>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-surface-700 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {signals.map(signal => (
              <SignalCard key={signal.id} signal={signal} userTier={USER_TIER} />
            ))}
          </div>
        )}

        {USER_TIER === "free" && (
          <div className="mt-4 p-4 rounded-xl bg-surface-700/50 border border-brand-700/30 text-center">
            <p className="text-sm text-slate-300 mb-2">
              You're seeing <strong>3 of 20+</strong> daily signals on the free tier.
            </p>
            <Link href="/pricing">
              <Button size="sm">Unlock All Signals — from $29/mo</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <Card className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
      </div>
    </Card>
  );
}
