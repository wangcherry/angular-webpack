const argv = require('yargs').argv;
const sharkAngularWebpack = require('../../index');
const sw = new sharkAngularWebpack(require('../../shark-conf'));
const webpackConfig = sw.getBuildConfig(argv.target);

