"use client";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface LivePrice {
  symbol: string;
  price: number;
  changePercent: number;
  source: string;
}

const CRYPTO_SYMBOLS = ["BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "DOGE"];

// Live crypto prices from CoinGecko (free, real data, no key)
export function LivePrices({ compact = false }: { compact?: boolean }) {
  const [prices, setPrices] = useState<LivePrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch(`/api/prices?crypto=${CRYPTO_SYMBOLS.join(",")}`);
        const data = await res.json();
        if (active && data.prices) {
          setPrices(data.prices);
          setLoading(false);
        }
      } catch {
        if (active) setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 60000); // refresh every 60s
    return () => { active = false; clearInterval(interval); };
  }, []);

  if (loading) {
    return (
      <div className="flex gap-3 overflow-hidden">
        {[...Array(compact ? 4 : 7)].map((_, i) => (
          <div key={i} className="h-12 w-28 rounded-lg bg-surface-700 animate-pulse flex-shrink-0" />
        ))}
      </div>
    );
  }

  const shown = compact ? prices.slice(0, 4) : prices;

  return (
    <div className="flex gap-3 flex-wrap">
      {shown.map(p => {
        const up = p.changePercent >= 0;
        return (
          <div key={p.symbol} className="flex items-center gap-2 rounded-lg bg-surface-800 border border-white/[0.06] px-3 py-2 flex-shrink-0">
            <span className="font-mono font-semibold text-sm text-white">{p.symbol}</span>
            <span className="font-mono text-sm text-slate-300">
              ${p.price.toLocaleString(undefined, { maximumFractionDigits: p.price < 1 ? 4 : 2 })}
            </span>
            <span className={`flex items-center gap-0.5 text-xs font-medium ${up ? "text-emerald-400" : "text-red-400"}`}>
              {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(p.changePercent).toFixed(2)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
