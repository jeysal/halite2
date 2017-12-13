const path = require('path');
const resolvePath = path.resolve.bind(path, __dirname);

const webpack = require('webpack');

const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const PermissionsPlugin = require('webpack-permissions-plugin');

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

    // make output bundle executable
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
    new PermissionsPlugin({
      buildFiles: [{ path: resolvePath('dist/MyBot.js'), fileMode: '755' }],
    }),

    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
};
