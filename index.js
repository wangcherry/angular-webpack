const path = require('path');
const mergeDirConfig = require('./utils/mergeconfig');
class SharkWebpack {

    constructor(config) {
        this.config = mergeDirConfig(config);
    }

    /**
     * 获取node_moudules下已安装的某个包
     * @param {*} moduleName 'webpack'|'shelljs'|'html-webpack-plugin'
     * @returns
     * @memberof SharkWebpack
     */
    getModule(moduleName) {
        return require(moduleName);
    }

    getDevConfig(target) {
        return require('./utils/webpack.dev.config')(Object.assign({}, this.config, {
            target: target ? target : 'dev'
        }));
    }

    getBuildConfig(target) {
        return require('./utils/webpack.build.config')(Object.assign({}, this.config, {
            target: target ? target : 'online'
        }));
    }
}

module.exports = SharkWebpack;