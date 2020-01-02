const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const baseConfig = require('./webpack.base.config');
const config = require('./config');
const postcssLoader = require('./postcss-loader.config');
const theme = require('../theme.json');

module.exports = merge.smartStrategy({
  entry: 'prepend',
  plugins: 'prepend'
})(baseConfig, {
  entry: {
    main: ['event-source-polyfill']
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  devtool: 'cheap-module-inline-source-map',
  devServer: {
    clientLogLevel: 'warning',
    port: config.port,
    host: '0.0.0.0',
    disableHostCheck: true,
    inline: true,
    historyApiFallback: {
      index: '/'
    },
    hot: true,
    compress: true,
    quiet: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: config.proxy
  },
  module: {
    rules: [
      {
        test: /\.(?:woff2?|eot|ttf|svg)$/,
        include: path.resolve('src/assets/iconfont'),
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.svg$/,
        include: path.resolve('src/assets/iconsvg'),
        issuer: {
          test: /\.jsx?$/
        },
        use: [
          'babel-loader',
          {
            loader: '@svgr/webpack',
            options: {
              babel: false
            }
          }
        ]
      },
      {
        test: /\.(?:png|jpe?g|gif|svg)$/,
        include: path.resolve('src/assets/img'),
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]'
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              camelCase: true,
              localIdentName: '[name]__[local]--[hash:base64:5]'
            }
          },
          postcssLoader
        ]
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.less$/,
        include: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              javascriptEnabled: true,
              modifyVars: theme
            }
          }
        ]
      }
    ],
  },
  mode: 'development',
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../public'),
        to: 'public/',
        ignore: ['.*']
      }
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin({
      clearConsole: false,
      compilationSuccessInfo: {
        messages: [`Webpack dev server is running here: ${chalk.cyan(`http://127.0.0.1:${chalk.bold(config.port)}`)}`]
      }
    }),
    new HtmlWebpackPlugin({
      inject: false,
      title: config.title,
      template: 'index.html',
      chunksSortMode: 'dependency'
    })
  ],
});
