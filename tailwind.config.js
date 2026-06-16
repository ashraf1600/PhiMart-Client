/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fashion: {
          primary: '#1a1a1a',      // dark for text
          secondary: '#b8a28c',    // gold/beige accent
          light: '#f8f5f0',        // page background
          border: '#e5e0db',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}