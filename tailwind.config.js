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
    addIconSelectors(["mdi", "material-symbols", "twemoji", "fa6-brands"]),
    require("tailwind-scrollbar"),
    flowbite.plugin(),
  ],
  darkMode: "selector",
  theme: {
    extend: {
      animation: {
        bg_zoom: "bg_zoom 150ms linear",
        bg_zoom_rev: "bg_zoom_rev 150ms linear",
      },
      keyframes: {
        bg_zoom: {
          "0%": {
            "background-size": "100% auto",
          },
          "100%": {
            "background-size": "110% auto",
          },
        },
        bg_zoom_rev: {
          "0%": {
            "background-size": "110% auto",
          },
          "100%": {
            "background-size": "100% auto",
          },
        },
      },
    },
  },
};
