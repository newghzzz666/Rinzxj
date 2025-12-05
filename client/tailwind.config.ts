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
        'theme-hover': '#b13049',
        'theme-active': '#972038',
        'background': {
          'light': '#f5f5f5',
          'dark': '#1c1c1e',
        },
        'dark': "#333333",
        // New UI Colors (Additive)
        'accent': {
          DEFAULT: '#ff3b61', // Slightly more vibrant than theme
          foreground: '#ffffff',
        },
        'surface': {
          light: 'rgba(255, 255, 255, 0.7)',
          dark: 'rgba(30, 30, 30, 0.7)',
        }
      },
      fontFamily: {
        sans: ['Cantarell', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
      },
      transitionProperty: {
        'height': 'height',
        'width': 'width',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
