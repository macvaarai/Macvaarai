/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1e1f24",
        secondary: "#2d2f36",
      },
    },
  },
  plugins: [],
};