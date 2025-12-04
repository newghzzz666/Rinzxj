/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 确保深色模式由 class 控制
  theme: {
    extend: {
      // 扩展字体库
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // 将 Inter 设为默认 sans 字体
      },
      // 扩展颜色库
      colors: {
        // 您可以自定义一个 "black" 变量，方便以后统一调用
        black: {
          DEFAULT: '#000000',
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#050505', // 这里定义了您想要的高级黑
        },
        // 确保橘红色可以用
        orange: {
          500: '#FF4500', // 主橘色
        }
      },
      // 自定义动画
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
