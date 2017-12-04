const path = require('path');
const resolvePath = path.resolve.bind(path, __dirname);

const webpack = require('webpack');

const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
  context: resolvePath(),

  entry: resolvePath('src', 'index.ts'),

  output: {
    path: resolvePath('dist'),
    filename: 'MyBot.js',
  },

  resolve: {
    extensions: ['.js', '.ts'],
  },

  target: 'node',

  module: {
    rules: [
      {
        test: /\.(j|t)s$/,
        loader: 'babel-loader',
      },
    ],
  },

  plugins: [
    new ProgressBarPlugin(),

    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
};
