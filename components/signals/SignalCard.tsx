"use client";
import type { Signal, TierName } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { getSignalColor, getSignalBgClass, formatPrice } from "@/lib/signals";
import { timeAgo, formatPercent } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Lock, Target, ShieldAlert, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignalCardProps {
  signal: Signal;
  userTier: TierName;
  onClick?: () => void;
}

const directionIcon = { BUY: TrendingUp, SELL: TrendingDown, HOLD: Minus };
const assetLabel: Record<string, string> = { stocks: "Stock", forex: "Forex", crypto: "Crypto", metals: "Metal" };

export function SignalCard({ signal, userTier, onClick }: SignalCardProps) {
  const Icon = directionIcon[signal.direction];
  const color = getSignalColor(signal.direction);
  const bgClass = getSignalBgClass(signal.direction);
  const isLocked = userTier === "free" && signal.tier !== "free";
  const showDetails = !isLocked;

  const rrPct = ((signal.targetPrice - signal.entryPrice) / Math.abs(signal.entryPrice - signal.stopLoss) * 100).toFixed(0);

  return (
    <div
      className={cn(
        "relative rounded-xl border border-white/[0.06] p-4 cursor-pointer transition-all duration-200 hover:border-white/10 hover:scale-[1.01] active:scale-[0.99]",
        bgClass,
        isLocked && "opacity-60"
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick?.()}
      aria-label={`${signal.symbol} ${signal.direction} signal`}
    >
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-surface-900/60 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2 text-slate-400">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Upgrade to {signal.tier === "pro" ? "Pro" : "Elite"}</span>
          </div>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white font-mono text-sm">{signal.symbol}</span>
              <Badge variant={signal.direction.toLowerCase() as "buy" | "sell" | "hold"}>
                {signal.direction}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{signal.name}</p>
          </div>
        </div>
        <div className="text-right">
          <Badge variant={signal.tier as "free" | "pro" | "elite"} className="mb-1">
            {signal.tier}
          </Badge>
          <p className="text-xs text-slate-500">{assetLabel[signal.assetClass]}</p>
        </div>
      </div>

      {/* Summary */}
      <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">{signal.summary}</p>

      {/* Metrics */}
      {showDetails ? (
        <div className="grid grid-cols-3 gap-2 mb-3">
          <Metric label="Entry" value={formatPrice(signal.entryPrice, signal.symbol)} />
          <Metric label="Target" value={formatPrice(signal.targetPrice, signal.symbol)} highlight />
          <Metric label="Stop Loss" value={formatPrice(signal.stopLoss, signal.symbol)} danger />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {["Entry", "Target", "Stop"].map(l => (
            <div key={l} className="rounded-lg bg-surface-900/40 p-2 text-center">
              <p className="text-xs text-slate-600 mb-1">{l}</p>
              <div className="h-4 w-16 mx-auto rounded bg-surface-700 animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Footer row */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span>Conf: <span className="text-slate-300 font-semibold">{signal.confidence}%</span></span>
          </div>
          {showDetails && (
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              <span>R/R: <span className="text-slate-300 font-semibold">{signal.riskReward.toFixed(1)}x</span></span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            <span>Win: <span className="text-slate-300 font-semibold">{signal.winRate}%</span></span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{signal.timeframe} · {timeAgo(signal.createdAt)}</span>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mt-3">
        <div className="h-1 rounded-full bg-surface-600 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${signal.confidence}%`, backgroundColor: color }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-slate-600">
          <span>Tech: {signal.technicalScore}%</span>
          <span>Fund: {signal.fundamentalScore}%</span>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, highlight, danger }: { label: string; value: string; highlight?: boolean; danger?: boolean }) {
  return (
    <div className="rounded-lg bg-surface-900/40 p-2 text-center">
      <p className="text-[10px] text-slate-500 mb-0.5">{label}</p>
      <p className={cn("text-xs font-bold font-mono", highlight ? "text-emerald-400" : danger ? "text-red-400" : "text-slate-200")}>
        {value}
      </p>
    </div>
  );
}
