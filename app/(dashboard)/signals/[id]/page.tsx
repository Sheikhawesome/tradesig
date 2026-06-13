"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { TradingViewChart } from "@/components/charts/TradingViewChart";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/store";
import { toTradingViewSymbol, getSignalColor, formatPrice } from "@/lib/signals";
import { timeAgo } from "@/lib/utils";
import { AGENT } from "@/lib/agent";
import type { Signal } from "@/types";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Target, ShieldAlert, Activity, Clock, Lock, Bot } from "lucide-react";
import Link from "next/link";

const dirIcon = { BUY: TrendingUp, SELL: TrendingDown, HOLD: Minus };

// Map our timeframe to a TradingView interval code
function tvInterval(tf: string): string {
  const map: Record<string, string> = {
    "1m": "1", "5m": "5", "15m": "15", "1h": "60", "4h": "240", "1d": "D", "1w": "W",
  };
  return map[tf] ?? "D";
}

export default function SignalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tier = useAuth(s => s.tier);
  const email = useAuth(s => s.email);
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);

  const id = params.id as string;

  useEffect(() => {
    fetch(`/api/signals/${id}`)
      .then(r => r.json())
      .then(d => { setSignal(d.signal ?? null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <TopBar title="Signal" userTier={tier} userEmail={email ?? undefined} />
        <div className="h-96 rounded-xl bg-surface-700 animate-pulse mt-6" />
      </div>
    );
  }

  if (!signal) {
    return (
      <div className="p-4 lg:p-6">
        <TopBar title="Signal" userTier={tier} userEmail={email ?? undefined} />
        <Card className="text-center py-12 mt-6">
          <p className="text-slate-400 mb-4">Signal not found.</p>
          <Link href="/signals"><Button>Back to Signals</Button></Link>
        </Card>
      </div>
    );
  }

  const tierOrder = { free: 0, pro: 1, elite: 2 };
  const locked = tierOrder[tier] < tierOrder[signal.tier];
  const Icon = dirIcon[signal.direction];
  const color = getSignalColor(signal.direction);
  const tvSymbol = toTradingViewSymbol(signal.symbol, signal.assetClass);

  return (
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      <TopBar title={signal.symbol} userTier={tier} userEmail={email ?? undefined} />

      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white font-mono">{signal.symbol}</h2>
                <Badge variant={signal.direction.toLowerCase() as "buy" | "sell" | "hold"}>{signal.direction}</Badge>
                <Badge variant={signal.tier as "free" | "pro" | "elite"}>{signal.tier}</Badge>
              </div>
              <p className="text-sm text-slate-500">{signal.name}</p>
            </div>
          </div>
          <div className="flex gap-4 text-center">
            <Metric label="Confidence" value={`${signal.confidence}%`} />
            <Metric label="Win Rate" value={`${signal.winRate}%`} />
            <Metric label="R/R" value={`${signal.riskReward.toFixed(1)}x`} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2">
          <Card className="p-0 overflow-hidden">
            <TradingViewChart symbol={tvSymbol} theme="dark" interval={tvInterval(signal.timeframe)} height={480} />
          </Card>
        </div>

        {/* Levels + Hamilton */}
        <div className="space-y-4">
          {locked ? (
            <Card className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-900/30 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 text-amber-400" />
              </div>
              <p className="text-sm text-slate-300">Trade levels & Hamilton's full analysis require {signal.tier === "pro" ? "Pro" : "Elite"}.</p>
              <Link href="/pricing"><Button size="sm" className="w-full">Upgrade to {signal.tier === "pro" ? "Pro" : "Elite"}</Button></Link>
            </Card>
          ) : (
            <>
              {/* Trade levels */}
              <Card>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Trade Levels</h3>
                <div className="space-y-2">
                  <Level icon={<Activity className="w-4 h-4 text-slate-400" />} label="Entry" value={formatPrice(signal.entryPrice, signal.symbol)} />
                  <Level icon={<Target className="w-4 h-4 text-emerald-400" />} label="Target" value={formatPrice(signal.targetPrice, signal.symbol)} valueClass="text-emerald-400" />
                  <Level icon={<ShieldAlert className="w-4 h-4 text-red-400" />} label="Stop Loss" value={formatPrice(signal.stopLoss, signal.symbol)} valueClass="text-red-400" />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/[0.06]">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-500">Technical</p>
                    <p className="text-sm font-bold text-slate-200">{signal.technicalScore}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-500">Fundamental</p>
                    <p className="text-sm font-bold text-slate-200">{signal.fundamentalScore}%</p>
                  </div>
                </div>
              </Card>

              {/* Hamilton's analysis */}
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-brand-700 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{AGENT.name}</p>
                    <p className="text-[10px] text-slate-500">{AGENT.title}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{signal.reasoning}</p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.06] text-xs text-slate-500">
                  <Clock className="w-3 h-3" /> {signal.timeframe} · issued {timeAgo(signal.createdAt)}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-lg font-bold text-white font-mono">{value}</p>
      <p className="text-[10px] text-slate-500">{label}</p>
    </div>
  );
}

function Level({ icon, label, value, valueClass }: { icon: React.ReactNode; label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-700/50">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      <span className={`text-sm font-bold font-mono ${valueClass ?? "text-slate-200"}`}>{value}</span>
    </div>
  );
}
