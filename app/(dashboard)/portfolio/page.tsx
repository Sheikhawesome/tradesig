"use client";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Lock } from "lucide-react";
import type { TierName } from "@/types";
import Link from "next/link";

const USER_TIER: TierName = "free";

export default function PortfolioPage() {
  if (USER_TIER !== "elite") {
    return (
      <div className="p-4 lg:p-6 animate-fade-in">
        <TopBar title="Portfolio" userTier={USER_TIER} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md text-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-900/30 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Elite Feature</h2>
            <p className="text-slate-400 text-sm">Portfolio tracking, P&L analysis, and trade history are available on the Elite plan.</p>
            <Link href="/pricing">
              <Button className="w-full">Upgrade to Elite</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 animate-fade-in">
      <TopBar title="Portfolio" userTier={USER_TIER} />
      <p className="text-slate-400">Portfolio tracker coming soon.</p>
    </div>
  );
}
