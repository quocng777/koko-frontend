/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(0 0 0 / var(--tw-bg-opacity))',
          foreground: 'rgb(255 255 255)'
        },
        background: {
          DEFAULT: 'rgb(241 245 249)',
          hover: '#e2e8f0',
          active: '#cbd5e1'
        },
      }
    },
    keyframes: {
      blink: {
        '50%': {
          opacity: 1
        }
      }
    },
    animation: {
      'typing': 'blink 1s infinite'
    }
  },
  plugins: [],
}

