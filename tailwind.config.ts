import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af"
        },
        neural: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          500: "#7c3aed",
          600: "#6d28d9"
        },
        mint: {
          100: "#ccfbf1",
          600: "#0d9488"
        }
      },
      boxShadow: {
        soft: "0 12px 28px rgba(15, 23, 42, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
