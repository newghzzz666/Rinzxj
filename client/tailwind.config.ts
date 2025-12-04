/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // 1. 保持原版的暗黑模式触发逻辑，确保切换功能正常
  darkMode: ['selector', '[data-color-mode="dark"]'], 
  theme: {
    extend: {
      // 2. 注入新字体：Inter
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // 3. 融合颜色系统
      colors: {
        // --- 核心修改：将原本的粉色主题(theme)替换为新的“活力橘” ---
        'theme': '#FF4500',        // 主色：橘红
        'theme-hover': '#FF6347',  // 悬停：稍亮
        'theme-active': '#CC3700', // 点击：稍暗

        // --- 背景色升级：使用更高级的“深邃黑” ---
        'background': {
          'light': '#fafafa', // 浅色背景：极淡灰
          'dark': '#050505',  // 深色背景：Obsidian 黑 (原版是 #1c1c1e，这个更黑更高级)
        },
        
        // --- 扩展灰阶 (用于边框、次要文字) ---
        'dark': "#121212", // 次级黑
        'black': {
          DEFAULT: '#000000',
          900: '#1a1a1a',
          950: '#050505', // 用于特殊背景
        },
        'orange': {
          500: '#FF4500',
        }
      },
      // 4. 扩展动画 (新设计需要的丝滑效果)
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
      },
      // 5. 保持原版的过渡属性配置
      transitionProperty: {
        'height': 'height',
        'width': 'width',
        'spacing': 'margin, padding',
      }
    },
  },
  // 6. 必须保留这个插件，否则博客文章会没有样式
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
