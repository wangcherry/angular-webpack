const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ngtools = require('@ngtools/webpack');
const sharkConf = require('../../shark-conf');
module.exports = {
    mode: 'development',
    resolve: {
        extensions: ['.js', '.ts']
    },
    entry: {
        bootstrap: [path.join(sharkConf.__dirname, 'web/src/bootstrap.ts'), 'webpack-hot-middleware/client?reload=true'],
        polyfills: [
            'core-js/es7/reflect.js',
            'zone.js/dist/zone.js'
        ].concat(['webpack-hot-middleware/client?reload=true'])
    },
    output: { //定义出口
        path: path.join(sharkConf.__dirname, 'dist'),
        filename: 'js/[name]-[hash].js'
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
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name].[ext]'
                    }
                }
            },
            {
                test: /\.(sass|scss)$/, //处理sass
                include: [path.join(sharkConf.__dirname, 'web/src/styles/scss/index.scss')],
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(sass|scss)$/, //处理sass
                exclude: [path.join(sharkConf.__dirname, 'web/src/styles/scss/index.scss')],
                use: ['to-string-loader', 'css-loader', 'sass-loader']
            },
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), //热更新
        new webpack.DefinePlugin({
            'HOT': true,
            'ENV': JSON.stringify('development')
        }),
        new CleanWebpackPlugin(['dist'], {
            root: sharkConf.__dirname,
            verbose: true,
            dry: false
        }), //表示每次运行之前先删除dist目录
        new HtmlWebpackPlugin({
            filename: 'index.html',//定义生成的页面的名称
            minify: {
                collapseWhitespace: true //压缩html代码
            },
            title: "这里是设置HTML title", //用来生成页面的 title 元素 使用：<%= htmlWebpackPlugin.options.title %>
            template: path.join(sharkConf.__dirname, 'web/src/index.html'),
            chunks: ['polyfills', 'bootstrap'], //允许只添加某些块
            chunksSortMode: (function () { //允许控制块在添加到页面之前的排序方式
                const orders = ['polyfills', 'bootstrap'];
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
        new CopyWebpackPlugin([{ // 静态文件输出 也就是复制粘贴
            from: path.join(sharkConf.__dirname, 'web/src/favicon.ico'), //将哪里的文件
            to: path.join(sharkConf.__dirname, 'dist') // 复制到哪里
        }]),
        new ngtools.AngularCompilerPlugin({
            skipCodeGeneration: true,
            tsConfigPath: path.join(sharkConf.__dirname, 'tsconfig.json'),
            mainPath: path.join(sharkConf.__dirname, 'web/src/bootstrap.ts'),
            sourceMap: true
        })
    ],
    devtool: "inline-source-map"
}
