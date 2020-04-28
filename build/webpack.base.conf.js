const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
let isDevMode = 'production' !== process.env.NODE_ENV;

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  assets: 'assets/'
}

const PAGES_DIR = `${PATHS.src}/`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {
  externals: {
    paths: PATHS
  },
  entry: {
      app: PATHS.src,
  },
  devtool: 'inline-source-map',
  output: {
      filename: `${PATHS.assets}js/[name].[hash].js`,
      path: PATHS.dist,
      publicPath: '/'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
      rules: [{
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: '/node_modules/' 
        },
        {
          test: /\.css$/,
          use: [
              'style-loader',
              MiniCssExtractPlugin.loader,
              {
                  loader: 'css-loader',
                  options: { sourceMap: true }
              }, 
              {
                  loader: 'postcss-loader',
                  options: { sourceMap: true, config: { path: `./postcss.config.js` } 
                }
              }   
          ]
        },
        {
          test: /\.scss$/,
          use: [
            isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader',
            {
              loader: 'css-loader',
              options: { sourceMap: true }
            }, {
              loader: 'postcss-loader',
              options: { sourceMap: true, config: { path: `./postcss.config.js` } }
            }, {
              loader: 'sass-loader',
              options: { sourceMap: true }
            }
          ]
        },
        {
          test: /\.pug$/,
          loader: 'pug-loader'
        },
        {
          test: /\.(png|jpg|gif|svg|jpeg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }, 
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        }, 
    ]},
  plugins: 
  [
    new MiniCssExtractPlugin ({
        filename: `${PATHS.assets}css/[name].[contenthash].css`
    }),
    new CleanWebpackPlugin({
      dry: true,
    }),
    new webpack.ProvidePlugin({
      noUiSlider: 'nouislider'
    }),
    new webpack.ProvidePlugin({
    $: 'jquery',
      '$': 'jquery',
      jquery: 'jquery',
      jQuery: 'jquery',
      'window.jquery': 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery',
    }),
    new HtmlWebpackPlugin({
      hash: false,
      template: `${PATHS.src}/index.html`,
      filename: './index.html'
    }),
    new CopyWebpackPlugin ([
      {
        from: `${PATHS.src}/img`, 
        to: `${PATHS.assets}img`,
      },
      {
        from: `${PATHS.src}/fonts`, 
        to: `${PATHS.assets}fonts`,
      },
      {
        from: `${PATHS.src}/static`,
        to: ''
      }
    ]),
    // ...PAGES.map(page => new HtmlWebpackPlugin({
    //   template: `${PAGES_DIR}/${page}`,
    //   filename: `./${page.replace(/\.pug/,'.html')}`
    // }))
  ],
}