let config = require('./../node_modules/@ionic/app-scripts/config/sass.config.js');
config.sourceMap = true;
config.variableSassFiles = [
  '{{SRC}}/theme/normalize.scss',
  '{{SRC}}/theme/variables.scss',
  'config/theme/variables.scss'
];

module.exports = config;
