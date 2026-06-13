"use client";
import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle({ variant = "switch" }: { variant?: "switch" | "icon" }) {
  const { theme, toggle, init } = useTheme();

  useEffect(() => { init(); }, [init]);

  if (variant === "icon") {
    return (
      <button
        onClick={toggle}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-surface-700 transition-colors"
      >
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-700 w-fit">
      <button
        onClick={() => theme !== "dark" && toggle()}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${theme === "dark" ? "bg-surface-500 text-white" : "text-slate-400 hover:text-slate-200"}`}
        aria-pressed={theme === "dark"}
      >
        <Moon className="w-3.5 h-3.5" /> Dark
      </button>
      <button
        onClick={() => theme !== "light" && toggle()}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${theme === "light" ? "bg-surface-500 text-white" : "text-slate-400 hover:text-slate-200"}`}
        aria-pressed={theme === "light"}
      >
        <Sun className="w-3.5 h-3.5" /> Light
      </button>
    </div>
  );
}
