import { Sidebar } from "@/components/layout/Sidebar";
import { MarketTickerBar } from "@/components/charts/MarketTicker";
import type { TierName } from "@/types";

// In production this comes from session/auth — hardcoded to "free" for demo
const USER_TIER: TierName = "free";
const USER_EMAIL = "demo@tradesig.com";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface-900">
      <Sidebar userTier={USER_TIER} />
      <div className="flex-1 flex flex-col ml-16 lg:ml-56 min-h-screen">
        <MarketTickerBar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
