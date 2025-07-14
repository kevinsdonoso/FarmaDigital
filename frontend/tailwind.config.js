module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#136FBC',
          light: '#60A4BF'
        },
        secondary: {
          DEFAULT: '#98BF45',
          light: '#C6D99C'
        },
        neutral: {
          DEFAULT: '#F2F2F2',
          dark: '#E0E0E0'
        }
      },
    },
  },
  plugins: [],
}