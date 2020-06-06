const path = require('path');

module.exports = {
  verbose: true,
  moduleDirectories: [ 'node_modules', 'src'],
  moduleNameMapper: {
    '^@/(.*)$': path.join(__dirname, 'src', '$1'),
    '^config$': path.join(__dirname, 'src', 'site', 'config', 'development'),
    '^custom/(.*)$': path.join(__dirname, 'custom', '$1')
  }
};
