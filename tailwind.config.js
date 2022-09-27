/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Ubuntu', 'sans-serif'],
      serif: ['Dancing Script', 'serif'],
    },
    extend: {},
  },
  plugins: [],
}
