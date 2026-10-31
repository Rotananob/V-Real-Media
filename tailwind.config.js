/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#FAFAFA',
          secondary: '#FFFFFF',
          tertiary: '#F4F4F5',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#F9FAFB',
          hover: '#F4F4F5',
        },
        accent: {
          red: '#D90429',
          darkRed: '#BA181B',
          softRed: '#FFF1F2',
        },
        content: {
          primary: '#09090B',
          secondary: '#52525B',
          muted: '#71717A',
        },
        border: {
          DEFAULT: '#E4E4E7',
          subtle: '#F4F4F5',
          strong: '#D4D4D8',
        },
      },
      fontFamily: {
        khmer: ['"Kantumruy Pro"', 'Inter', 'sans-serif'],
        'khmer-display': ['"Koulen"', '"Manrope"', 'sans-serif'],
        sans: ['Inter', '"Kantumruy Pro"', 'sans-serif'],
        display: ['"Space Grotesk"', '"Koulen"', 'sans-serif'],
        heading: ['Manrope', '"Kantumruy Pro"', 'sans-serif'],
      },
      boxShadow: {
        'human-card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'human-card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'subtle-elevation': '0 4px 12px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
