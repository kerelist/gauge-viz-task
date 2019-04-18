const path = require('path'),
      postCSS = require('./postcss.config.js'),
      MiniCssExtractPlugin = require('mini-css-extract-plugin');
      webpack = require('webpack');

//set node env to start (process.env.node works with the cross-env npm package seen in package.json)
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//check whether production; set to prod if true
const isProd = process.env.NODE_ENV === 'production' ? true : false;

//enter project folder name
const PROJECT_NAME = 'gauge-viz-task';

//configure paths
const configPaths = {
    base: path.resolve(__dirname, `./`),
    src: path.resolve(__dirname, `./src`),
    build: path.resolve(__dirname, `./`),
    assets: path.resolve(__dirname, `./src/assets/`),
    js: path.resolve(__dirname, `./src/js/scripts.js`),
    sass: path.resolve(__dirname, `./src/sass/style.scss`)
};

//COMMON PROCESSES TO ALL ENVIRONMENTS

//rules/rules
const rules = [
  { //babel for js
      test: /\.js$/, //files ending with .js
      exclude: /(node_modules)/,
      loader: ['babel-loader'] //use this loader
  }
];

//plugins
const plugins = [
  new MiniCssExtractPlugin({ // define where to save the compiled css file
      filename:'style.css',
  }),
];


//PRODUCTION ONLY

if (isProd) {

  //rules
  rules.push(
      {
          test: /\.(sass|scss)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            { loader: 'css-loader' },
            { loader: 'postcss-loader' },
            { loader: 'sass-loader', options: {
            outputStyle: 'compressed'
            } }
          ]
      }
  );

  //plugins
  plugins.push(
      new webpack.optimize.UglifyJsPlugin({
          sourceMap: true,
          compress: {
              warnings: false,
              conditionals: true,
              unused: true,
              comparisons: true,
              sequences: true,
              dead_code: true,
              evaluate: true,
              if_return: true,
              join_vars: true,
          },
          output: {
              comments: false,
          },
          ie8: false,
      })
  );

//DEVELOPMENT ONLY
} else {

  //rules/rules
  rules.push(
    { // sass / scss loader
      test: /\.(sass|scss)$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
        },
        {loader: 'css-loader', options: { //technically don't need here yet, left in case want to use CSS in JS later
            sourceMap: true,
          }
        }, {loader: 'sass-loader', options: {
            sourceMap: true,
            outputStyle: 'compact' //necessary to use with sourcemap because of bug https://github.com/sass/libsass/issues/2312
          }
        }
      ]//sass-loader only for dev b/c it's faster
    }
  );

  rules.push(
    { //js hint linter
      test: /\.js$/, // include .js files
      enforce: "pre", // preload the jshint loader
      include: configPaths.src,
      use: [
        {
          loader: 'jshint-loader'
        }
      ]
    }
  );

  plugins.push(
    function() {
      this.plugin('watch-run', function(watching, callback) {
            console.log('Begin compile at ' + new Date());
            callback();
        })
      }
  );

}

let globalConfig = {
  entry: ['core-js/fn/promise', configPaths.js, configPaths.sass],
  mode: 'none', //i have manually config'd this myself
  resolve: {
    extensions: ['.js', '.json', '.scss']
  },
  output: {
      filename:'script.js',
      path: configPaths.build
  },
  module: {
      rules
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'style',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins,
  devtool: process.env.NODE_ENV === 'production' ? "source-map" : "inline-source-map"
};

module.exports = globalConfig;
