"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/store";
import { PLANS } from "@/lib/pricing";
import { User, CreditCard, Bell, Shield, Check, Crown, Palette } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const { tier, email, name, logout, setTier } = useAuth();
  const [displayName, setDisplayName] = useState(name ?? "");
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ email: true, push: true, sms: false });

  const currentPlan = PLANS.find(p => p.id === tier);

  function saveProfile() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in max-w-3xl">
      <TopBar title="Settings" userTier={tier} userEmail={email ?? undefined} />

      {/* Profile */}
      <Section icon={<User className="w-4 h-4" />} title="Profile">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Display name</label>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full h-11 px-3 rounded-lg bg-surface-700 border border-white/[0.06] text-sm text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <input
              value={email ?? ""}
              disabled
              className="w-full h-11 px-3 rounded-lg bg-surface-900 border border-white/[0.06] text-sm text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-slate-600 mt-1">Email cannot be changed in the demo.</p>
          </div>
          <Button onClick={saveProfile} size="sm">
            {saved ? <><Check className="w-4 h-4" /> Saved</> : "Save changes"}
          </Button>
        </div>
      </Section>

      {/* Subscription */}
      <Section icon={<CreditCard className="w-4 h-4" />} title="Subscription">
        <div className="flex items-center justify-between p-4 rounded-lg bg-surface-700/50 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{currentPlan?.name} Plan</span>
              <Badge variant={tier}>{tier}</Badge>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              {currentPlan?.price === 0 ? "Free forever" : `$${currentPlan?.price}/month`}
            </p>
          </div>
          {tier !== "elite" && (
            <Link href="/pricing">
              <Button size="sm"><Crown className="w-4 h-4" /> Upgrade</Button>
            </Link>
          )}
        </div>

        {/* Demo tier switcher */}
        <div className="p-3 rounded-lg border border-dashed border-white/10">
          <p className="text-xs text-slate-500 mb-2">Demo: switch tier to preview features (replace with real billing later)</p>
          <div className="flex gap-2">
            {(["free", "pro", "elite"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${tier === t ? "bg-brand-500 text-white" : "bg-surface-600 text-slate-400 hover:text-slate-200"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Appearance */}
      <Section icon={<Palette className="w-4 h-4" />} title="Appearance">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-200">Theme</p>
            <p className="text-xs text-slate-500">Choose light or dark mode</p>
          </div>
          <ThemeToggle variant="switch" />
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={<Bell className="w-4 h-4" />} title="Notifications">
        <div className="space-y-1">
          <Toggle label="Email alerts" desc="Get new signals delivered to your inbox" checked={notifs.email} onChange={v => setNotifs(n => ({ ...n, email: v }))} />
          <Toggle label="Push notifications" desc="Real-time browser & mobile push" checked={notifs.push} onChange={v => setNotifs(n => ({ ...n, push: v }))} />
          <Toggle label="SMS alerts" desc="Elite only — priority signals via text" checked={notifs.sms} onChange={v => setNotifs(n => ({ ...n, sms: v }))} disabled={tier !== "elite"} />
        </div>
      </Section>

      {/* Security */}
      <Section icon={<Shield className="w-4 h-4" />} title="Security">
        <div className="space-y-3">
          <Button variant="secondary" size="sm">Change password</Button>
          <div className="pt-2 border-t border-white/[0.06]">
            <Button variant="danger" size="sm" onClick={handleLogout}>Log out</Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4 text-slate-300">
        <div className="w-7 h-7 rounded-lg bg-surface-700 flex items-center justify-center text-brand-400">{icon}</div>
        <h2 className="text-sm font-semibold uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </Card>
  );
}

function Toggle({ label, desc, checked, onChange, disabled }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-3 ${disabled ? "opacity-50" : ""}`}>
      <div>
        <p className="text-sm font-medium text-slate-200">{label}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-brand-500" : "bg-surface-600"} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}
