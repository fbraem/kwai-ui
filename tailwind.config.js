const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [
    '/vagrant_custom/**/*.html',
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
  ],
  theme: {
    extend: {
      colors: {
        tatami: '#969A86',
        primary: colors.red['700'],
        primary_dark: colors.red['800'],
        primary_light: colors.red['300'],
        hero: colors.gray['700'],
        hero_dark: colors.gray['800'],
        hero_light: colors.gray['300'],
        body: colors.gray['800'],
        body_light: colors.white,
        body_dark: colors.gray['300'],
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
