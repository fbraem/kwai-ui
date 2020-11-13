const path = require('path');

let config = require('./kwai.development');

module.exports = {
  verbose: true,
  moduleFileExtensions: [
    'js',
    'vue',
  ],
  moduleDirectories: [ 'node_modules', 'src', '.' ],
  moduleNameMapper: {
    '^@/(.*)$': path.join(__dirname, 'src', '$1'),
    '^config$': path.join(__dirname, 'kwai.development'),
    '^custom/(.*)$': path.join(config.custom, '$1')
  },
  transform: {
    '.*\\.(vue)$': 'vue-jest',
    '.*\\.[t|j]sx?$': 'babel-jest'
  },
  automock: false,
  setupFiles: [
    './setupJest.js',
  ]
};
