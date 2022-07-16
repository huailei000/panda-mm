import proxy from 'http-proxy-middleware';
import http from 'http';
import chalk from 'chalk';

const webpack = require('webpack')
const url = require('url');
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('../config/webpack.config.dev.js')

const path = require('path');

const helper = require('./helper');
const CONFIG = require('./devConf');

const TARGET = helper.findArg('target') || CONFIG.server.target;
const PORT = Number(helper.findArg('port')) || 9100;
const HOST = helper.findArg('host') || '127.0.0.1';

const devURL = `http://${HOST}:${PORT}`;
const urlParts = url.parse(devURL);

const app = new(require('express'))()

const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    stats: {
        colors: true,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false,
        modules: false,
        children: false,
        version: false,
        cached: false,
        cachedAssets: false,
        reasons: false,
        source: false,
        errorDetails: false
    }

}))

app.use(webpackHotMiddleware(compiler))

app.use('/api', proxy({
    target: `http://${TARGET}`,
    changeOrigin: false
}));

app.use('/login', require('./login'));

app.get('*', function (req, res, next) {

    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (error, result) => {
        if (error) {
            next(error);
        } else {
            res.end(result);
        }
    });
})

const server = http.createServer(app);

server.listen(urlParts.port, function (error) {
    if (error) {
        console.error(error)
    } else {
        console.info(chalk.white(`项目接口代理地址：${TARGET}`))
        console.info(chalk.cyan(`项目启动，访问地址：${devURL}`))
    }
})