const { addIconSelectors } = require("@iconify/tailwind");
import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  plugins: [
    addIconSelectors(["mdi", "material-symbols", "twemoji"]),
    require('tailwind-scrollbar'),
    flowbite.plugin(),
  ],
};
