/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: { DEFAULT: '#0D0D0D', 50: '#F7F7F7', 100: '#EFEFEF', 200: '#D9D9D9', 300: '#BFBFBF', 400: '#A0A0A0', 500: '#737373', 600: '#525252', 700: '#3D3D3D', 800: '#282828', 900: '#0D0D0D' },
        accent: { DEFAULT: '#1A1A2E', blue: '#2563EB', red: '#DC2626', green: '#16A34A', amber: '#D97706', purple: '#7C3AED' },
      },
      animation: { 'fade-in': 'fadeIn 0.4s ease-out', 'slide-up': 'slideUp 0.3s ease-out' },
      keyframes: { fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } }, slideUp: { '0%': { transform: 'translateY(8px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } } }
    },
  },
  plugins: [],
}


