/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#050505',
          secondary: '#0A0A0A',
        },
        surface: {
          DEFAULT: '#111111',
          elevated: '#1A1A1A',
        },
        accent: {
          red: '#FF3030',
          darkRed: '#C90000',
        },
        content: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          muted: '#71717A',
        },
        border: {
          DEFAULT: '#27272A',
          subtle: '#3F3F46',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        heading: ['Manrope', 'sans-serif'],
      },
      animation: {
        'rec-pulse': 'recPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'subtle-pulse': 'subtlePulse 3s infinite ease-in-out',
      },
      keyframes: {
        recPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.2', transform: 'scale(0.95)' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '0.4' },
        },
      },
      boxShadow: {
        'rec-glow': '0 0 20px -3px rgba(255, 48, 48, 0.4)',
        'surface-card': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [],
};
