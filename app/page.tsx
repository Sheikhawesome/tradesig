import Link from "next/link";
import { PLANS } from "@/lib/pricing";
import { Check, X, Zap, TrendingUp, Shield, BarChart2, Globe, Cpu } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-900 text-slate-200">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 lg:px-12 bg-surface-900/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg">TradeSig</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">Pricing</Link>
          <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-surface-700 text-sm font-medium text-slate-200 hover:bg-surface-600 transition-colors">Demo</Link>
          <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-sm font-semibold text-white transition-colors">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-6 lg:px-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-brand-900/20 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-900/40 border border-brand-700/30 text-brand-300 text-xs font-medium mb-6">
            <Zap className="w-3 h-3" />
            AI-Powered · Technical + Fundamental · 68-75% Win Rate
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
            Trade Smarter with<br />
            <span className="text-brand-400">AI Signal Intelligence</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Real-time buy, sell & hold signals for stocks, forex, crypto and metals. Our AI analyzes both technical indicators and market fundamentals to give you high-confidence trade setups.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard" className="px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 font-bold text-white text-base transition-all shadow-xl shadow-brand-900/40">
              Start Free — No Card Required
            </Link>
            <Link href="/pricing" className="px-8 py-3 rounded-xl border border-white/10 hover:border-white/20 font-medium text-slate-300 text-base transition-all">
              View Pricing
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-600">No credit card · Cancel anytime · 7-day Pro trial</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Why traders choose TradeSig</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Cpu, title: "Dual AI Analysis", desc: "Every signal combines technical indicators (RSI, MACD, EMA, Bollinger) with fundamental analysis (news, earnings, macro) for the highest accuracy." },
              { icon: TrendingUp, title: "68-75% Win Rate", desc: "Signals are only issued when confidence ≥65% and R/R ≥1.5x. Minimum 2:1 R/R preferred. Based on backtested strategies." },
              { icon: Globe, title: "All Asset Classes", desc: "Stocks, forex, crypto, metals — all in one place. Real-time TradingView charts for every instrument." },
              { icon: BarChart2, title: "Live TradingView Charts", desc: "Embedded charts with RSI, MACD, Bollinger Bands, and EMA pre-loaded. Search any symbol in the world." },
              { icon: Shield, title: "Risk Management Built-In", desc: "Every signal includes entry, take-profit targets and stop-loss levels. Never trade without a defined risk." },
              { icon: Zap, title: "Real-Time Alerts", desc: "Get notified the moment new high-confidence signals are issued. Pro and Elite members get priority alerts." },
            ].map(f => (
              <div key={f.title} className="rounded-xl bg-surface-800 border border-white/[0.06] p-5">
                <div className="w-10 h-10 rounded-xl bg-brand-900/50 flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="font-semibold text-white mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 px-6 lg:px-12 bg-surface-800/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Simple, Transparent Pricing</h2>
          <p className="text-slate-400 text-center mb-10">Start free. Upgrade when you're ready.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map(plan => (
              <div
                key={plan.id}
                className={`rounded-2xl border p-5 flex flex-col relative ${plan.highlighted ? "border-brand-500/50 bg-gradient-to-b from-brand-900/30 to-surface-800 shadow-xl shadow-brand-900/20" : "border-white/[0.06] bg-surface-800"}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-bold">
                    Most Popular
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="font-bold text-white text-lg">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-extrabold text-white">${plan.price}</span>
                    {plan.price > 0 && <span className="text-slate-500 text-sm">/month</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{plan.description}</p>
                </div>
                <ul className="space-y-2 flex-1 mb-5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-brand-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                  {plan.limitations.map(l => (
                    <li key={l} className="flex items-start gap-2 text-xs text-slate-600">
                      <X className="w-3.5 h-3.5 text-slate-700 flex-shrink-0 mt-0.5" />
                      {l}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.price === 0 ? "/dashboard" : `/checkout?tier=${plan.id}`}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold text-center transition-all ${plan.highlighted ? "bg-brand-500 hover:bg-brand-600 text-white" : "bg-surface-600 hover:bg-surface-500 text-slate-200"}`}
                >
                  {plan.price === 0 ? "Start Free" : `Get ${plan.name}`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/[0.06] text-center text-xs text-slate-600">
        <p>© 2026 TradeSig. Trading signals are for informational purposes only. Not financial advice.</p>
        <p className="mt-1">All investments involve risk. Past performance does not guarantee future results.</p>
      </footer>
    </div>
  );
}
