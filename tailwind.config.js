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
        // navy = nuances de texte/surface sur fond vert sombre
        navy: {
          300: '#a3c9b0',
          400: '#6fa888',
          500: '#4a8a66',
          600: '#2e6b47',
          700: '#1e4a30',
          800: '#12321f',
          900: '#0a1f13',
          950: '#050f09',
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
          DEFAULT: '#f5f7f5',
          card:    '#ffffff',
          border:  '#d4e6da',
          muted:   '#eaf1ec',
          dark:    '#0c2818',
          'dark-card':   '#112e1d',
          'dark-border': '#1e4a2e',
          'dark-muted':  '#173825',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh':   'radial-gradient(ellipse at top left, #1e4a2e 0%, #0c2818 50%, #050f09 100%)',
        'gradient-light':  'linear-gradient(135deg, #f5f7f5 0%, #eaf1ec 100%)',
        'gold-shine':      'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)',
        'green-shine':     'linear-gradient(135deg, #228b57 0%, #155a3a 100%)',
      },
      boxShadow: {
        'card':        '0 1px 3px rgba(12,40,24,0.06), 0 1px 2px rgba(12,40,24,0.04)',
        'card-hover':  '0 4px 20px rgba(12,40,24,0.12)',
        'card-lg':     '0 8px 40px rgba(12,40,24,0.10)',
        'glow-gold':   '0 0 24px rgba(251,191,36,0.20)',
        'glow-green':  '0 0 24px rgba(34,139,87,0.20)',
        'sidebar':     '4px 0 24px rgba(5,15,9,0.25)',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease forwards',
        'slide-up':   'slideUp 0.4s ease forwards',
        'pulse-slow': 'pulse 3s infinite',
        'shimmer':    'shimmer 1.8s infinite',
        'spin-slow':  'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};