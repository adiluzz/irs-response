import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        'tac-navy': '#111827', // var(--gray-900)
        'tac-navy-light': '#1f2937', // var(--gray-800)
        'tac-text-primary': '#111827', // var(--gray-900)
        'tac-text-secondary': '#6b7280', // var(--gray-500)
        'tac-border': '#d1d5db', // var(--gray-300)
      },
    },
  },
  plugins: [],
};

export default config;
