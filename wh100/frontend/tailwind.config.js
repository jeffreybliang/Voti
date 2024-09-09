/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/frontend/**/*.html', // Include your Django template files
    './src/**/*.js', // Include your React files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

