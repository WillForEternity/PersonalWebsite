/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        flickerIntense: {
          '0%, 100%': { opacity: 1 },
          '25%': { opacity: 0.5 },
          '50%': { opacity: 0.1 },
          '75%': { opacity: 0.5 },
        },
      },
      animation: {
        flicker: 'flicker 3s ease-in-out infinite',
        'flicker-intense': 'flickerIntense 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

