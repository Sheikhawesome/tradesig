"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { MarketTickerBar } from "@/components/charts/MarketTicker";
import { useAuth } from "@/lib/store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuth(s => s.isAuthenticated);
  const tier = useAuth(s => s.tier);
  const [hydrated, setHydrated] = useState(false);

  // Wait for zustand persist to rehydrate from localStorage before deciding
  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-900">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-surface-900 relative">
      {/* faint ambient glow behind the whole app */}
      <div className="fixed inset-0 aurora-bg opacity-[0.12] pointer-events-none" />
      <Sidebar userTier={tier} />
      <div className="flex-1 flex flex-col ml-16 lg:ml-56 min-h-screen relative">
        <MarketTickerBar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
