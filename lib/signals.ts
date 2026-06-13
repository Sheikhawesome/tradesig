import type { Signal, AssetClass, SignalDirection } from "@/types";

// Mock signal data — replace with real API calls in production
// Win rates based on research: RSI+MACD+EMA confluence = ~65-72% win rate
// Adding fundamental filters brings it to ~68-75%

const MOCK_SIGNALS: Signal[] = [
  {
    id: "sig-001",
    symbol: "AAPL",
    name: "Apple Inc.",
    assetClass: "stocks",
    direction: "BUY",
    entryPrice: 189.50,
    targetPrice: 198.00,
    stopLoss: 185.20,
    confidence: 78,
    riskReward: 2.0,
    timeframe: "4h",
    technicalScore: 82,
    fundamentalScore: 74,
    summary: "Strong bullish momentum. RSI recovering from oversold, MACD bullish crossover, price above 20/50 EMA.",
    reasoning: "Technical confluence: RSI at 42 (recovering), MACD bullish cross on 4h, price bouncing off 200 EMA support. Fundamentals: Recent earnings beat +4%, strong services revenue growth. Institutional accumulation detected via volume analysis.",
    tier: "free",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
    winRate: 71,
  },
  {
    id: "sig-002",
    symbol: "BTC/USD",
    name: "Bitcoin",
    assetClass: "crypto",
    direction: "BUY",
    entryPrice: 62450,
    targetPrice: 68000,
    stopLoss: 59800,
    confidence: 72,
    riskReward: 2.1,
    timeframe: "1d",
    technicalScore: 76,
    fundamentalScore: 68,
    summary: "Bullish structure intact above key $60K support. On-chain metrics positive.",
    reasoning: "Price holding above 200-day MA. Stochastic RSI oversold on daily. On-chain: exchange outflows increasing (accumulation signal). Macro: Fed dovish pivot narrative supporting risk assets.",
    tier: "free",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
    winRate: 68,
  },
  {
    id: "sig-003",
    symbol: "EUR/USD",
    name: "Euro / US Dollar",
    assetClass: "forex",
    direction: "SELL",
    entryPrice: 1.0842,
    targetPrice: 1.0720,
    stopLoss: 1.0900,
    confidence: 74,
    riskReward: 2.1,
    timeframe: "4h",
    technicalScore: 79,
    fundamentalScore: 70,
    summary: "Bearish reversal at key resistance. Dollar strength on stronger NFP data.",
    reasoning: "Rejected at 1.0880 resistance (weekly pivot). RSI showing bearish divergence. MACD histogram declining. Fundamental: US NFP beat expectations, ECB dovish comments from Lagarde. DXY strengthening.",
    tier: "pro",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 23.5 * 60 * 60 * 1000).toISOString(),
    winRate: 69,
  },
  {
    id: "sig-004",
    symbol: "XAU/USD",
    name: "Gold",
    assetClass: "metals",
    direction: "BUY",
    entryPrice: 2318,
    targetPrice: 2380,
    stopLoss: 2290,
    confidence: 81,
    riskReward: 2.2,
    timeframe: "1d",
    technicalScore: 85,
    fundamentalScore: 77,
    summary: "Gold breaking to new highs. Safe haven demand + geopolitical risk premium.",
    reasoning: "Breakout above $2,300 resistance with strong volume. Weekly uptrend intact. RSI at 62 (not overbought). Fundamentals: Geopolitical tensions elevated, central bank gold buying at record levels, real yields declining. Seasonally strong period.",
    tier: "pro",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
    winRate: 73,
  },
  {
    id: "sig-005",
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    assetClass: "stocks",
    direction: "HOLD",
    entryPrice: 128.40,
    targetPrice: 145.00,
    stopLoss: 118.00,
    confidence: 61,
    riskReward: 1.6,
    timeframe: "1w",
    technicalScore: 65,
    fundamentalScore: 88,
    summary: "Strong fundamentals but technically extended. Wait for pullback to add.",
    reasoning: "RSI at 74 (overbought on weekly). Price 18% above 50-week EMA — historically this leads to consolidation. Fundamentals exceptional: AI data center revenue +400% YoY. Hold existing positions, do not add at current levels. Watch $118-122 for re-entry.",
    tier: "elite",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    winRate: 64,
  },
  {
    id: "sig-006",
    symbol: "ETH/USD",
    name: "Ethereum",
    assetClass: "crypto",
    direction: "BUY",
    entryPrice: 3120,
    targetPrice: 3600,
    stopLoss: 2950,
    confidence: 70,
    riskReward: 2.8,
    timeframe: "4h",
    technicalScore: 73,
    fundamentalScore: 65,
    summary: "ETH breaking out of 3-week consolidation with rising volume.",
    reasoning: "Ascending triangle breakout on 4h. Volume 2.3x average. RSI 58 — room to run. EIP-4844 (Dencun) reducing L2 fees driving on-chain activity. ETH/BTC ratio stabilizing suggesting alt season rotation.",
    tier: "pro",
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
    winRate: 67,
  },
];

export async function getSignals(tier: string, assetClass?: AssetClass): Promise<Signal[]> {
  await new Promise(r => setTimeout(r, 400)); // simulate network

  const tierOrder = { free: 0, pro: 1, elite: 2 };
  const userTierLevel = tierOrder[tier as keyof typeof tierOrder] ?? 0;

  let signals = MOCK_SIGNALS.filter(s => {
    const signalTierLevel = tierOrder[s.tier];
    return signalTierLevel <= userTierLevel;
  });

  if (assetClass) {
    signals = signals.filter(s => s.assetClass === assetClass);
  }

  return signals.sort((a, b) => b.confidence - a.confidence);
}

export async function getSignalById(id: string): Promise<Signal | null> {
  await new Promise(r => setTimeout(r, 200));
  return MOCK_SIGNALS.find(s => s.id === id) ?? null;
}

// Map our display symbols to TradingView ticker format
export function toTradingViewSymbol(symbol: string, assetClass: AssetClass): string {
  const map: Record<string, string> = {
    "AAPL": "NASDAQ:AAPL",
    "NVDA": "NASDAQ:NVDA",
    "BTC/USD": "BITSTAMP:BTCUSD",
    "ETH/USD": "BITSTAMP:ETHUSD",
    "EUR/USD": "FX_IDC:EURUSD",
    "GBP/USD": "FX_IDC:GBPUSD",
    "XAU/USD": "TVC:GOLD",
    "XAG/USD": "TVC:SILVER",
  };
  if (map[symbol]) return map[symbol];
  if (assetClass === "crypto") return `BITSTAMP:${symbol.replace("/", "")}`;
  if (assetClass === "forex") return `FX_IDC:${symbol.replace("/", "")}`;
  if (assetClass === "stocks") return `NASDAQ:${symbol}`;
  return symbol;
}

export function getSignalColor(direction: SignalDirection): string {
  return direction === "BUY" ? "#10d96a" : direction === "SELL" ? "#ec4899" : "#f59e0b";
}

export function getSignalBgClass(direction: SignalDirection): string {
  return direction === "BUY" ? "signal-buy" : direction === "SELL" ? "signal-sell" : "signal-hold";
}

export function formatPrice(price: number, symbol: string): string {
  if (symbol.includes("/")) {
    return price > 100 ? `$${price.toLocaleString()}` : price.toFixed(4);
  }
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
