/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        optimaBlue: "#1E1E2D",
        optimaGreen: "#109856",
        optimaBlack: "#101828",
        optimaGray: "#98A2B3",
      },
      fontFamily: {
        mont: ["Montserrat", "sans-serif"],
        inter: ["Inter", "Montserrat", "sans-serif"],
        sora: ["Sora", "sans-serif"],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};


