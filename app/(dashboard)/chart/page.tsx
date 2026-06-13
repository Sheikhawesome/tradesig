"use client";
import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { TradingViewChart } from "@/components/charts/TradingViewChart";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { TierName } from "@/types";

const USER_TIER: TierName = "free";

const POPULAR_SYMBOLS = [
  { label: "AAPL", value: "NASDAQ:AAPL" },
  { label: "BTC/USD", value: "BITSTAMP:BTCUSD" },
  { label: "ETH/USD", value: "BITSTAMP:ETHUSD" },
  { label: "EUR/USD", value: "FX_IDC:EURUSD" },
  { label: "Gold", value: "TVC:GOLD" },
  { label: "NVDA", value: "NASDAQ:NVDA" },
  { label: "S&P 500", value: "FOREXCOM:SPXUSD" },
  { label: "GBP/USD", value: "FX_IDC:GBPUSD" },
  { label: "Silver", value: "TVC:SILVER" },
];

const TIMEFRAMES = [
  { label: "1m", value: "1" },
  { label: "5m", value: "5" },
  { label: "15m", value: "15" },
  { label: "1h", value: "60" },
  { label: "4h", value: "240" },
  { label: "1D", value: "D" },
  { label: "1W", value: "W" },
];

export default function ChartPage() {
  const [symbol, setSymbol] = useState("NASDAQ:AAPL");
  const [interval, setInterval] = useState("D");
  const [customSymbol, setCustomSymbol] = useState("");

  function handleCustom(e: React.FormEvent) {
    e.preventDefault();
    if (customSymbol.trim()) {
      setSymbol(customSymbol.trim().toUpperCase());
      setCustomSymbol("");
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      <TopBar title="Chart" userTier={USER_TIER} />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SYMBOLS.map(s => (
            <button
              key={s.value}
              onClick={() => setSymbol(s.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${symbol === s.value ? "bg-brand-500 text-white" : "bg-surface-700 text-slate-400 hover:text-slate-200"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <form onSubmit={handleCustom} className="flex gap-2 ml-auto">
          <input
            value={customSymbol}
            onChange={e => setCustomSymbol(e.target.value)}
            placeholder="Custom symbol (e.g. TSLA)"
            className="px-3 py-1.5 rounded-lg bg-surface-700 border border-white/[0.06] text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 w-48"
          />
          <Button type="submit" size="sm" variant="outline">Go</Button>
        </form>
      </div>

      {/* Timeframe */}
      <div className="flex gap-1">
        {TIMEFRAMES.map(tf => (
          <button
            key={tf.value}
            onClick={() => setInterval(tf.value)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${interval === tf.value ? "bg-brand-500/20 text-brand-400 border border-brand-500/40" : "bg-surface-700 text-slate-500 hover:text-slate-300"}`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <Card className="p-0 overflow-hidden">
        <TradingViewChart symbol={symbol} theme="dark" interval={interval} height={560} />
      </Card>

      <p className="text-xs text-slate-600 text-center">
        Powered by TradingView · All instruments available · Includes RSI, MACD, Bollinger Bands, EMA indicators
      </p>
    </div>
  );
}
