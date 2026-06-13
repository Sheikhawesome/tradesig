"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TierName } from "@/types";

interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  name: string | null;
  tier: TierName;
  // actions
  login: (email: string, name?: string) => void;
  register: (email: string, name: string) => void;
  logout: () => void;
  setTier: (tier: TierName) => void;
}

// NOTE: This is a client-side demo auth store (no backend yet).
// When you add a real backend (NextAuth + database), replace these
// actions with real API calls. The rest of the app reads from this
// store, so swapping the implementation won't require UI changes.
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      email: null,
      name: null,
      tier: "free",
      login: (email, name) =>
        set({ isAuthenticated: true, email, name: name ?? email.split("@")[0] }),
      register: (email, name) =>
        set({ isAuthenticated: true, email, name, tier: "free" }),
      logout: () =>
        set({ isAuthenticated: false, email: null, name: null, tier: "free" }),
      setTier: (tier) => set({ tier }),
    }),
    { name: "tradesig-auth" }
  )
);

// Tier comparison helper
export function tierLevel(tier: TierName): number {
  return { free: 0, pro: 1, elite: 2 }[tier];
}

export function hasTier(userTier: TierName, requiredTier: TierName): boolean {
  return tierLevel(userTier) >= tierLevel(requiredTier);
}
