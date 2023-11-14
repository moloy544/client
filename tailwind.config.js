/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        red: {
          pure: 'rgb(255, 6, 6)', // Light variant of red
        },
      },
      backgroundColor:{
        'grocerit-green': 'rgb(12, 131, 31)',
        'custome-blue-bg': 'rgb(245, 247, 253)',
      },
      fontFamily:{
        'okara-helvetica': ['Okra', 'Helvetica', 'sans'],
      },

      screens:{
        'mobile': { 'max': '767px' },
      }
    },
  },
  plugins: [],
}
