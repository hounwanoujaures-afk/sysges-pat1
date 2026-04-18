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
        // Palette principale — Bleu Nuit Institutionnel + Or Chaud
        navy: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#1e1b4b',
          800: '#151235',
          900: '#0d0b21',
          950: '#07060f',
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
          800: '#92400e',
          900: '#78350f',
        },
        surface: {
          DEFAULT: '#0f0e1a',
          card:    '#16152a',
          border:  '#2a2845',
          muted:   '#1e1d33',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh':   'radial-gradient(ellipse at top, #1e1b4b 0%, #07060f 70%)',
        'gold-shine':      'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)',
      },
      boxShadow: {
        'card':      '0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset',
        'glow-gold': '0 0 20px rgba(251,191,36,0.15)',
        'glow-blue': '0 0 30px rgba(99,102,241,0.2)',
      },
      animation: {
        'fade-in':      'fadeIn 0.6s ease forwards',
        'slide-up':     'slideUp 0.5s ease forwards',
        'pulse-slow':   'pulse 3s infinite',
        'shimmer':      'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: 0 },                    '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
