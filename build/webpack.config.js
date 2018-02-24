/*
 * The webpack config exports an object that has a valid webpack configuration
 * For each environment name. By default, there are two Ionic environments:
 * "dev" and "prod". As such, the webpack.config.js exports a dictionary object
 * with "keys" for "dev" and "prod", where the value is a valid webpack configuration
 * For details on configuring webpack, see their documentation here
 * https://webpack.js.org/configuration/
 */

var path = require('path');
var webpack = require('webpack');
var ionicWebpackFactory = require(process.env.IONIC_WEBPACK_FACTORY);
var deepExtend = require('deep-extend');
var cordovaLib = require('cordova').cordova_lib;

var PurifyPlugin = require('@angular-devkit/build-optimizer').PurifyPlugin;

var CSON = require('cson');
var defaultConfig = CSON.requireFile('./src/config.default.cson');
var configOverwrite = CSON.requireFile('./config/config.cson');

const RawConfig = deepExtend(defaultConfig, configOverwrite);

function getOptimizedProdLoaders() {
  var optimizedProdLoaders = [
    {
      test: /\.json$/,
      loader: 'json-loader'
    },
    {
      test: /\.cson$/,
      use: [
        `file-loader?name=i18n/[name].json&publicPath=i18n&outputPath=${process.env.IONIC_WWW_DIR}&useRelativePath=true`,
        'strip-module-export-loader',
        'cson-loader'
      ],
      include: path.join(__dirname, '..', 'src', 'i18n')
    },
    {
      test: /\.cson$/,
      use: 'cson-loader',
      exclude: path.join(__dirname, '..', 'src', 'i18n')
    },
    {
      test: /\.js$/,
      loader: [
        {
          loader: process.env.IONIC_CACHE_LOADER
        }
      ]
    },
    {
      test: /\.ts$/,
      loader: [
        {
          loader: process.env.IONIC_CACHE_LOADER
        },
        {
          loader: process.env.IONIC_WEBPACK_LOADER
        }
      ]
    }
  ];
  return optimizedProdLoaders;
}

function getBasicConfig() {
  var basicConfig = {
    entry: ['babel-polyfill', process.env.IONIC_APP_ENTRY_POINT],
    output: {
      path: '{{BUILD}}',
      publicPath: 'build/',
      filename: '[name].js',
      devtoolModuleFilenameTemplate: ionicWebpackFactory.getSourceMapperFunction(),
    },
    devtool: process.env.IONIC_SOURCE_MAP_TYPE,

    resolve: {
      extensions: ['.ts', '.js', '.json', '.cson'],
      modules: [path.resolve('node_modules')]
    },

    module: {
      loaders: [
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.cson$/,
          use: [
            `file-loader?name=i18n/[name].json&publicPath=i18n&outputPath=${process.env.IONIC_WWW_DIR}&useRelativePath=true`,
            'strip-module-export-loader',
            'cson-loader'
          ],
          include: path.join(__dirname, '..', 'src', 'i18n')
        },
        {
          test: /\.cson$/,
          use: 'cson-loader',
          exclude: path.join(__dirname, '..', 'src', 'i18n')
        },
        {
          test: /\.ts$/,
          loader: process.env.IONIC_WEBPACK_LOADER
        }
      ]
    },

    plugins: [
      ionicWebpackFactory.getIonicEnvironmentPlugin(),
      ionicWebpackFactory.getCommonChunksPlugin(),
      new webpack.DefinePlugin({
        __VERSION__: JSON.stringify(getAppVersion()),
        __DEV__: process.env.HYBRID_ENV === 'dev',
        __PROD__: process.env.HYBRID_ENV === 'prod',
        __SW_ENABLED__: RawConfig.serviceWorker.enabled,
        __PERMALINKS_POST__: RawConfig.permalinks.post,
        __PERMALINKS_TAG__: RawConfig.permalinks.tag,
        __PERMALINKS_CATEGORY__: RawConfig.permalinks.category,
        __PERMALINKS_AUTHOR__: RawConfig.permalinks.author,
        __CONFIG_FOLDER__: JSON.stringify(process.env.IONIC_ROOT_DIR + '/config'),
      }),
    ],

    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    }
  };
  return basicConfig;
}

function getDevConfig() {
  return getBasicConfig();
}

function getProdConfig() {
  var config = Object.assign({}, getBasicConfig());

  if (process.env.IONIC_OPTIMIZE_JS === 'true') {
    config.module.loaders = getOptimizedProdLoaders();
  }
  config.plugins.push(...[
      new PurifyPlugin()
  ]);

  return config;
}

function getAppVersion() {
  var config = new cordovaLib.configparser(path.join(__dirname, '..', 'config.xml'));
  return config.version();
}

var config;
if (process.env.HYBRID_ENV && process.env.HYBRID_ENV === 'prod') {
  config = getProdConfig();
}
else {
  process.env.HYBRID_ENV = 'dev';
  config = getDevConfig();
}

console.log(JSON.stringify(process.env, null, 2));

module.exports = {
  dev: config,
  prod: config
}

