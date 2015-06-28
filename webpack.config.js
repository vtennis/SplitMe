'use strict';

var path = require('path');
var packageJson = require('./package.json');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8000', // WebpackDevServer
    'webpack/hot/only-dev-server',
    './src/app.jsx',
  ],
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '',
    filename: 'app.js',
  },
  resolve: {
    extensions: [
      '',
      '.js',
      '.jsx',
    ],
    packageMains: ['webpack', 'browser', 'web', 'browserify', 'main'], // remove jam from default
    alias: {
      'intl': path.join(__dirname, 'node_modules/intl/Intl.js'),
    },
    root: path.join(__dirname, 'src'),
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(packageJson.version),
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['react-hot-loader', 'jsx-loader?harmony'],
      },
      {
        test: /\.less?$/,
        loaders: [
          'style-loader', 'css-loader',
          'autoprefixer-loader?{browsers:["last 2 versions"]}',
          'less-loader'
        ],
      },
      {
        test: /\.woff?$/,
        loaders: ['url-loader?limit=100000'],
      },
    ],
    noParse: /lie.js/
  },
  devtool: 'eval',
};
