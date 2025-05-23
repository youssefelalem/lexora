/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'almarai': ['Almarai', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#c2d9ff',
          300: '#9bb7f0',
          400: '#7493e0',
          500: '#4a6dd6',
          600: '#304fc1',
          700: '#2441a8',
          800: '#1E3A8A', // اللون الأزرق الداكن الرئيسي
          900: '#162a60',
          950: '#0e1c40',
        },        secondary: {
          50: '#fdf8f1',
          100: '#f9ecd9',
          200: '#f3dbb0',
          300: '#ecc987',
          400: '#e5b660',
          500: '#D4A76A', // اللون الذهبي/البني الفاتح
          600: '#b68443',
          700: '#95673a',
          800: '#734a31',
          900: '#523728',
          950: '#1a1d20',
        },
        accent: {
          50: '#fff1f0',
          100: '#ffe6e4',
          200: '#fecec8',
          300: '#fda99f',
          400: '#fb7c6b',
          500: '#f65a45',
          600: '#e53525',
          700: '#c1261a',
          800: '#a02319',
          900: '#83231a',
          950: '#470e0a',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        warning: {
          50: '#fffbea',
          100: '#fff6d5',
          200: '#ffeba6',
          300: '#ffd86b',
          400: '#ffc133',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Menlo', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
        '4.5': '1.125rem',
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
        '112': '28rem',
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '192': '48rem',
      },
      borderRadius: {
        'none': '0',
        'xs': '0.125rem',
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      boxShadow: {
        'xs': '0 0 0 1px rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'default': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'outline': '0 0 0 3px rgba(66, 153, 225, 0.5)',
        'none': 'none',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      zIndex: {
        '0': 0,
        '10': 10,
        '20': 20,
        '30': 30,
        '40': 40,
        '50': 50,
        '60': 60,
        '70': 70,
        '80': 80,
        '90': 90,
        '100': 100,
        'auto': 'auto',
      },
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      gridTemplateColumns: {
        // كشبكة سريعة التكوين
        'autofill-xs': 'repeat(auto-fill, minmax(8rem, 1fr))',
        'autofill-sm': 'repeat(auto-fill, minmax(12rem, 1fr))',
        'autofill-md': 'repeat(auto-fill, minmax(16rem, 1fr))',
        'autofill-lg': 'repeat(auto-fill, minmax(20rem, 1fr))',
        'autofill-xl': 'repeat(auto-fill, minmax(24rem, 1fr))',
      },
      // إضافة تخصيصات للتطبيق القانوني
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        'print': {'raw': 'print'}, // وضع خاص للطباعة
      },
    },
  },
  plugins: [],
}
