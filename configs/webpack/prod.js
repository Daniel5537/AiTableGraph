// production config
const merge = require('webpack-merge');
const {resolve} = require('path');

const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'production',
  entry: resolve(__dirname, '../../src/main.tsx'),
  output: {
    filename: 'js/bundle.min.js',
    path: resolve(__dirname, '../../dist'),
    publicPath: '/static/',
  },
  devtool: 'source-map',
  plugins: [],
});
