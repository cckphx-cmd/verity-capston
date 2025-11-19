/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCFB',
          100: '#FAF8F3',   // Page backgrounds
          200: '#F5F1EA',   // Card backgrounds, AI messages
          300: '#E5DFD3',   // Borders
          400: '#C8B89A',   // Accents, avatar
          500: '#8B7355',   // Primary brown (buttons, links)
          600: '#7A6449',   // Hover states
          700: '#69553D',
          800: '#584631',
          900: '#1a1a1a',   // Text dark
        },
        gray: {
          400: '#4a4a4a',   // Text light
          600: '#6B6B6B',   // Text medium
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
