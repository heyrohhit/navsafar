
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0f6477",
          light:   "#4db8cc",
          dark:    "#0a4d5e",
          muted:   "#0f6477/20",
        },
      },
      fontFamily: {
        // Add to next/font or globals.css:
        //   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        serif: ["Playfair Display", "Georgia", "serif"],
        sans:  ["DM Sans", "system-ui", "sans-serif"],
      },
      scale: {
        108: "1.08",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #0f6477 0%, #4db8cc 100%)",
        "dark-gradient":  "linear-gradient(180deg, #060e10 0%, #0a1a1e 100%)",
      },
    },
  },
  plugins: [],
};