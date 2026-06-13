"use client";
import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { SignalCard } from "@/components/signals/SignalCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Signal, AssetClass, SignalDirection } from "@/types";
import { RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/store";
import Link from "next/link";

export default function SignalsPage() {
  const tier = useAuth(s => s.tier);
  const email = useAuth(s => s.email);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [assetFilter, setAssetFilter] = useState<AssetClass | "all">("all");
  const [dirFilter, setDirFilter] = useState<SignalDirection | "all">("all");
  const [selected, setSelected] = useState<Signal | null>(null);

  async function loadSignals() {
    setLoading(true);
    const params = new URLSearchParams({ tier });
    if (assetFilter !== "all") params.set("assetClass", assetFilter);
    const res = await fetch(`/api/signals?${params}`);
    const data = await res.json();
    let sigs: Signal[] = data.signals ?? [];
    if (dirFilter !== "all") sigs = sigs.filter(s => s.direction === dirFilter);
    setSignals(sigs);
    setLoading(false);
  }

  useEffect(() => { loadSignals(); }, [assetFilter, dirFilter, tier]);

  return (
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      <TopBar title="Signals" userTier={tier} userEmail={email ?? undefined} />

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Asset filter */}
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "stocks", "crypto", "forex", "metals"] as const).map(v => (
            <button key={v} onClick={() => setAssetFilter(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${assetFilter === v ? "bg-brand-500 text-white" : "bg-surface-700 text-slate-400 hover:text-slate-200"}`}>
              {v}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "BUY", "SELL", "HOLD"] as const).map(v => (
            <button key={v} onClick={() => setDirFilter(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${dirFilter === v ? "bg-brand-500 text-white" : "bg-surface-700 text-slate-400 hover:text-slate-200"}`}>
              {v}
            </button>
          ))}
        </div>
        <button onClick={loadSignals} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 bg-surface-700 transition-colors">
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {loading
          ? [...Array(4)].map((_, i) => <div key={i} className="h-52 rounded-xl bg-surface-700 animate-pulse" />)
          : signals.map(s => (
              <SignalCard key={s.id} signal={s} userTier={tier} onClick={() => setSelected(s)} />
            ))
        }
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-surface-800 border border-white/[0.08] p-5 space-y-4 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white text-lg font-mono">{selected.symbol}</h2>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-200 text-xl">✕</button>
            </div>
            <div className="text-sm text-slate-300 leading-relaxed">{selected.reasoning}</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-700 rounded-lg p-2 text-center">
                <p className="text-[10px] text-slate-500">Entry</p>
                <p className="text-sm font-bold font-mono text-slate-200">${selected.entryPrice.toLocaleString()}</p>
              </div>
              <div className="bg-emerald-900/30 rounded-lg p-2 text-center">
                <p className="text-[10px] text-slate-500">Target</p>
                <p className="text-sm font-bold font-mono text-emerald-400">${selected.targetPrice.toLocaleString()}</p>
              </div>
              <div className="bg-red-900/30 rounded-lg p-2 text-center">
                <p className="text-[10px] text-slate-500">Stop</p>
                <p className="text-sm font-bold font-mono text-red-400">${selected.stopLoss.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => setSelected(null)}>Close</Button>
              <Link href={`/signals/${selected.id}`} className="flex-1">
                <Button size="sm" className="w-full">Full Analysis & Chart</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {tier === "free" && (
        <Card>
          <div className="text-center py-4">
            <p className="text-slate-300 text-sm mb-3">Unlock Forex & Metals signals + full entry/target/stop levels</p>
            <Link href="/pricing"><Button>View Pricing Plans</Button></Link>
          </div>
        </Card>
      )}
    </div>
  );
}
