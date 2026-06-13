import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { AGENT_PERSONA } from "@/lib/agent";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Best-practice strategy parameters based on research:
// - RSI(14) for momentum: oversold <30 = buy zone, overbought >70 = sell zone
// - MACD(12,26,9) for trend: signal line cross for direction
// - EMA20/EMA50 for trend filter: price above both = bullish bias
// - ATR for stop placement: 1.5x ATR below entry
// - Risk/Reward minimum 1.5:1 (ideally 2:1+) — research shows this is the key to profitability
// Historical win rate target: 65-72% with these combined filters

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symbol, assetClass, timeframe, currentPrice, userTier } = body;

    if (!symbol || !currentPrice) {
      return NextResponse.json({ error: "symbol and currentPrice required" }, { status: 400 });
    }

    // Only elite tier gets full AI chat analysis
    if (userTier === "free") {
      return NextResponse.json({ error: "Upgrade to Pro or Elite for AI analysis" }, { status: 403 });
    }

    const prompt = `${AGENT_PERSONA}

Analyze the following asset and provide a structured trading signal.

Asset: ${symbol} (${assetClass})
Current Price: $${currentPrice}
Timeframe: ${timeframe}

Apply these proven high-win-rate strategies:
1. TECHNICAL (weight 55%):
   - RSI(14): <30 strong buy, 30-45 buy, 45-55 neutral, 55-70 sell, >70 strong sell
   - MACD(12,26,9): signal line crossover direction
   - EMA confluence: price vs 20 EMA vs 50 EMA
   - Volume confirmation (volume should confirm price move)
   - Bollinger Band position and squeeze
   - Support/resistance levels

2. FUNDAMENTAL (weight 45%):
   - For stocks: recent earnings, revenue growth, sector momentum
   - For crypto: on-chain metrics, network activity, narrative
   - For forex: interest rate differentials, economic data, central bank stance
   - For metals: inflation expectations, real yields, geopolitical risk, demand/supply
   - Market sentiment and news flow

CRITICAL RULES for high win rate:
- Only issue BUY/SELL when confidence ≥ 65%
- Minimum Risk/Reward ratio of 1.5:1 (prefer 2:1+)
- Stop loss must be placed at technical invalidation point
- Use ATR-based stops (1.5-2x ATR)
- Issue HOLD when signals are mixed or confidence is low

Respond ONLY with valid JSON in this exact format:
{
  "technicalAnalysis": {
    "trend": "bullish|bearish|neutral",
    "indicators": {
      "rsi": <number 0-100>,
      "macd": "bullish|bearish|neutral",
      "ema20vsEma50": "above|below|crossing",
      "bollingerBand": "upper|lower|middle",
      "volumeTrend": "increasing|decreasing|neutral"
    },
    "score": <number 0-100>,
    "summary": "<2-3 sentence technical summary>"
  },
  "fundamentalAnalysis": {
    "sentiment": "positive|negative|neutral",
    "newsScore": <number 0-100>,
    "economicFactors": ["<factor1>", "<factor2>", "<factor3>"],
    "score": <number 0-100>,
    "summary": "<2-3 sentence fundamental summary>"
  },
  "finalSignal": "BUY|SELL|HOLD",
  "confidence": <number 0-100>,
  "entryZone": { "low": <number>, "high": <number> },
  "targets": [<target1>, <target2>],
  "stopLoss": <number>,
  "riskReward": <number>,
  "analysis": "<comprehensive 4-6 sentence analysis in Hamilton's professional, measured voice, combining technical and fundamental reasoning, written in first person as Hamilton>"
}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON in response");
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ success: true, analysis, symbol });
  } catch (err) {
    console.error("AI analysis error:", err);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
