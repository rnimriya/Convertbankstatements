import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Neon green brand palette ───────────────────────────────────────
        brand: {
          50:  "#ecfdf6",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#00e599",  // ← Neon's signature green
          500: "#00c07d",
          600: "#009a62",
          700: "#007a4e",
          800: "#005c3a",
          900: "#003d26",
          950: "#00200f",
        },
        // ── CSS-variable-driven surface tokens (light + dark) ──────────────
        // Uses rgb(channels / alpha) so opacity modifiers like bg-surface/80 work
        background: "rgb(var(--bg) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          raised:  "rgb(var(--surface-raised) / <alpha-value>)",
        },
        "border-subtle": "rgb(var(--border-subtle) / <alpha-value>)",
      },
      // ── Box-shadow glow ────────────────────────────────────────────────
      boxShadow: {
        "glow-sm": "0 0 12px rgba(0,229,153,0.20)",
        "glow":    "0 0 24px rgba(0,229,153,0.25), 0 0 48px rgba(0,229,153,0.10)",
        "glow-lg": "0 0 40px rgba(0,229,153,0.30), 0 0 80px rgba(0,229,153,0.12)",
      },
      animation: {
        "pulse-slow":  "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse":  "glowPulse 2.5s ease-in-out infinite",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 12px rgba(0,229,153,0.20)" },
          "50%":      { boxShadow: "0 0 28px rgba(0,229,153,0.40), 0 0 56px rgba(0,229,153,0.15)" },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
