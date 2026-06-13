"use client";
import { useState, useRef, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Send, Lock, Bot, User, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AGENT, AGENT_GREETING } from "@/lib/agent";
import { useAuth } from "@/lib/store";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  analysis?: {
    symbol: string;
    finalSignal: string;
    confidence: number;
  };
}

const SUGGESTED = [
  "Analyze BTC/USD on the 4h timeframe",
  "What's the signal for gold right now?",
  "Is AAPL a buy or sell today?",
  "Analyze EUR/USD for a swing trade",
];

export default function AiChatPage() {
  const tier = useAuth(s => s.tier);
  const email = useAuth(s => s.email);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: AGENT_GREETING,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text?: string) {
    const userMsg = (text ?? input).trim();
    if (!userMsg || loading || tier !== "elite") return;

    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    // Extract symbol from message
    const symbolMatch = userMsg.match(/\b([A-Z]{2,5}(?:\/[A-Z]{3})?)\b/) || userMsg.match(/\b(bitcoin|ethereum|gold|silver|apple|nvidia)\b/i);
    const symbol = symbolMatch?.[1]?.toUpperCase() || "AAPL";
    const priceMap: Record<string, number> = { AAPL: 189.50, BTC: 62450, ETH: 3120, GOLD: 2318, "EUR/USD": 1.0842, NVDA: 128.40 };
    const currentPrice = priceMap[symbol] ?? priceMap[symbol.split("/")[0]] ?? 100;

    try {
      const res = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, assetClass: "stocks", timeframe: "4h", currentPrice, userTier: tier }),
      });
      const data = await res.json();

      if (data.analysis) {
        const a = data.analysis;
        const content = `**${symbol} Analysis — ${a.finalSignal}** (${a.confidence}% confidence)\n\n**Technical** (score: ${a.technicalAnalysis.score}/100)\n${a.technicalAnalysis.summary}\n\n**Fundamental** (score: ${a.fundamentalAnalysis.score}/100)\n${a.fundamentalAnalysis.summary}\n\n**Trade Setup:**\n• Entry: $${a.entryZone.low}–$${a.entryZone.high}\n• Targets: ${a.targets.map((t: number) => `$${t}`).join(", ")}\n• Stop Loss: $${a.stopLoss}\n• R/R Ratio: ${a.riskReward}x\n\n${a.analysis}`;
        setMessages(prev => [...prev, { role: "assistant", content, analysis: { symbol, finalSignal: a.finalSignal, confidence: a.confidence } }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: data.error || "Analysis failed. Please try again." }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please check your API key and try again." }]);
    } finally {
      setLoading(false);
    }
  }

  const signalIcon = { BUY: <TrendingUp className="w-4 h-4 text-emerald-400" />, SELL: <TrendingDown className="w-4 h-4 text-red-400" />, HOLD: <Minus className="w-4 h-4 text-amber-400" /> };

  if (tier !== "elite") {
    return (
      <div className="p-4 lg:p-6 animate-fade-in">
        <TopBar title={`${AGENT.name} · AI Agent`} userTier={tier} userEmail={email ?? undefined} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md text-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-900/30 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Meet {AGENT.name} — Elite Feature</h2>
            <p className="text-slate-400 text-sm">{AGENT.name}, your AI {AGENT.title}, is available exclusively on the Elite plan. Ask {AGENT.name} to analyze any symbol in the world with a full technical + fundamental briefing.</p>
            <Link href="/pricing">
              <Button className="w-full">Upgrade to Elite — $79/mo</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-46px)] p-4 lg:p-6 gap-4 animate-fade-in">
      <TopBar title={`${AGENT.name} · AI Agent`} userTier={tier} userEmail={email ?? undefined} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "assistant" ? "bg-brand-700" : "bg-surface-600"}`}>
              {msg.role === "assistant" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-slate-300" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "assistant" ? "bg-surface-700 text-slate-200 rounded-tl-none" : "bg-brand-700 text-white rounded-tr-none"}`}>
              {msg.analysis && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                  {signalIcon[msg.analysis.finalSignal as keyof typeof signalIcon]}
                  <span className="font-bold">{msg.analysis.symbol}: {msg.analysis.finalSignal}</span>
                  <span className="text-xs text-slate-400 ml-auto">{msg.analysis.confidence}% conf.</span>
                </div>
              )}
              <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-surface-700 rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="flex gap-2 flex-wrap">
          {SUGGESTED.map(s => (
            <button key={s} onClick={() => send(s)} className="px-3 py-1.5 rounded-lg bg-surface-700 text-xs text-slate-400 hover:text-slate-200 hover:bg-surface-600 transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder={`Ask ${AGENT.name} about any stock, crypto, forex or metal...`}
          className="flex-1 px-4 py-3 rounded-xl bg-surface-700 border border-white/[0.06] text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
        />
        <Button onClick={() => send()} loading={loading} className="px-4">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
