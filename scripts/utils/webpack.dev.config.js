const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ngtools = require('@ngtools/webpack');
const sharkConf = require('../../shark-conf');
module.exports = () => {
    return {
        mode: 'development',
        resolve: {
            extensions: ['.js', '.ts']
        },
        entry: {
            bootstrap: path.join(sharkConf.__dirname, 'web/src/bootstrap.ts')
        },
        output: { //定义出口
            path: path.resolve(sharkConf.__dirname, 'dist'),
            filename: 'js/[name]-[hash].js'
        },
        devServer: {
            //设置服务器访问的基本目录
            contentBase: path.resolve(sharkConf.__dirname, 'dist'), // 要求服务器访问dist目录
            host: 'localhost', // 设置服务器ip地址，可以是localhost
            port: 8090, // 设置端口号
            open: true, //自动拉起浏览器
            hot: true //模块热更新
        },
        module: {
            rules: [
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
                    test: /\.(sass|scss)$/, //处理sass
                    use: ['style-loader', 'css-loader', 'sass-loader']
                },
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(), //热更新
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
                template: path.join(sharkConf.__dirname, 'web/src/index.html')
            }),
            new CopyWebpackPlugin([{ // 静态文件输出 也就是复制粘贴
                from: path.resolve(sharkConf.__dirname, 'web/src/favicon.ico'), //将哪里的文件
                to: path.resolve(sharkConf.__dirname, 'dist') // 复制到哪里
            }]),
            new ngtools.AngularCompilerPlugin({
                skipCodeGeneration: true,
                tsConfigPath: path.join(sharkConf.__dirname, 'tsconfig.json'),
                entryModule: path.join(sharkConf.__dirname, 'web/src/bootstrap.ts'),
                sourceMap: true
            })
        ],
        devtool: "inline-source-map"
    }
}
