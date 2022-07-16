/**
 * name:
 * desc:
 * date: 2018/11/7
 * author: kelvin
 */
exports.findArg = (arg) => {
    if (process.argv.join('').indexOf(arg) > -1) {
        return process.argv[process.argv.indexOf('--' + arg) + 1];
    }
    return null;
}