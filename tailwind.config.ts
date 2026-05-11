import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        uconn: "#000E2F",
        husky: "#0072CE",
        ice: "#E8F3FF",
      },
      fontFamily: {
        sans: ["Inter", "Arial", "Helvetica", "system-ui", "sans-serif"],
      },
      boxShadow: {
        speed: "0 22px 60px rgba(0, 14, 47, 0.13)",
      },
    },
  },
  plugins: [],
};

export default config;
