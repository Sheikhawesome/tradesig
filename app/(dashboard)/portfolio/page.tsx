"use client";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Lock, TrendingUp, TrendingDown, Wallet, Target, Percent } from "lucide-react";
import { useAuth } from "@/lib/store";
import { formatCurrency, formatPercent } from "@/lib/utils";
import Link from "next/link";

// Demo positions — replace with real broker/journal data later
const POSITIONS = [
  { symbol: "AAPL", name: "Apple Inc.", dir: "BUY", entry: 189.50, current: 194.20, size: 10, status: "open" },
  { symbol: "XAU/USD", name: "Gold", dir: "BUY", entry: 2318, current: 2351, size: 1, status: "open" },
  { symbol: "EUR/USD", name: "Euro / Dollar", dir: "SELL", entry: 1.0842, current: 1.0790, size: 10000, status: "open" },
  { symbol: "BTC/USD", name: "Bitcoin", dir: "BUY", entry: 62450, current: 61800, size: 0.1, status: "open" },
];

const CLOSED = [
  { symbol: "NVDA", dir: "BUY", pnl: 420, pnlPct: 8.2, result: "win" },
  { symbol: "ETH/USD", dir: "BUY", pnl: 180, pnlPct: 5.7, result: "win" },
  { symbol: "GBP/USD", dir: "SELL", pnl: -95, pnlPct: -2.1, result: "loss" },
];

function pnlOf(p: typeof POSITIONS[0]) {
  const diff = p.dir === "BUY" ? p.current - p.entry : p.entry - p.current;
  return diff * p.size;
}
function pnlPctOf(p: typeof POSITIONS[0]) {
  const diff = p.dir === "BUY" ? p.current - p.entry : p.entry - p.current;
  return (diff / p.entry) * 100;
}

export default function PortfolioPage() {
  const tier = useAuth(s => s.tier);
  const email = useAuth(s => s.email);

  if (tier !== "elite") {
    return (
      <div className="p-4 lg:p-6 animate-fade-in">
        <TopBar title="Portfolio" userTier={tier} userEmail={email ?? undefined} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md text-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-900/30 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Elite Feature</h2>
            <p className="text-slate-400 text-sm">Portfolio tracking, P&L analysis, and trade history are available on the Elite plan.</p>
            <Link href="/pricing"><Button className="w-full">Upgrade to Elite</Button></Link>
          </Card>
        </div>
      </div>
    );
  }

  const openPnl = POSITIONS.reduce((a, p) => a + pnlOf(p), 0);
  const closedPnl = CLOSED.reduce((a, p) => a + p.pnl, 0);
  const wins = CLOSED.filter(c => c.result === "win").length;
  const winRate = Math.round((wins / CLOSED.length) * 100);

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      <TopBar title="Portfolio" userTier={tier} userEmail={email ?? undefined} />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard icon={<Wallet className="w-5 h-5 text-brand-400" />} label="Open P&L" value={formatCurrency(openPnl)} positive={openPnl >= 0} />
        <SummaryCard icon={<Target className="w-5 h-5 text-emerald-400" />} label="Realized P&L" value={formatCurrency(closedPnl)} positive={closedPnl >= 0} />
        <SummaryCard icon={<Percent className="w-5 h-5 text-brand-400" />} label="Win Rate" value={`${winRate}%`} positive />
        <SummaryCard icon={<TrendingUp className="w-5 h-5 text-amber-400" />} label="Open Trades" value={`${POSITIONS.length}`} positive />
      </div>

      {/* Open positions */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Open Positions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-white/[0.06]">
                <th className="pb-2 font-medium">Symbol</th>
                <th className="pb-2 font-medium">Side</th>
                <th className="pb-2 font-medium text-right">Entry</th>
                <th className="pb-2 font-medium text-right">Current</th>
                <th className="pb-2 font-medium text-right">P&L</th>
              </tr>
            </thead>
            <tbody>
              {POSITIONS.map(p => {
                const pnl = pnlOf(p);
                const pnlPct = pnlPctOf(p);
                const up = pnl >= 0;
                return (
                  <tr key={p.symbol} className="border-b border-white/[0.04]">
                    <td className="py-3">
                      <div className="font-mono font-semibold text-white">{p.symbol}</div>
                      <div className="text-xs text-slate-500">{p.name}</div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${p.dir === "BUY" ? "bg-emerald-900/40 text-emerald-300" : "bg-red-900/40 text-red-300"}`}>
                        {p.dir}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-slate-300">{p.entry.toLocaleString()}</td>
                    <td className="py-3 text-right font-mono text-slate-300">{p.current.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <div className={`font-mono font-semibold ${up ? "text-emerald-400" : "text-red-400"}`}>{formatCurrency(pnl)}</div>
                      <div className={`text-xs ${up ? "text-emerald-500" : "text-red-500"}`}>{formatPercent(pnlPct)}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Trade history */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Recent Closed Trades</h3>
        <div className="space-y-2">
          {CLOSED.map((c, i) => {
            const up = c.pnl >= 0;
            return (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-700/50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${up ? "bg-emerald-900/40" : "bg-red-900/40"}`}>
                    {up ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
                  </div>
                  <div>
                    <span className="font-mono font-semibold text-white text-sm">{c.symbol}</span>
                    <span className="ml-2 text-xs text-slate-500">{c.dir}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-mono font-semibold text-sm ${up ? "text-emerald-400" : "text-red-400"}`}>{formatCurrency(c.pnl)}</div>
                  <div className={`text-xs ${up ? "text-emerald-500" : "text-red-500"}`}>{formatPercent(c.pnlPct)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <p className="text-xs text-slate-600 text-center">
        Demo data shown. Connect your broker or log trades manually to track your real performance.
      </p>
    </div>
  );
}

function SummaryCard({ icon, label, value, positive }: { icon: React.ReactNode; label: string; value: string; positive: boolean }) {
  return (
    <Card className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className={`text-lg font-bold font-mono ${positive ? "text-emerald-400" : "text-red-400"}`}>{value}</p>
      </div>
    </Card>
  );
}
