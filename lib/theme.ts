"use client";
import { create } from "zustand";

type Theme = "dark" | "light";

interface ThemeState {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
  init: () => void;
}

function apply(theme: Theme) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("tradesig-theme", theme); } catch {}
  }
}

export const useTheme = create<ThemeState>((set, get) => ({
  theme: "dark",
  setTheme: (t) => { apply(t); set({ theme: t }); },
  toggle: () => { const next = get().theme === "dark" ? "light" : "dark"; apply(next); set({ theme: next }); },
  init: () => {
    if (typeof window === "undefined") return;
    let stored: Theme | null = null;
    try { stored = localStorage.getItem("tradesig-theme") as Theme | null; } catch {}
    const theme = stored ?? "dark";
    apply(theme);
    set({ theme });
  },
}));
