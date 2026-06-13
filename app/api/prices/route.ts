import { NextRequest, NextResponse } from "next/server";
import { getLivePrice, getCryptoPrices } from "@/lib/market-data";
import type { AssetClass } from "@/types";

// GET /api/prices?symbol=BTC/USD&assetClass=crypto
// GET /api/prices?crypto=BTC,ETH,SOL   (batch crypto, free + instant)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const cryptoBatch = searchParams.get("crypto");
  if (cryptoBatch) {
    const symbols = cryptoBatch.split(",").map(s => s.trim());
    const prices = await getCryptoPrices(symbols);
    return NextResponse.json({ prices });
  }

  const symbol = searchParams.get("symbol");
  const assetClass = searchParams.get("assetClass") as AssetClass | null;

  if (!symbol || !assetClass) {
    return NextResponse.json({ error: "symbol and assetClass required" }, { status: 400 });
  }

  const price = await getLivePrice(symbol, assetClass);
  if (!price) {
    return NextResponse.json({ error: "Price unavailable (rate limited or unsupported symbol)" }, { status: 404 });
  }

  return NextResponse.json({ price });
}
