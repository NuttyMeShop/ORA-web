/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ora: {
          ivory: '#F6F1E8',
          teal: '#0F4C5C',
          gold: '#C9A96E',
          terracotta: '#E07A5F',
        }
      }
    },
  },
  plugins: [],
}
