/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5044e5',
      },
      scale: {
        '102': '1.02',
        '105': '1.05',
      },
      textColor: {
        '900': '#111827',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
