const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ngtools = require('@ngtools/webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = config => {
    const webpackConfig = {
        mode: 'development',
        resolve: {
            extensions: ['.ts', '.js']// 这里需要注意顺序，顺序反了的话ts不会实时编译
        },
        entry: {
            polyfills: config.polyfillChunk.concat(['webpack-hot-middleware/client?reload=true']),
            styles: config.styleChunk.concat(['webpack-hot-middleware/client?reload=true']),
            bootstrap: config.bootstrapChunk.concat(['webpack-hot-middleware/client?reload=true'])
        },
        output: { //定义出口
            path: config.buildClient,
            publicPath: config.mimgURLPrefix[config.target],
            filename: 'js/[name].js',
            chunkFilename: 'js/[name].js'
        },
        performance: {
            hints: false //超过250kb的资源不展示警告或错误提示。
        },
        optimization: {
            splitChunks: {
                minSize: 30000,
                minChunks: 1,
                maxAsyncRequests: Infinity,
                maxInitialRequests: Infinity,
                cacheGroups: {
                    default: {
                        chunks: 'async',
                        minChunks: 2,
                        priority: 10
                    },
                    vendors: false,
                    vendor: {
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
                    //消除system.import的警告
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
                            name: 'img/[name].[ext]',
                            limit: 100
                        }
                    }
                },
                {
                    test: /\.(sass|scss)$/, //处理sass
                    include: [config.styles],
                    use: ['style-loader', 'css-loader', 'sass-loader']
                },
                {
                    test: /\.(sass|scss)$/, //处理sass
                    exclude: [config.styles],
                    use: ['to-string-loader', 'css-loader', 'sass-loader']
                },
            ]
        },
        plugins: [
            new webpack.ProgressPlugin(), //显示进度
            new webpack.HotModuleReplacementPlugin(), //热更新
            new CircularDependencyPlugin({ //检查循环依赖
                exclude: /[\\\/]node_modules[\\\/]/,
                failOnError: true,
                cwd: process.cwd()
            }),
            new webpack.DefinePlugin({ //定义一些常量
                'HOT': config.hotReload,
                'ENV': JSON.stringify('development')
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',//定义生成的页面的名称
                minify: {
                    collapseWhitespace: true //压缩html代码
                },
                title: "可以设置HTML title", //用来生成页面的 title 元素， 可使用：<%= htmlWebpackPlugin.options.title %>
                template: config.index,
                chunks: ['styles', 'polyfills', 'vendor', 'bootstrap'], //允许只添加某些块
                chunksSortMode: (function () { //允许控制块在添加到页面之前的排序方式
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
                skipCodeGeneration: true,
                tsConfigPath: config.tsConfig,
                mainPath: config.mainPath,
                sourceMap: true
            })
        ],
        devtool: "inline-source-map"
    };
    return webpackConfig;
}
