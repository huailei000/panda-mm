const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    /*设置生产环境*/
    mode: 'production',
    entry: {
        app: ['./src/app.js']
    },
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: 'js/[name].[hash:6].js',
        chunkFilename: "js/[name].[hash:6].js",
        publicPath: './'
    },
    resolve: {
        modules: [path.resolve(__dirname, '../src'), 'node_modules'],
        alias: {
            bcomponents: path.resolve(__dirname, '../src/bcomponents'),
            xcomponents: path.resolve(__dirname, '../src/xcomponents'),
            stores: path.resolve(__dirname, '../src/stores'),
            services: path.resolve(__dirname, '../src/services'),
            scss: path.resolve(__dirname, '../src/scss'),
            mock: path.resolve(__dirname, '../src/mock'),
            assets: path.resolve(__dirname, '../src/assets')
        }
    },
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader', path.resolve(__dirname, './lazyloader')]
            },
            {
                test: /\.(css|scss)$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary
                    use: [{
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: 'html-loader'

            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: 'img/[name].[hash:6].[ext]'
                    }
                }]
            },
            {
                test: /\.(woff|svg|eot|ttf|woff2)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: 'fonts/[name].[hash:6].[ext]',
                        publicPath: '../',
                    }
                }]
            },
            {
                test: /\.swf$/,
                loader: 'file?name=js/[name].[hash:6].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.DEPLOY': JSON.stringify('release')
        }),
        new webpack.optimize.SplitChunksPlugin({
            chunks: "async",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true
        }),
        new ExtractTextPlugin('css/styles.[hash:6].css'),
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: false,
            uglifyOptions: {
                warnings: false,
                output: {
                    comments: false,
                    beautify: false
                },
                compressor: {
                    sequences: true,
                    drop_debugger: true,
                    drop_console: true
                }
            }
        }),
        new OptimizeCSSPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true
                },
                safe: true
            },
            canPrint: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../index.html'),
            filename: path.resolve(__dirname, '../build/index.html'),
            inject: 'body'
        }),
        new CleanWebpackPlugin(['build'])
    ]
};