/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#c8a44a",
        red: {
          DEFAULT: "#cc0018",
          glow: "#ff003c",
        },
      },
      fontFamily: {
        main: ['var(--font-main)'],
        zh: ['var(--font-zh)'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
      },
    },
  },
  plugins: [],
};
