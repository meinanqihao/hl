'use strict';

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
require('babel-preset-es2015');

var path = require('path');
var ngTemplateLoader = (
    'ngtemplate-loader?relativeTo=' + path.resolve(__dirname, './src/') +
    '!html-loader'
);

module.exports = {
    cache: false,
    entry: {
        'js/app': './src/entry',
        'js/login': './src/login.entry'
    },
    output: {
        path: __dirname + '/dist' ,
        publicPath: '/dist' ,
        filename: '[name].min.[chunkHash:8].js',
        chunkFilename: '[chunkhash].js',
        libraryTarget: 'umd'
    },

    module: {
        loaders:[{
            test: /\.html$/,
            loader: ngTemplateLoader
          },{
            test: /\.js$/,
            exclude: /(node_modules)/,
            loaders:['required-loader', {
              loader: 'babel-loader',
              options: {
                presets: ['es2015-loose']
              }
            },{
              loader:'es3ify-loader',
              options:{
                enforce: 'post'
              }
            }]
          },
          {
            test: /\.less$/,
            loaders: ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: ["css-loader","less-loader"]
            })
          },
            {
                test: /\.css/,
                loaders: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader"]
                })
            },
          {
             test: /\.(png|jpg|gif)$/,
             loader:'url-loader?limit=50000&name=/images/[name].[hash:8].[ext]'
          }
          ,{
              test: /\.(woff|ttf|eot|svg)$/,
              loader:'url-loader?limit=5000&name=/css/[name].[hash:8].[ext]'
          }
        ]
    },
    resolve: {
      alias: {
        "angular":  '/dist/libs/js/angular.js',
        "angular-ui-router": '/dist/libs/js/angular-ui-router.min.js',
        'ui-select': '/dist/libs/js/select.js',
        "angular-ui-bootstrap":'/dist/libs/js/ui-bootstrap-tpls.js'
      }
    },
    externals: {
        "angular-ui-router":"angular-ui-router",
        "angular":  'angular',
        "ui-select":  'ui-select',
        "angular-ui-bootstrap":"angular-ui-bootstrap"
    },
    plugins: [
      new CleanWebpackPlugin(['js','css'], {
        root: __dirname + '/dist',
        verbose: true,
        dry: false,
        exclude: []
      }),
      new HtmlWebpackPlugin({
          chunks: ['js/common.js', 'js/app'],
          template: __dirname + '/src/modules/index.ejs',
          filename: __dirname + '/dist/index.html',
          minify: {
              removeComments: true,
              collapseWhitespace: false
          }
      }),
      new HtmlWebpackPlugin({
          chunks: ['js/common.js', 'js/login'],
          template: __dirname + '/src/modules/index.ejs',
          filename: __dirname + '/dist/login.html',
          minify: {
              removeComments: true,
              collapseWhitespace: false
          }
      }),
      new webpack.optimize.CommonsChunkPlugin('js/common.js'),
      new ExtractTextPlugin('css/main.[contenthash:8].css')
    ]


};
