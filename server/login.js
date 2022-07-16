/**
 * Created by Rayr Lee on 2018/11/28.
 */
import axios from 'axios';
// 系统默认会调用 node_modules 的目录的 services ，alias 无效
import $_conf from '../src/services/conf';

export default function (req, res) {
  axios.post(`${$_conf.auth}`, {
      username: $_conf.username,
      password: $_conf.password,
    }).then(({
      data
    }) => {
      res.cookie('access_token', data.data.access_token);
      res.end('login success！');
    });
}