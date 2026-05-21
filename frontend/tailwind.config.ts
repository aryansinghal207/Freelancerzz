import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary color palette
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#3f0f5c',
        },
        // Accent colors
        accent: {
          cyan: '#06b6d4',
          pink: '#f43f5e',
          violet: '#7c3aed',
        },
        // Dark theme
        dark: {
          bg: '#0f172a',
          panel: '#111827',
          card: '#1a202c',
          border: '#1f2937',
          text: '#e5e7eb',
          muted: '#9ca3af',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7c3aed, #06b6d4)',
        'gradient-accent': 'linear-gradient(135deg, #f43f5e, #7c3aed)',
        'gradient-dark': 'linear-gradient(180deg, rgba(124, 58, 237, 0.1), rgba(6, 182, 212, 0.05))',
        'gradient-glow': 'radial-gradient(circle at center, rgba(124, 58, 237, 0.2), transparent 70%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-sm': '0 0 10px rgba(124, 58, 237, 0.2)',
        'glow-lg': '0 0 30px rgba(124, 58, 237, 0.4)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} satisfies Config
