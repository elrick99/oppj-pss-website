import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          DEFAULT: '#1A3A8F',
          dark: '#0F2260',
          light: '#2451B8',
          pale: 'rgba(26, 58, 143, 0.06)',
        },
        gold: {
          DEFAULT: '#D4A520',
          light: '#F0C84A',
        },
        'off-white': '#F8F7F3',
        footer: '#080F2A',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      borderRadius: {
        'pill': '999px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 16px 40px rgba(26, 58, 143, 0.15)',
        'gold': '0 8px 24px rgba(212, 165, 32, 0.45)',
        'header': '0 2px 24px rgba(26, 58, 143, 0.3)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
