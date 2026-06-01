/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        "bg-app": "#fafafa",
        "bg-header": "#FFCABF",
        "bg-button": "#1371C1",
        "bg-button-hover": "#1e537f",
        "text-header": "#804000",
        green_50: "#FFFFEB",
        green_100: "#9EDD8D",
        green_400: "#007000",
        orange_50: "#FFF3E0",
        orange_100: "#FFD180",
        orange_200: "#FED7AA",
        orange_300: "#FF8C02",
        orange_400: "#EA580C",
        blue: {
          hover: "#d3e0ec",
          light: "#91c6f4",
          DEFAULT: "#2c95ed",
          dark: "#1c70bc",
        },
      },
    },
  },
  plugins: [],
};
