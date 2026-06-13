import type { AssetClass } from "@/types";

// ============================================================
// Real-time market data using FREE APIs
// - Crypto: CoinGecko (no API key required)
// - Stocks/Forex/Metals: Alpha Vantage (free key, 25 req/day)
//   Falls back gracefully when rate-limited.
// ============================================================

export interface LivePrice {
  symbol: string;
  price: number;
  change: number;        // absolute change
  changePercent: number; // percent change
  high?: number;
  low?: number;
  source: string;
  stale?: boolean;
}

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY || "demo";

// Map our display symbols to CoinGecko coin IDs
const COINGECKO_IDS: Record<string, string> = {
  "BTC": "bitcoin",
  "BTC/USD": "bitcoin",
  "ETH": "ethereum",
  "ETH/USD": "ethereum",
  "SOL": "solana",
  "SOL/USD": "solana",
  "BNB": "binancecoin",
  "XRP": "ripple",
  "ADA": "cardano",
  "DOGE": "dogecoin",
};

// ---------- CRYPTO (CoinGecko — free, no key) ----------
export async function getCryptoPrice(symbol: string): Promise<LivePrice | null> {
  const id = COINGECKO_IDS[symbol.toUpperCase()];
  if (!id) return null;

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`,
      { next: { revalidate: 60 } } // cache 60s
    );
    if (!res.ok) return null;
    const data = await res.json();
    const coin = data[id];
    if (!coin) return null;

    const price = coin.usd;
    const changePercent = coin.usd_24h_change ?? 0;
    const change = price * (changePercent / 100);

    return {
      symbol,
      price,
      change,
      changePercent,
      source: "CoinGecko",
    };
  } catch {
    return null;
  }
}

// ---------- STOCKS (Alpha Vantage — free key) ----------
export async function getStockPrice(symbol: string): Promise<LivePrice | null> {
  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`,
      { next: { revalidate: 300 } } // cache 5 min (rate limits)
    );
    if (!res.ok) return null;
    const data = await res.json();
    const quote = data["Global Quote"];
    if (!quote || !quote["05. price"]) return null;

    return {
      symbol,
      price: parseFloat(quote["05. price"]),
      change: parseFloat(quote["09. change"] ?? "0"),
      changePercent: parseFloat((quote["10. change percent"] ?? "0").replace("%", "")),
      high: parseFloat(quote["03. high"] ?? "0"),
      low: parseFloat(quote["04. low"] ?? "0"),
      source: "Alpha Vantage",
    };
  } catch {
    return null;
  }
}

// ---------- FOREX (Alpha Vantage — free key) ----------
export async function getForexPrice(from: string, to: string): Promise<LivePrice | null> {
  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${ALPHA_VANTAGE_KEY}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const rate = data["Realtime Currency Exchange Rate"];
    if (!rate) return null;

    const price = parseFloat(rate["5. Exchange Rate"]);
    return {
      symbol: `${from}/${to}`,
      price,
      change: 0,
      changePercent: 0,
      source: "Alpha Vantage",
    };
  } catch {
    return null;
  }
}

// ---------- METALS (Alpha Vantage forex — XAU/XAG) ----------
export async function getMetalPrice(metal: "XAU" | "XAG"): Promise<LivePrice | null> {
  return getForexPrice(metal, "USD");
}

// ---------- Unified resolver ----------
export async function getLivePrice(symbol: string, assetClass: AssetClass): Promise<LivePrice | null> {
  switch (assetClass) {
    case "crypto":
      return getCryptoPrice(symbol);
    case "stocks":
      return getStockPrice(symbol);
    case "forex": {
      const [from, to] = symbol.split("/");
      return getForexPrice(from, to);
    }
    case "metals": {
      const metal = symbol.startsWith("XAU") ? "XAU" : "XAG";
      return getMetalPrice(metal);
    }
    default:
      return null;
  }
}

// ---------- Batch fetch for tickers (crypto only — instant & free) ----------
export async function getCryptoPrices(symbols: string[]): Promise<LivePrice[]> {
  const ids = symbols
    .map(s => COINGECKO_IDS[s.toUpperCase()])
    .filter(Boolean)
    .join(",");
  if (!ids) return [];

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();

    return symbols
      .map(symbol => {
        const id = COINGECKO_IDS[symbol.toUpperCase()];
        const coin = id ? data[id] : null;
        if (!coin) return null;
        const price = coin.usd;
        const changePercent = coin.usd_24h_change ?? 0;
        return {
          symbol,
          price,
          change: price * (changePercent / 100),
          changePercent,
          source: "CoinGecko",
        } as LivePrice;
      })
      .filter((p): p is LivePrice => p !== null);
  } catch {
    return [];
  }
}
