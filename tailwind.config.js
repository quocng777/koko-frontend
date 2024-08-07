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
          DEFAULT: 'rgb(241 245 249)'
        }
      }
    },
  },
  plugins: [],
}

