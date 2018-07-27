const path = require('path');
const fs = require('fs');
const defaultPolyfillChunk = [
    'core-js/es7/reflect.js',
    'zone.js/dist/zone.js'
];
const shimIE9 = [
    '@shark/shark-angularX-webpack/utils/setPrototypeOf.js',// https://github.com/angular/angular/issues/21083
    'raf/polyfill.js',
    'classlist.js',
    'intl',
    'intl/locale-data/jsonp/en.js',
    'core-js/es6/index.js',
    'core-js/es7/index.js'
];
function mergeBaseConfig(config) {
    const baseConfig1 = {
        root: config.__dirname,
        hotReload: true,
        xhrPrefix: '/xhr',
        mockPath: path.join(config.__dirname, 'web/mock'),
        srcPath: path.join(config.__dirname, 'web/src'),
        build: path.join(config.__dirname, 'build'),
        nodeModules: path.join(config.__dirname, 'node_modules'),
        tsConfig: path.join(config.__dirname, 'tsconfig.json')
    };
    const baseConfig2 = {
        buildClient: path.join(baseConfig1.build, 'client'),
        buildWebapp: path.join(baseConfig1.build, 'app'),
        buildStatics: path.join(baseConfig1.build, 'mimg'),
        assetsPath: path.join(baseConfig1.srcPath, 'assets'),
        styles: path.join(baseConfig1.srcPath, 'styles/scss'),
        index: path.join(baseConfig1.srcPath, 'index.html'),
        favicon: path.join(baseConfig1.srcPath, 'favicon.ico'),
        mainPath: path.join(baseConfig1.srcPath, 'bootstrap.ts')
    };
    return Object.assign({}, baseConfig1, baseConfig2, config);
}

function mergePolyfillChunk(config) {
    let result = [];
    if (config.shimIE9) {
        result = result.concat(shimIE9);
        console.log('[INFO] openning IE9+ support');
    }
    if (Array.isArray(config.polyfillChunk) && config.polyfillChunk.length > 0) {
        result = result.concat(config.polyfillChunk);
        console.log('[INFO] merge config.polyfillChunk');
    }
    result = result.concat(defaultPolyfillChunk);
    return result.filter((item, pos) => result.lastIndexOf(item) === pos);
}

function mergeStyleChunk(config) {
    let result = [];
    if (Array.isArray(config.styleChunk) && config.styleChunk.length > 0) {
        result = result.concat(config.styleChunk);
        console.log('[INFO] merge config.styleChunk');
    }
    result = result.concat([path.join(config.styles, 'index.scss')]);
    return result.filter((item, pos) => result.indexOf(item) === pos);
}

function mergeBootstrapChunk(config) {
    let result = [];
    if (Array.isArray(config.bootstrapChunk) && config.bootstrapChunk.length > 0) {
        result = result.concat(config.bootstrapChunk);
        console.log('[INFO] merge config.bootstrapChunk');
    }
    result = result.concat([path.join(config.srcPath, 'bootstrap.ts')]);
    return result.filter((item, pos) => result.indexOf(item) === pos);
}

module.exports = function (config) {
    const defaultConf = mergeBaseConfig(config);
    const polyfillChunk = mergePolyfillChunk(defaultConf);
    const styleChunk = mergeStyleChunk(defaultConf);
    const bootstrapChunk = mergeBootstrapChunk(defaultConf);
    return Object.assign({}, defaultConf, {
        polyfillChunk, styleChunk, bootstrapChunk
    });
};