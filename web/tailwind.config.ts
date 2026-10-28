import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        zinc: colors.slate,
        brand: {
          bg: "rgb(var(--color-bg) / <alpha-value>)",
          surface: "rgb(var(--color-surface) / <alpha-value>)",
          primary: "rgb(var(--color-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-secondary) / <alpha-value>)",
          text: "rgb(var(--color-text-main) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted) / <alpha-value>)",
          border: "rgb(var(--color-border) / <alpha-value>)",
        },
        navy: "rgb(26 71 200 / <alpha-value>)",
        pine: {
          50: "#f0ffee",
          100: "#dcf2dc",
          200: "#b9e2bd",
          300: "#8ccb92",
          400: "#69c04b",
          500: "#4da336",
          600: "#357a2b",
          700: "#164234",
          800: "#072b18",
          900: "#081f17",
          950: "#04150d",
        },
        honey: {
          50: "#f0ffee",
          100: "#dcf2dc",
          200: "#b9e2bd",
          300: "#8ccb92",
          400: "#69c04b",
          500: "#4da336",
          600: "#2f7a2e",
          700: "#164234",
        },
        background: "rgb(var(--bg) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          raised:  "rgb(var(--surface-raised) / <alpha-value>)",
        },
        "border-subtle": "rgb(var(--border-subtle) / <alpha-value>)",
      },
      fontFamily: {
        sans:    ["var(--font-manrope)",   "Manrope",             "system-ui", "sans-serif"],
        display: ["var(--font-manrope)",   "Manrope",             "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "marquee": "marquee 40s linear infinite",
        "marquee-reverse": "marquee 40s linear infinite reverse",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
