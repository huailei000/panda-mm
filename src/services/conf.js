let host = 'localhost:9008';
let username = 'panda@megvii.com';
let password = '123456';

// let host = '10.169.0.143'
// let username = 'lxj@megvii.com'
// let password = '123456'

host = process.env.DEPLOY == 'release' ? window.location.host : host;

export default {
    preLoadAddr: `http://${host}`,
    login: process.env.DEPLOY == 'release' ? '/auth/login' : '/login',
    auth: `http://${host}/api/v1/auth`,
    username,
    password
};
