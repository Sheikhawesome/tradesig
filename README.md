# TradeSig — AI-Powered Trading Signals

A full-stack Next.js SaaS app for trading signals across stocks, forex, crypto, and metals.

## Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS (dark fintech theme)
- **AI Agent:** Claude claude-sonnet-4-6 via Anthropic SDK
- **Charts:** TradingView embedded widgets (free, no API key)
- **Payments:** Stripe Subscriptions
- **Market Data:** Alpha Vantage (free tier) + TradingView widgets

## Setup

### 1. Install Node.js

Download from https://nodejs.org (v20+ recommended)

### 2. Install dependencies

```bash
cd tradesig
npm install
```

### 3. Configure environment variables

Edit `.env.local`:

```env
ANTHROPIC_API_KEY=your_key      # https://console.anthropic.com
STRIPE_SECRET_KEY=sk_test_...   # https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...   # Create in Stripe dashboard
STRIPE_ELITE_PRICE_ID=price_...
NEXTAUTH_SECRET=any_random_string
```

### 4. Run

```bash
npm run dev
# Open http://localhost:3000
```

## Architecture

```
app/
├── page.tsx                    # Landing page
├── pricing/page.tsx            # Pricing page
├── (dashboard)/
│   ├── layout.tsx              # Sidebar + ticker bar wrapper
│   ├── dashboard/page.tsx      # Main dashboard with signal cards
│   ├── signals/page.tsx        # Full signals list with filters
│   ├── chart/page.tsx          # TradingView chart page
│   ├── portfolio/page.tsx      # Portfolio tracker (Elite)
│   └── ai-chat/page.tsx        # AI agent chat (Elite)
├── api/
│   ├── signals/route.ts        # Signal data API
│   ├── ai-analysis/route.ts    # Claude AI analysis
│   └── stripe/checkout/        # Stripe checkout session
```

## Tier System

| Feature | Free | Pro ($29) | Elite ($79) |
|---------|------|-----------|-------------|
| Signals/day | 3 | 20 | Unlimited |
| Asset classes | Stocks, Crypto | All | All |
| Entry/Target/Stop | — | ✓ | ✓ |
| Fundamental analysis | — | ✓ | ✓ |
| AI Chat Agent | — | — | ✓ |
| Portfolio tracker | — | — | ✓ |

## AI Analysis Strategy

Signals are generated using a dual-analysis approach targeting **68-75% win rate**:

**Technical (55% weight):**
- RSI(14) — momentum and overbought/oversold
- MACD(12,26,9) — trend direction and momentum
- EMA 20/50 — trend filter
- Bollinger Bands — volatility and breakouts
- Volume confirmation

**Fundamental (45% weight):**
- Stocks: earnings, revenue, sector momentum
- Crypto: on-chain metrics, network activity
- Forex: interest rate differentials, economic data
- Metals: inflation, real yields, geopolitical risk

**Signal rules:**
- Only issue BUY/SELL at confidence ≥ 65%
- Minimum R/R ratio 1.5:1 (prefer 2:1+)
- HOLD when signals are mixed

## Future Mobile App

The architecture is designed for mobile parity:
- All business logic lives in `lib/` (reusable)
- API routes are the contract between web and any future mobile app
- Consider Expo (React Native) for mobile — shares TypeScript types and API layer
# tradesig
# tradesig
