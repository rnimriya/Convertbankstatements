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
        // ── Electric blue brand palette ────────────────────────────────────
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",  // ← primary accent — bright electric blue
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
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
        "glow-sm": "0 0 12px rgba(96,165,250,0.25)",
        "glow":    "0 0 24px rgba(96,165,250,0.30), 0 0 48px rgba(96,165,250,0.12)",
        "glow-lg": "0 0 40px rgba(96,165,250,0.35), 0 0 80px rgba(96,165,250,0.15)",
      },
      animation: {
        "pulse-slow":  "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse":  "glowPulse 2.5s ease-in-out infinite",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 12px rgba(96,165,250,0.25)" },
          "50%":      { boxShadow: "0 0 28px rgba(96,165,250,0.45), 0 0 56px rgba(96,165,250,0.18)" },
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
