const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DelWebpackPlugin = require('del-webpack-plugin');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

var environment = process.argv.indexOf('-p') !== -1 ? 'production' : 'development';

var config = {
    entry : {
        "vendor" : [
            "lockr", "moment", "axios", "urijs", "babel-polyfill", "uikit"
        ],
        "vue" : [
            "vuex", "vue", "vue-router", "vuelidate", "vue-kindergarten", "vue-extend-layout", "vue-i18n"
        ],
        "site" : "./src/site/main.js"
    },
    output : {
        path : path.join(__dirname, "build"),
        filename : "[name].[chunkhash].js",
        publicPath : "/ui/build/",
        chunkFilename : 'chunk.[name].[chunkhash].js'
    },
    module : {
        loaders : [
            { test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            { test: /\.vue$/,
                loader: "vue-loader"
            },
            { test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback : "style-loader",
                    use : "css-loader"
                })
            },
            { test: /\.(woff|woff2|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader'
            },
            { test: /\.(png|jpe?g|gif)$/i,
                loaders: [
                    "file-loader?name=assets/[name]_[hash].[ext]&publicPath=ui/build/",
                    {
                        loader : 'image-webpack-loader',
                        query : {
                            bypassOnDebug : true,
                            gifsicle: {
                                interlaced : false
                            },
                            optipng : {
                                optimizationLevel : 7
                            }
                        }
                    }
                ]
            },
            { test: /\.svg(\?.*)?$/,
                loader : 'file-loader',
                options : {
                    limit : 10000,
                    name : 'assets/flags/[name]_[hash].[ext]'
                }
            }
        ]
    },
    resolve : {
        extensions : [ '*', '.js', '.vue', '.json' ],
        alias : {
            'vue$' : 'vue/dist/vue.common.js',
            '@' : resolve('ui/src'),
            'config' : path.join(__dirname, 'src', 'site', 'config', environment)
        }
    },
    plugins : [
//        new BundleAnalyzerPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            names : ['vendor', 'vue'],
            minChunks : Infinity
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name : 'manifest'
        }),
        new webpack.ContextReplacementPlugin(
          /moment[\/\\]locale$/,
          /nl|en/
        ),
        new ExtractTextPlugin("style.css"),
        new HtmlWebpackPlugin({
            filename: '../../index.html',
            template: 'src/index.template.html'
        }),
        new DelWebpackPlugin({
            keepGeneratedAssets: true,
            exclude : [ "assets/**" ]
        })
    ]
};

module.exports = config;
