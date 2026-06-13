import { NextRequest, NextResponse } from "next/server";
import { getSignals } from "@/lib/signals";
import type { AssetClass } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tier = searchParams.get("tier") || "free";
  const assetClass = searchParams.get("assetClass") as AssetClass | undefined;

  const signals = await getSignals(tier, assetClass || undefined);
  return NextResponse.json({ signals });
}
