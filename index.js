const path = require('path');
const mergeDirConfig = require('./utils/mergeconfig');
const fse = require('fs-extra');
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
    
    /**
     * 执行 build 操作，传入 options 包含
     *
     * @param {any} options.target 构建的目标， 不传 | test | online 不传为本地编译，主要影响index.html中资源地址拼接
     * @param {any} options.branch 构建的代码分支  dev | master | ... 暂未使用
     * @param {any} options.buildConfig 用户传入的配置  customConfig = sharkWebpack.getBuildConfig() 所得
     * @param {function} options.callback webpack 打包完成后的回调，可以进行打包结果的拷贝
     * @memberof SharkWebpack
     */
    runBuild(options) {
        let callback = options.callback || (() => { });
        let webpackConfig = options.webpackConfig ? options.webpackConfig : this.getBuildConfig(options.target);
        fse.emptyDirSync(this.config.build); //清空编译目录
        this.getModule('webpack')(webpackConfig, (err, states) => {
            if (err) {
                if (err.details) throw new Error(err.details);
                throw new Error(err.stack || err);
            }
            if (states.hasErrors()) {
                const info = states.toJson();
                throw new Error(info.errors);
            }

            process.stdout.write(states.toString({
                bail: true,
                colors: true,
                modules: true,
                children: false,
                chunks: true,
                chunkModules: false,
                timings: true
            }) + '\n');

            if (fse.existsSync(path.join(this.config.buildClient))) {
                fse.copySync(path.join(this.config.buildClient), path.join(this.config.buildWebapp), {
                    filter: (src, dest) => {
                        if (/[\\/]js/.test(src) || /[\\/]css/.test(src) || /[\\/]img/.test(src)) {
                            return false;
                        }
                        return true;
                    }
                });
            }
            if (fse.existsSync(path.join(this.config.buildClient, 'js'))) {
                fse.copySync(path.join(this.config.buildClient, 'js'), path.join(this.config.buildStatics, 'js'));
            }
            if (fse.existsSync(path.join(this.config.buildClient, 'css'))) {
                fse.copySync(path.join(this.config.buildClient, 'css'), path.join(this.config.buildStatics, 'css'));
            }
            if (fse.existsSync(path.join(this.config.buildClient, 'img'))) {
                fse.copySync(path.join(this.config.buildClient, 'img'), path.join(this.config.buildStatics, 'img'));
            }
            if (fse.existsSync(path.join(this.config.srcPath, 'favicon.ico'))) {
                // issue of copySync : https://github.com/jprichardson/node-fs-extra/issues/323
                fse.copySync(path.join(this.config.srcPath, 'favicon.ico'), path.join(this.config.buildWebapp, 'favicon.ico'));
                fse.copySync(path.join(this.config.srcPath, 'favicon.ico'), path.join(this.config.buildClient, 'favicon.ico'));
            }
            //执行用户提供的回调代码
            callback();
        });
    }
}

module.exports = SharkWebpack;