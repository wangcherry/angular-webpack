const fs = require('fs');
const path = require('path');
const opn = require('opn');
const argv = require('yargs').argv; //获取命令行参数
const chalk = require('chalk'); //终端字符串样式
const getPort = require('get-port'); //获取可用的TCP端口

//webpack 配置
const sharkAngularXWebpack = require('../../index');
const sw = new sharkAngularXWebpack(require('../../shark-conf'));
const webpack = sw.getModule('webpack');
const sharkConf = sw.config;
const webpackConfig = sw.getDevConfig();

//use koa
const koa = require('koa'); //基于node的web开发框架，
const koaBody = require("koa-body");
const koaWebpackMiddleware = require('koa-webpack-middleware'); //热更新中间件
const koaProxies = require('koa-proxies'); // HTTP代理中间件
const app = new koa();

let devMiddleware;
if(argv.target === 'build') {

}else {
    let compiler = webpack(webpackConfig);
    devMiddleware = koaWebpackMiddleware.devMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath, // public path to bind the middleware to use the same as in webpack
        logTime: true,
        stats: { // options for formating the statistics
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false,
            cachedAssets: false
        }
    });
    app.use(devMiddleware);
    app.use(koaWebpackMiddleware.hotMiddleware(compiler));
}

if (argv.server === 'remote') {
    app.use(koaProxies(`${sharkConf.contextPath}${sharkConf.xhrPrefix}`, {
        target: sharkConf.remote.url,
        changeOrigin: true,
        logs: true
    }));
} else {
    app.use(koaBody({ textLimit: "100mb", jsonLimit: "100mb", formLimit: "100mb" }));
    app.use(async (ctx, next) => {
        const reg = new RegExp(`${sharkConf.contextPath}${sharkConf.xhrPrefix}`);
        if (!reg.test(ctx.path)) {
            await next();
        } else {
            const emitContentPath = ctx.path.replace(`${sharkConf.contextPath}/`, '');
            const mockFilePath = path.join(sharkConf.mockPath, emitContentPath);
            if (fs.existsSync(mockFilePath)) {
                ctx.set('Content-Type', 'application/json; charset=UTF-8');
                ctx.body = fs.readFileSync(mockFilePath, 'utf-8');
            } else {
                await next();
            }
        }
    });
}

//not found
app.use(async (ctx) => {
    ctx.status = 404;
    ctx.body = {
        code: 404
    };
});

//open url
getPort({ port: sharkConf.port }).then((port) => {
    console.log(chalk.green('port is :' + port));
    const clientUrl = `http://localhost:${port}${sharkConf.contextPath}/index.html`;
    if (devMiddleware) {
        devMiddleware.waitUntilValid(() => {
            console.log(chalk.green('\nLive Development Server is listening on '), chalk.blue.underline(clientUrl));
            opn(clientUrl);
        })
    } else {
        console.log(chalk.green('\nStatic Build Server is starting on '), chalk.blue.underline(clientUrl));
        opn(clientUrl);
    }
    app.listen(port);
}).catch((err) => {
    console.error(err);
});