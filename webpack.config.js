const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = (env, argv) => {

  let mode = 'development';
  if (argv && argv.mode) {
    mode = argv.mode;
  }

  const isDev = (mode === 'development');
  process.env.NODE_ENV = isDev ? 'development' : 'production';

  return {
    watch: isDev,
    devtool: isDev ? 'eval-cheap-source-map' : false,
    mode,
    entry: {
      site: resolve('src/site/main.js'),
    },
    output: {
      path: path.join(__dirname, 'build', 'build'),
      filename: '[name].[chunkhash].js',
      chunkFilename: '[name].[chunkhash].js',
      publicPath: '/build/'
    },
    optimization: {
      runtimeChunk: 'single',
      minimizer: [
        new OptimizeCSSAssetsPlugin({
          cssProcessorPluginOptions: {
            preset: [ 'default', { discardComments: { removeAll: true } } ]
          }
        }),
      ],
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // eslint-disable-next-line max-len
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `npm.${packageName.replace('@', '')}`;
            },
          },
          styles: {
            test: /\.css$/,
            name: 'styles',
            chunks: 'all',
            enforce: true
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'async',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'html-loader',
              options: {
                attributes: {
                  list: [
                    {
                      tag: 'message-card',
                      attribute: 'image',
                      type: 'src'
                    },
                    {
                      tag: 'img',
                      attribute: 'src',
                      type: 'src'
                    },
                    {
                      tag: 'img',
                      attribute: 'srcset',
                      type: 'srcset'
                    },
                  ]
                }
              }
            },
          ]
        },
        {
          test: /\.vue$/,
          use: [
            'vue-loader',
            {
              loader: 'posthtml-loader',
              options: {
                plugins: [
                  require('posthtml-include')(),
                ]
              }
            },
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 1 }},
            'postcss-loader',
          ]
        },
        {
          test: /\.(woff(2)?|eot|svg|otf|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'fonts/'
          }
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            'file-loader?name=assets/[name]_[hash].[ext]&esModule=false',
            {
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: true,
                gifsicle: {
                  interlaced: false
                },
                optipng: {
                  optimizationLevel: 7
                },
                mozjpeg: {
                  progressive: true,
                  quality: 65
                }
              }
            },
          ]
        },
      ]
    },
    resolve: {
      extensions: [ '*', '.js', '.vue', '.json' ],
      alias: {
        vue$: isDev ? 'vue/dist/vue.common.js' : 'vue/dist/vue.common.prod.js',
        '@': resolve('src'),
        config: path.join(__dirname, 'src', 'site', 'config', mode),
        custom: resolve('custom')
      },
      mainFiles: [ 'index' ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      }),
      new MomentLocalesPlugin({
        localesToKeep: [
          'nl',
          'en',
        ]
      }),
      new HtmlPlugin({
        filename: '../index.html',
        template: './src/index.template.html'
      }),
      new MinifyPlugin(),
    ]
  };
};
