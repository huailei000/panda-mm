/**
 * name:
 * desc: 开发&联调时用到的配置信息
 * date: 2018/11/7
 * author: kelvin
 */
module.exports = {
    server: {
        target: process.env.DEPLOY == 'release' ? `http://${location.host}` : 'http://10.169.0.62:80'
    }
};
