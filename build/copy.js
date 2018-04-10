let customConfig = {};
try {
  customConfig = require('./../config/copy.js');
} catch (e) {}

// this is a custom dictionary to make it easy to extend/override
// provide a name for an entry, it can be anything such as 'copyAssets' or 'copyFonts'
// then provide an object with a `src` array of globs and a `dest` string
module.exports = Object.assign({
  copyAssets: {
    src: ['{{ROOT}}/config/assets/**/*'],
    dest: '{{WWW}}/assets'
  },
  copyIndexContent: {
    src: ['{{ROOT}}/config/index.html', '{{ROOT}}/config/manifest.json', /* '{{SRC}}/service-worker.js' */],
    dest: '{{WWW}}'
  },
  copyFonts: {
    src: ['{{ROOT}}/node_modules/ionicons/dist/fonts/**/*', '{{ROOT}}/node_modules/ionic-angular/fonts/**/*'],
    dest: '{{WWW}}/assets/fonts'
  },
  copyPolyfills: {
    src: ['{{ROOT}}/node_modules/ionic-angular/polyfills/polyfills.js'],
    dest: '{{BUILD}}'
  },
  // copySwToolbox: {
  //   src: ['{{ROOT}}/node_modules/sw-toolbox/sw-toolbox.js'],
  //   dest: '{{BUILD}}'
  // }
}, customConfig);

