const path = require('path');

let config = require('./kwai.development');

module.exports = {
  verbose: true,
  moduleDirectories: [ 'node_modules', 'src'],
  moduleNameMapper: {
    '^@/(.*)$': path.join(__dirname, 'src', '$1'),
    '^config$': path.join(__dirname, 'kwai.development'),
    '^custom/(.*)$': path.join(config.custom, '$1')
  }
};
