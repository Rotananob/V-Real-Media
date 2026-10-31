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
          primary: '#080808',
          secondary: '#101010',
        },
        surface: {
          DEFAULT: '#141414',
          elevated: '#1D1D1D',
          hover: '#242424',
        },
        accent: {
          red: '#E5383B',
          darkRed: '#BA181B',
          warmAmber: '#E0A96D',
        },
        content: {
          primary: '#FDFDFD',
          secondary: '#A8A8A8',
          muted: '#737373',
        },
        border: {
          DEFAULT: '#262626',
          subtle: '#383838',
        },
      },
      fontFamily: {
        khmer: ['"Kantumruy Pro"', 'Inter', 'sans-serif'],
        'khmer-display': ['"Koulen"', '"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', '"Kantumruy Pro"', 'sans-serif'],
        display: ['"Space Grotesk"', '"Koulen"', 'sans-serif'],
        heading: ['Manrope', '"Kantumruy Pro"', 'sans-serif'],
      },
      animation: {
        'rec-pulse': 'recPulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'subtle-pulse': 'subtlePulse 3s infinite ease-in-out',
      },
      keyframes: {
        recPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.25', transform: 'scale(0.92)' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '0.4' },
        },
      },
      boxShadow: {
        'rec-glow': '0 0 25px -2px rgba(229, 56, 59, 0.45)',
        'surface-card': '0 12px 35px -12px rgba(0, 0, 0, 0.85)',
        'human-card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
};
