"use client";
import { useEffect, useRef } from "react";

interface TradingViewChartProps {
  symbol?: string;
  theme?: "dark" | "light";
  interval?: string;
  height?: number;
}

// TradingView widget — free, no API key needed
// Supports all instruments: stocks, forex, crypto, metals, indices
export function TradingViewChart({
  symbol = "NASDAQ:AAPL",
  theme = "dark",
  interval = "D",
  height = 500,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval,
      timezone: "Etc/UTC",
      theme,
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
      studies: [
        "STD;RSI",
        "STD;MACD",
        "STD;Bollinger_Bands",
        "STD;EMA",
      ],
      show_popup_button: true,
      popup_width: "1000",
      popup_height: "650",
      withdateranges: true,
      hide_side_toolbar: false,
      details: true,
      hotlist: true,
      news: ["headlines"],
    });

    const wrapper = document.createElement("div");
    wrapper.className = "tradingview-widget-container__widget";
    wrapper.style.height = `${height}px`;
    wrapper.style.width = "100%";

    containerRef.current.appendChild(wrapper);
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [symbol, theme, interval, height]);

  return (
    <div className="tradingview-widget-container w-full rounded-xl overflow-hidden" ref={containerRef} style={{ height }} />
  );
}
