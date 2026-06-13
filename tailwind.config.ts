import type { Config } from "tailwindcss";

// Theme-aware color: reads space-separated RGB from a CSS variable so it flips
// between light/dark via [data-theme] on <html>.
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand (vibrant neon green)
        brand: {
          50:  "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34e89e",
          500: "#10d96a",
          600: "#06b85a",
          700: "#059247",
          800: "#0a7038",
          900: "#0c5a30",
          950: "#053220",
        },
        // Vibrant accent palette (Gen-Z)
        violet:  { 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed" },
        cyan:    { 400: "#22d3ee", 500: "#06b6d4" },
        pink:    { 400: "#f472b6", 500: "#ec4899", 600: "#db2777" },
        lime:    { 400: "#a3e635", 500: "#84cc16" },
        // Theme-aware surfaces (flip per [data-theme])
        surface: {
          900: v("surface-900"),
          800: v("surface-800"),
          700: v("surface-700"),
          600: v("surface-600"),
          500: v("surface-500"),
          400: v("surface-400"),
        },
        // Theme-aware text scale (mapped onto Tailwind's slate names so existing
        // text-slate-* classes flip automatically)
        slate: {
          50:  v("slate-50"),
          100: v("slate-100"),
          200: v("slate-200"),
          300: v("slate-300"),
          400: v("slate-400"),
          500: v("slate-500"),
          600: v("slate-600"),
          700: v("slate-700"),
          800: v("slate-800"),
          900: v("slate-900"),
          950: v("slate-950"),
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        "glow-brand": "0 0 40px -8px rgba(16, 217, 106, 0.45)",
        "glow-violet": "0 0 40px -8px rgba(139, 92, 246, 0.45)",
        "glow-cyan": "0 0 40px -8px rgba(34, 211, 238, 0.45)",
        "glow-pink": "0 0 40px -8px rgba(236, 72, 153, 0.45)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "neon-green": "linear-gradient(135deg, #34e89e 0%, #10d96a 100%)",
        "neon-aurora": "linear-gradient(120deg, #10d96a 0%, #22d3ee 35%, #8b5cf6 70%, #ec4899 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "aurora": "aurora 18s ease-in-out infinite",
        "float-y": "floatY 6s ease-in-out infinite",
        "gradient-x": "gradientX 6s ease infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        aurora: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(4%, -6%) scale(1.1)" },
          "66%": { transform: "translate(-4%, 4%) scale(0.95)" },
        },
        floatY: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
