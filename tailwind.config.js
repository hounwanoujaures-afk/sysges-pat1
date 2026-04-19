/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette institutionnelle — Vert Bénin + Or + Blanc
        green: {
          50:  '#f0faf4',
          100: '#d8f3e3',
          200: '#b4e6c9',
          300: '#7fd0a6',
          400: '#4ab57f',
          500: '#2d9b63',   // vert principal
          600: '#1e7d4e',   // vert foncé
          700: '#186040',
          800: '#154d34',
          900: '#0f3324',
          950: '#081a13',
        },
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        surface: {
          DEFAULT: '#f8faf9',
          card:    '#ffffff',
          border:  '#d1e7da',
          muted:   '#eef6f1',
          dark:    '#0f3324',
        },
        navy: {
          300: '#6b9e83',
          400: '#4a7a60',
          500: '#2d6049',
          600: '#1e4a38',
          900: '#0a2018',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh':   'radial-gradient(ellipse at top, #d8f3e3 0%, #f8faf9 70%)',
        'gold-shine':      'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)',
        'green-shine':     'linear-gradient(135deg, #2d9b63 0%, #1e7d4e 50%, #2d9b63 100%)',
      },
      boxShadow: {
        'card':       '0 2px 16px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.8) inset',
        'card-hover': '0 8px 32px rgba(45,155,99,0.12)',
        'glow-gold':  '0 0 20px rgba(251,191,36,0.2)',
        'glow-green': '0 0 30px rgba(45,155,99,0.2)',
      },
      animation: {
        'fade-in':    'fadeIn 0.6s ease forwards',
        'slide-up':   'slideUp 0.5s ease forwards',
        'pulse-slow': 'pulse 3s infinite',
        'shimmer':    'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};