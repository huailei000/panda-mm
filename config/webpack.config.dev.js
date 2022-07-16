const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const helper = require('../server/helper');
const CONFIG = require('../server/devConf');

const TARGET = helper.findArg('target') || CONFIG.server.target;
module.exports = {
    mode: 'development',
    entry: {
        app: './src/app.js'
    },
    output: {
        path: path.resolve(__dirname, '../dev'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        publicPath: '/'
    },
    resolve: {
        alias: {
            bcomponents: path.resolve(__dirname, '../src/bcomponents'),
            xcomponents: path.resolve(__dirname, '../src/xcomponents'),
            stores: path.resolve(__dirname, '../src/stores'),
            services: path.resolve(__dirname, '../src/services'),
            scss: path.resolve(__dirname, '../src/scss'),
            mock: path.resolve(__dirname, '../src/mock'),
            assets: path.resolve(__dirname, '../src/assets')
        },
        modules: [path.resolve(__dirname, '../src'), 'node_modules'],
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader', path.resolve(__dirname, './lazyloader')]
            },
            {
                test: /\.css$/,
                use: ['style-loader!css-loader']
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "sass-loader"
                }]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: 'img/[name].[ext]'
                    }
                }]
            },
            {
                test: /\.(woff|svg|eot|ttf|woff2)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: 'fonts/[name].[ext]'
                    }
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: path.resolve(__dirname, '../dev/index.html'),
            inject: 'body'
        }),
        new webpack.optimize.SplitChunksPlugin({
            chunks: "async",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true,
            },
            base: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10
            }
        }),
        // new webpack.DefinePlugin({
        //     'process.env.TARGET': JSON.stringify(TARGET)
        // }),
    ]
}