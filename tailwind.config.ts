import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f7fd",
          100: "#b3e8fb",
          200: "#80d9f9",
          300: "#4dcaf7",
          400: "#1abcf5",
          500: "#00aef4",
          600: "#00a8f3",
          700: "#0095d9",
          800: "#0082bf",
          900: "#006fa5",
        },
      },
    },
  },
  plugins: [],
};
export default config;
