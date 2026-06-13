import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TradeSig — AI-Powered Trading Signals",
  description: "Real-time buy, sell & hold signals for stocks, forex, crypto and metals. Powered by AI technical + fundamental analysis.",
  keywords: "trading signals, forex signals, crypto signals, stock signals, AI trading, technical analysis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Set theme before paint to avoid a flash of the wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('tradesig-theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen bg-surface-900 text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
