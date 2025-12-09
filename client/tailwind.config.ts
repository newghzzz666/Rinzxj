/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-color-mode="dark"]'],
  theme: {
    extend: {
      colors: {
        'theme': '#fc466b',
        'theme-hover': '#e03d5f',
        'theme-active': '#c73454',
        'theme-secondary': '#3f5efb',
        'background': {
          'light': '#f5f5f5',
          'dark': '#1c1c1e',
        },
        'dark': "#333333",
        // 玻璃拟态背景色
        'glass': {
          'light': 'rgba(255, 255, 255, 0.75)',
          'dark': 'rgba(51, 51, 51, 0.75)',
        },
        'glass-border': {
          'light': 'rgba(255, 255, 255, 0.3)',
          'dark': 'rgba(255, 255, 255, 0.1)',
        }
      },
      boxShadow: {
        'glow': '0 8px 32px rgba(252, 70, 107, 0.15)',
        'glow-lg': '0 12px 40px rgba(252, 70, 107, 0.2)',
        'soft': '0 4px 24px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 8px 32px rgba(0, 0, 0, 0.08)',
      },
      transitionProperty: {
        'height': 'height',
        'width': 'width',
        'spacing': 'margin, padding',
      },
      transitionDuration: {
        '400': '400ms',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
