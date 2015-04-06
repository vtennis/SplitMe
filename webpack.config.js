'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/app.jsx'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'app.js',
  },
  resolve: {
    extensions: [
      '',
      '.js',
      '.jsx',
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      }
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: [
          // 'react-hot-loader',
          'jsx-loader?harmony',
        ],
      },
    ],
    noParse: /lie\.js$/,
  }
};
