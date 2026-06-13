export type SignalDirection = "BUY" | "SELL" | "HOLD";
export type AssetClass = "stocks" | "forex" | "crypto" | "metals";
export type TierName = "free" | "pro" | "elite";
export type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w";

export interface Signal {
  id: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  direction: SignalDirection;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  confidence: number; // 0-100
  riskReward: number;
  timeframe: Timeframe;
  technicalScore: number;  // 0-100
  fundamentalScore: number; // 0-100
  summary: string;
  reasoning: string;
  tier: TierName; // minimum tier required
  createdAt: string;
  expiresAt: string;
  winRate: number; // historical win rate for this setup
}

export interface MarketTicker {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  tier: TierName;
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: "active" | "canceled" | "past_due";
}

export interface AIAnalysis {
  symbol: string;
  technicalAnalysis: {
    trend: "bullish" | "bearish" | "neutral";
    indicators: {
      rsi: number;
      macd: "bullish" | "bearish" | "neutral";
      ema20vsEma50: "above" | "below" | "crossing";
      bollingerBand: "upper" | "lower" | "middle";
      volumeTrend: "increasing" | "decreasing" | "neutral";
    };
    score: number;
    summary: string;
  };
  fundamentalAnalysis: {
    sentiment: "positive" | "negative" | "neutral";
    newsScore: number;
    economicFactors: string[];
    score: number;
    summary: string;
  };
  finalSignal: SignalDirection;
  confidence: number;
  entryZone: { low: number; high: number };
  targets: number[];
  stopLoss: number;
  riskReward: number;
  analysis: string;
}

export interface PricingPlan {
  id: TierName;
  name: string;
  price: number;
  priceId?: string;
  description: string;
  features: string[];
  limitations: string[];
  signalsPerDay: number | "unlimited";
  highlighted?: boolean;
}
