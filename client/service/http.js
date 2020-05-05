import vm from '../main'
import axios from 'axios';
import {
  Message
} from 'element-ui';
import tokenUtil from '../utils/token'

axios.defaults.baseURL = 'http://127.0.0.1:8081';
axios.interceptors.request.use(function (conf) {
  const token = tokenUtil.getCookie('my_token');
  if (token) conf.headers['token'] = `${token}`;
  return conf;
});

//  response 拦截器
axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          console.log(vm);
          vm.$router.push({path: '/login'});
          tokenUtil.clearCookie('my_token');
          break;
        default:
          console.log(error.response);
          Message.error(error.message && error.error && error);
      }
    }
    return Promise.reject(error);
  }
);

export default axios;