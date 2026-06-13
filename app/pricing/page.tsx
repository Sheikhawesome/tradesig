"use client";
import { useState } from "react";
import { PLANS } from "@/lib/pricing";
import { Button } from "@/components/ui/Button";
import { Check, X, Zap } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(plan: typeof PLANS[0]) {
    if (plan.price === 0) return;
    setLoading(plan.id);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.priceId, tier: plan.id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-surface-900 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 text-slate-400 hover:text-white">
            <Zap className="w-4 h-4 text-brand-400" />
            <span className="font-bold text-white">TradeSig</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white mb-3">Choose Your Plan</h1>
          <p className="text-slate-400">Start free, upgrade when you're ready. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`rounded-2xl border p-6 flex flex-col relative ${plan.highlighted ? "border-brand-500/50 bg-gradient-to-b from-brand-900/20 to-surface-800 shadow-xl shadow-brand-900/20" : "border-white/[0.06] bg-surface-800"}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-500 text-white text-xs font-bold">
                  Most Popular
                </div>
              )}
              <div className="mb-5">
                <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-extrabold text-white">${plan.price}</span>
                  {plan.price > 0 && <span className="text-slate-500">/mo</span>}
                </div>
                <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
                <p className="text-xs text-brand-400 font-medium mt-1">
                  {plan.signalsPerDay === "unlimited" ? "Unlimited" : plan.signalsPerDay} signals/day
                </p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
                {plan.limitations.map(l => (
                  <li key={l} className="flex items-start gap-2 text-sm text-slate-600">
                    <X className="w-4 h-4 text-slate-700 flex-shrink-0 mt-0.5" />
                    {l}
                  </li>
                ))}
              </ul>

              {plan.price === 0 ? (
                <Link href="/register">
                  <Button variant="secondary" className="w-full">Start Free</Button>
                </Link>
              ) : (
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "primary" : "outline"}
                  loading={loading === plan.id}
                  onClick={() => handleCheckout(plan)}
                >
                  Get {plan.name} — ${plan.price}/mo
                </Button>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-600 mt-8">
          Payments processed securely by Stripe. Cancel anytime from your account settings.
          <br />Trading signals are for informational purposes only. Not financial advice.
        </p>
      </div>
    </div>
  );
}
