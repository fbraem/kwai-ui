module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
  ],
  theme: {
    extend: {
      colors: {
        tatami: '#969A86'
      }
    },
  },
  variants: [
    'responsive',
    'first',
    'last',
    'odd',
    'even',
    'hover',
    'focus',
    'active',
    'disabled',
  ],
  plugins: [
    require('tailwindcss-tables')(),
  ]
};
