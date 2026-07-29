/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#10b981",
          secondary: "#3b82f6",
          accent: "#f59e0b",
          dark: "#0a1628",
          surface: "#0f1f3a",
          card: "#1a2744",
        },
      },
    },
  },
  plugins: [],
};
