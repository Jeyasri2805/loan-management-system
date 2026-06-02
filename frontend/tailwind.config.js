/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe6ff",
          200: "#b9ceff",
          300: "#8aaefe",
          400: "#5a85f8",
          500: "#3a64ef",
          600: "#2a4ad8",
          700: "#243daf",
          800: "#22388b",
          900: "#1f3475",
        },
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(36, 61, 175, 0.25)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
