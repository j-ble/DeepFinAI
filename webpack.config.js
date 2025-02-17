const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: {
    'popup/popup': './popup/popup.js',
    'background/background': './background/background.js',
    'content/contentScript': './content/contentScript.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new Dotenv(),
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "manifest.json" },
        { from: "popup/popup.html", to: "popup/popup.html" },
        { from: "popup/paywall.html", to: "popup/paywall.html" },
        { from: "popup/success.html", to: "popup/success.html" },
        { from: "assets", to: "assets" }
      ],
    }),
  ],
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}; 