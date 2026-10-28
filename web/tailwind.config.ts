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
          50: "#eef4fc",
          100: "#dbe7ff",
          200: "#bcd0ee",
          300: "#8fb0e8",
          400: "#5b83c4",
          500: "#4066ad",
          600: "#2c4a86",
          700: "#1d3565",
          800: "#14264c",
          900: "#101f3e",
          950: "#0d1830",
        },
        honey: {
          50: "#fff4ec",
          100: "#ffd9c2",
          200: "#ffb287",
          300: "#ff8b4d",
          400: "#ea580c",
          500: "#e65a00",
          600: "#c24e02",
          700: "#9a3d05",
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
