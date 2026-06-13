"use client";
import dynamic from "next/dynamic";

// Load the WebGL scene only on the client, after hydration.
const CandlestickScene = dynamic(() => import("./CandlestickScene"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

function HeroFallback() {
  // Lightweight CSS placeholder shown while the 3D scene loads
  return (
    <div className="w-full h-full flex items-end justify-center gap-1.5 pb-10 opacity-40">
      {[40, 65, 50, 80, 70, 95, 85, 110, 100, 130].map((h, i) => (
        <div
          key={i}
          className={`w-3 rounded-sm ${i % 3 === 1 ? "bg-red-500/40" : "bg-brand-500/50"} animate-pulse`}
          style={{ height: `${h}px`, animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  );
}

export function CandlestickHero({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-glow-violet bg-[#080c10] ${className}`}
      aria-hidden="true"
    >
      <CandlestickScene />
      {/* subtle top vignette for depth */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-black/30 via-transparent to-black/40" />
    </div>
  );
}
