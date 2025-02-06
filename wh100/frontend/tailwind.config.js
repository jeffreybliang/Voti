/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js, jsx, ts, tsx}"],
  theme: {
    extend: {
      colors: {
        darkorange: '#dc4c45',
      },
    },
  },
 plugins: [
    require('daisyui'),
    require('tailwind-hamburgers'),
  ],
  daisyui: {
    themes: false,
    prefix: "dui-",
 },
}
