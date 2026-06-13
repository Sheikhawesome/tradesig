"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Zap, Mail, Lock, User, Eye, EyeOff, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuth(s => s.register);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pwChecks = {
    length: password.length >= 6,
    number: /\d/.test(password),
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) { setError("Please enter your name."); return; }
    if (!email.includes("@")) { setError("Please enter a valid email address."); return; }
    if (!pwChecks.length || !pwChecks.number) { setError("Password needs at least 6 characters and a number."); return; }
    setLoading(true);
    setTimeout(() => {
      register(email, name.trim());
      router.push("/dashboard");
    }, 600);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-900 px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-xl">TradeSig</span>
        </Link>

        <div className="rounded-2xl bg-surface-800 border border-white/[0.06] p-6 sm:p-8">
          <h1 className="text-xl font-bold text-white mb-1">Create your free account</h1>
          <p className="text-sm text-slate-500 mb-6">Start getting AI signals in seconds. No card required.</p>

          {error && (
            <div role="alert" className="mb-4 px-3 py-2 rounded-lg bg-red-900/30 border border-red-700/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="name" type="text" autoComplete="name" value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full h-11 pl-10 pr-3 rounded-lg bg-surface-700 border border-white/[0.06] text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="email" type="email" autoComplete="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-11 pl-10 pr-3 rounded-lg bg-surface-700 border border-white/[0.06] text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="password" type={showPw ? "text" : "password"} autoComplete="new-password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full h-11 pl-10 pr-10 rounded-lg bg-surface-700 border border-white/[0.06] text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="flex gap-3 mt-2">
                  <PwHint ok={pwChecks.length} label="6+ characters" />
                  <PwHint ok={pwChecks.number} label="1 number" />
                </div>
              )}
            </div>

            <Button type="submit" loading={loading} className="w-full">Create Account</Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          By creating an account you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
}

function PwHint({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`flex items-center gap-1 text-xs ${ok ? "text-brand-400" : "text-slate-600"}`}>
      <Check className="w-3 h-3" /> {label}
    </span>
  );
}
