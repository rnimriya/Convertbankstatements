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
        // ── Sky-500 brand palette (Tailwind sky) ───────────────────────────
        brand: {
          50:  "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",  // ← sky-500 — primary accent
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
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
        "glow-sm": "0 0 12px rgba(14,165,233,0.30)",
        "glow":    "0 0 24px rgba(14,165,233,0.35), 0 0 48px rgba(14,165,233,0.14)",
        "glow-lg": "0 0 40px rgba(14,165,233,0.40), 0 0 80px rgba(14,165,233,0.18)",
      },
      animation: {
        "pulse-slow":  "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse":  "glowPulse 2.5s ease-in-out infinite",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 12px rgba(14,165,233,0.30)" },
          "50%":      { boxShadow: "0 0 28px rgba(14,165,233,0.50), 0 0 56px rgba(14,165,233,0.20)" },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
