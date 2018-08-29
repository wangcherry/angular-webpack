const argv = require('yargs').argv;
const sharkAngularWebpack = require('../../index');
const sw = new sharkAngularWebpack(require('../../shark-conf'));
const webpackConfig = sw.getBuildConfig(argv.target);

// 在此处可以配置 build 过程中需要外接的 config文件
sw.runBuild({
    webpackConfig: webpackConfig,
    target: argv.target, // required
    branch: argv.branch // required
});