import Link from "next/link";
import { PLANS } from "@/lib/pricing";
import { LivePrices } from "@/components/charts/LivePrices";
import { CandlestickHero } from "@/components/three/CandlestickHero";
import { TiltCard } from "@/components/ui/TiltCard";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Check, X, Zap, TrendingUp, TrendingDown, Minus, Shield, BarChart2, Globe, Cpu,
  Star, Activity, ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-900 text-slate-200" data-build="vibrant-v2">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 lg:px-12 bg-surface-900/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg">TradeSig</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors hidden md:block">Features</a>
          <a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">Pricing</a>
          <a href="#faq" className="text-sm text-slate-400 hover:text-white transition-colors hidden md:block">FAQ</a>
          <ThemeToggle variant="icon" />
          <Link href="/login" className="px-4 py-2 rounded-lg bg-surface-700 text-sm font-medium text-slate-200 hover:bg-surface-600 transition-colors">Sign In</Link>
          <Link href="/register" className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-sm font-semibold text-white transition-colors">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-12 px-6 lg:px-12 text-center relative overflow-hidden">
        <div className="aurora-bg opacity-60" />
        <div className="relative max-w-4xl mx-auto">
          <div className="neon-chip inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-brand-300 text-xs font-semibold mb-6">
            <Zap className="w-3 h-3" />
            AI-Powered · Technical + Fundamental · 68-75% Win Rate
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.05] mb-5 tracking-tight">
            Trade Smarter with<br />
            <span className="text-gradient">AI Signal Intelligence</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Real-time buy, sell & hold signals for stocks, forex, crypto and metals. Our AI analyzes both technical indicators and market fundamentals to give you high-confidence trade setups.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 font-bold text-white text-base transition-all shadow-xl shadow-brand-900/40 flex items-center justify-center gap-2">
              Start Free — No Card Required <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="#pricing" className="px-8 py-3 rounded-xl border border-white/10 hover:border-white/20 font-medium text-slate-300 text-base transition-all">
              View Pricing
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-600">No credit card · Cancel anytime · 7-day Pro trial</p>
        </div>
      </section>

      {/* 3D candlestick centerpiece (WebGL) */}
      <section className="relative px-2 sm:px-6 lg:px-12 pb-8">
        <div className="relative max-w-5xl mx-auto">
          {/* glow behind the scene */}
          <div className="absolute inset-0 bg-gradient-radial from-brand-500/15 via-transparent to-transparent blur-2xl" />
          <CandlestickHero className="relative h-[320px] sm:h-[420px] lg:h-[460px] w-full" />
        </div>
      </section>

      {/* Live prices strip (REAL data from CoinGecko) */}
      <section className="px-6 lg:px-12 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs text-slate-500 font-medium">Live market prices</span>
          </div>
          <div className="flex justify-center">
            <LivePrices />
          </div>
        </div>
      </section>

      {/* Social proof stats */}
      <section className="px-6 lg:px-12 py-12 border-y border-white/[0.06] bg-surface-800/30">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <Stat value="68-75%" label="Avg Win Rate" icon={<TrendingUp className="w-5 h-5 text-brand-400" />} />
          <Stat value="2.1x" label="Avg Risk/Reward" icon={<BarChart2 className="w-5 h-5 text-brand-400" />} />
          <Stat value="12K+" label="Signals Issued" icon={<Activity className="w-5 h-5 text-brand-400" />} />
          <Stat value="4" label="Asset Classes" icon={<Globe className="w-5 h-5 text-brand-400" />} />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-white text-center mb-2">Why traders choose TradeSig</h2>
          <p className="text-slate-400 text-center mb-10">Built for serious traders who want an edge.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Cpu, title: "Dual AI Analysis", desc: "Every signal combines technical indicators (RSI, MACD, EMA, Bollinger) with fundamental analysis (news, earnings, macro) for the highest accuracy." },
              { icon: TrendingUp, title: "68-75% Win Rate", desc: "Signals are only issued when confidence ≥65% and R/R ≥1.5x. Minimum 2:1 R/R preferred. Based on backtested strategies." },
              { icon: Globe, title: "All Asset Classes", desc: "Stocks, forex, crypto, metals — all in one place. Real-time TradingView charts for every instrument." },
              { icon: BarChart2, title: "Live TradingView Charts", desc: "Embedded charts with RSI, MACD, Bollinger Bands, and EMA pre-loaded. Search any symbol in the world." },
              { icon: Shield, title: "Risk Management Built-In", desc: "Every signal includes entry, take-profit targets and stop-loss levels. Never trade without a defined risk." },
              { icon: Zap, title: "Real-Time Alerts", desc: "Get notified the moment new high-confidence signals are issued. Pro and Elite members get priority alerts." },
            ].map(f => (
              <TiltCard key={f.title} className="rounded-xl bg-surface-800 border border-white/[0.06] p-5 hover:border-brand-700/30">
                <div className="w-10 h-10 rounded-xl bg-brand-900/50 flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="font-semibold text-white mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="py-16 px-6 lg:px-12 bg-surface-800/30 border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-white text-center mb-2">See your signals at a glance</h2>
          <p className="text-slate-400 text-center mb-10">A clean dashboard built for fast decisions.</p>

          {/* Mock signal cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
            <PreviewSignal symbol="AAPL" name="Apple Inc." dir="BUY" entry="189.50" target="198.00" conf={78} win={71} />
            <PreviewSignal symbol="XAU/USD" name="Gold" dir="BUY" entry="2,318" target="2,380" conf={81} win={73} />
            <PreviewSignal symbol="EUR/USD" name="Euro / Dollar" dir="SELL" entry="1.0842" target="1.0720" conf={74} win={69} />
          </div>

          <div className="text-center mt-8">
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 font-semibold text-white transition-colors">
              Try the Live Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-white text-center mb-10">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "AI scans the markets", desc: "Our engine continuously analyzes thousands of instruments using technical + fundamental data." },
              { step: "2", title: "High-confidence signals", desc: "Only setups with ≥65% confidence and strong risk/reward make the cut. The rest are filtered out." },
              { step: "3", title: "You trade with an edge", desc: "Get clear entry, target & stop levels. Execute on your broker with confidence." },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center mx-auto mb-3 text-brand-400 font-bold text-lg">
                  {s.step}
                </div>
                <h3 className="font-semibold text-white mb-1.5">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 lg:px-12 bg-surface-800/30 border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-white text-center mb-10">Loved by traders worldwide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Marcus T.", role: "Day Trader", text: "The dual technical + fundamental approach is what sets TradeSig apart. I've stopped second-guessing my entries.", stars: 5 },
              { name: "Priya S.", role: "Swing Trader", text: "Finally, signals with actual stop-loss and target levels. The risk/reward focus has genuinely improved my consistency.", stars: 5 },
              { name: "David K.", role: "Crypto Investor", text: "Hamilton, the AI analyst on Elite, is incredible. I can ask about any coin and get a full professional breakdown in seconds.", stars: 5 },
            ].map(t => (
              <div key={t.name} className="rounded-xl bg-surface-800 border border-white/[0.06] p-5">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-xs font-bold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-white text-center mb-2">Simple, Transparent Pricing</h2>
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
                  href={plan.price === 0 ? "/register" : `/pricing`}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold text-center transition-all ${plan.highlighted ? "bg-brand-500 hover:bg-brand-600 text-white" : "bg-surface-600 hover:bg-surface-500 text-slate-200"}`}
                >
                  {plan.price === 0 ? "Start Free" : `Get ${plan.name}`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 px-6 lg:px-12 bg-surface-800/30 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-white text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: "How are the signals generated?", a: "Each signal is produced by our AI engine that combines technical analysis (RSI, MACD, EMA crossovers, Bollinger Bands, volume) with fundamental analysis (earnings, economic data, news sentiment, on-chain metrics). A signal is only issued when both align and confidence exceeds 65%." },
              { q: "What's the difference between the tiers?", a: "Free gives you 3 daily signals on stocks and crypto. Pro ($29/mo) unlocks all asset classes, all timeframes, and full entry/target/stop levels. Elite ($79/mo) adds the AI chat agent, portfolio tracking, and unlimited signals." },
              { q: "Is this financial advice?", a: "No. TradeSig provides informational trading signals based on AI analysis. All trading involves risk and you are responsible for your own decisions. Past performance does not guarantee future results." },
              { q: "Can I cancel anytime?", a: "Yes. You can cancel your subscription at any time from your account settings. You'll keep access until the end of your billing period." },
              { q: "Will there be a mobile app?", a: "Yes — a mobile app is on our roadmap. The platform is built so your account and signals will sync seamlessly across web and mobile." },
            ].map(item => (
              <details key={item.q} className="group rounded-xl bg-surface-800 border border-white/[0.06] p-4">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-white list-none">
                  {item.q}
                  <span className="text-brand-400 group-open:rotate-45 transition-transform text-lg">+</span>
                </summary>
                <p className="text-sm text-slate-400 leading-relaxed mt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 lg:px-12 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-3">Ready to trade smarter?</h2>
          <p className="text-slate-400 mb-6">Join thousands of traders using AI-powered signals. Start free, no card required.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 font-bold text-white text-base transition-all shadow-xl shadow-brand-900/40">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/[0.06] text-center text-xs text-slate-600">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-brand-500 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-400">TradeSig</span>
        </div>
        <p>© 2026 TradeSig. Trading signals are for informational purposes only. Not financial advice.</p>
        <p className="mt-1">All investments involve risk. Past performance does not guarantee future results.</p>
      </footer>
    </div>
  );
}

function Stat({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center mb-2">{icon}</div>
      <p className="text-2xl font-extrabold text-white font-mono">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

function PreviewSignal({ symbol, name, dir, entry, target, conf, win }: {
  symbol: string; name: string; dir: "BUY" | "SELL" | "HOLD"; entry: string; target: string; conf: number; win: number;
}) {
  const color = dir === "BUY" ? "#20a366" : dir === "SELL" ? "#e05252" : "#d4a017";
  const Icon = dir === "BUY" ? TrendingUp : dir === "SELL" ? TrendingDown : Minus;
  const bgClass = dir === "BUY" ? "signal-buy" : dir === "SELL" ? "signal-sell" : "signal-hold";
  return (
    <div className={`rounded-xl border border-white/[0.06] p-4 ${bgClass}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white font-mono text-sm">{symbol}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: `${color}20`, color }}>{dir}</span>
            </div>
            <p className="text-xs text-slate-500">{name}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-lg bg-surface-900/40 p-2 text-center">
          <p className="text-[10px] text-slate-500">Entry</p>
          <p className="text-xs font-bold font-mono text-slate-200">${entry}</p>
        </div>
        <div className="rounded-lg bg-surface-900/40 p-2 text-center">
          <p className="text-[10px] text-slate-500">Target</p>
          <p className="text-xs font-bold font-mono text-emerald-400">${target}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Confidence: <span className="text-slate-300 font-semibold">{conf}%</span></span>
        <span>Win: <span className="text-slate-300 font-semibold">{win}%</span></span>
      </div>
      <div className="mt-2 h-1 rounded-full bg-surface-600 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${conf}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
