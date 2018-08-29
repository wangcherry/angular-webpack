const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const ngtools = require('@ngtools/webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HashOutput = require('webpack-plugin-hash-output');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const os = require('os');

module.exports = config => {
    const webpackConfig = {
        mode: 'production',
        resolve: {
            extensions: ['.ts', '.js']
        },
        entry: {
            polyfills: config.polyfillChunk,
            styles: config.styleChunk,
            bootstrap: config.bootstrapChunk
        },
        output: {
            filename: 'js/[name]-[chunkhash].js',
            path: config.buildClient,
            publicPath: config.mimgURLPrefix[config.target],
            chunkFilename: 'js/[name]-[chunkhash].js'
        },
        performance: {// 性能
            hints: false //超过250kb的资源不展示警告或错误提示。
        },
        optimization: {// 优化
            minimizer: [
                new UglifyJsPlugin({
                    parallel: true,// 启用并行
                    cache: true,
                    uglifyOptions: {
                        output: {
                            comments: false,
                            beautify: false
                        }
                    }
                })
            ],
            splitChunks: {
                minSize: 30000,
                minChunks: 1,
                maxAsyncRequests: Infinity,
                maxInitialRequests: Infinity,
                cacheGroups: {
                    default: {
                      minChunks: 2,
                      priority: 10,
                      chunks: 'async'
                    },
                    vendors: false,
                    vendors: {
                        name: 'vendor',
                        chunks: 'all',
                        test: (module, chunks) => {
                            const moduleName = module.nameForCondition ? module.nameForCondition() : '';
                            return (/[\\/]node_modules[\\/]/.test(moduleName)) && (chunks.length === 1 && chunks[0].name === 'bootstrap');
                        }
                    }
                }
            }
        },
        module: {
            rules: [
                {
                    // 消除system.import的警告
                    test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
                    parser: { system: true }
                },
                {
                    test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                    loader: '@ngtools/webpack'
                },
                {
                    test: /\.html$/,
                    use: {
                        loader: 'html-loader'
                    }
                },
                {
                    test: /\.(jpg|png|webp|gif)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            fallback: 'file-loader',
                            name: '[name]-[hash:20].[ext]',
                            outputPath: 'img/',
                            limit: 100
                        }
                    }
                },
                {
                    test: /\.scss$/,
                    include: [config.styles],
                    use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
                },
                {
                    test: /\.scss$/,
                    exclude: [config.styles],
                    use: [ 'to-string-loader', 'css-loader', 'sass-loader' ]
                }
            ]
        },
        plugins: [
            new CircularDependencyPlugin({
                exclude: /[\\\/]node_modules[\\\/]/,
                failOnError: true,
                cwd: process.cwd()
            }),
            new webpack.DefinePlugin({
                'HOT': config.hotReload,
                'ENV': JSON.stringify('production')
            }),
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash].css',
                chunkFilename: 'css/[name].[contenthash].css'
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: config.index,
                chunks: ['styles', 'polyfills', 'vendor', 'bootstrap'],
                chunksSortMode: (function () {
                    const orders = ['styles', 'polyfills', 'vendor', 'bootstrap'];
                    return function (left, right) {
                        let leftIndex = orders.indexOf(left.names[0]);
                        let rightindex = orders.indexOf(right.names[0]);
                        if (leftIndex > rightindex) {
                            return 1;
                        }
                        else if (leftIndex < rightindex) {
                            return -1;
                        }
                        else {
                            return 0;
                        }
                    }
                })()
            }),
            new ngtools.AngularCompilerPlugin({
                skipCodeGeneration: false,
                tsConfigPath: config.tsConfig,
                mainPath: config.mainPath,
                sourceMap: false
            }),
            new HashOutput()
        ]
    }

    // 判断如果运行在 docker 中，则不显示progress 日志
    if (os.hostname().indexOf('yx.hz.infra.mail') === -1) {
        webpackConfig.plugins.push(new SimpleProgressWebpackPlugin());
    }

    return webpackConfig;
}