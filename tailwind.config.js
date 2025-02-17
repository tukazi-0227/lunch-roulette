/** @type {import('tailwindcss').Config} */

import * as colors from "tailwindcss/colors";

module.exports = {
  content: [
    "./app.{vue,js,ts,jsx,tsx}",
    "./components/**/*.{vue,js,ts,jsx,tsx}",
    "./layouts/**/*.{vue,js,ts,jsx,tsx}",
    "./app/pages/**/*.{vue,js,ts,jsx,tsx}",
    "./plugins/**/*.{js,ts}",
  ],
  safelist: ["bg-[#020617]", "bg-[#9CA3AF]", "bg-[#DB2777]", "bg-[#67E8F9]"],
  theme: {
    extend: {
      colors: {
        ...colors,
      },
    },
  },
  plugins: [],
};
