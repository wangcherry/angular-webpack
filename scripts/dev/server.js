const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const path = require('path');

const webpackDevConfig = require('../utils/webpack.dev.config');
const sharkConf = require('../../shark-conf');
const options = { //设置服务器访问的基本目录
    contentBase: path.join(sharkConf.__dirname, 'dist'), // 要求服务器访问dist目录
    hot: true, //模块热更新
    open: true, //自动拉起浏览器
    host: 'localhost' // 设置服务器ip地址，可以是localhost
};

webpackDevServer.addDevServerEntrypoints(webpackDevConfig, options);
const compiler = webpack(webpackDevConfig);
const server = new webpackDevServer(compiler, options);

server.listen(8090, 'localhost', () => {
    console.log('dev server listening on port 8090');
});
