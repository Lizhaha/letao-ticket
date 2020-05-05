import http from './http';
// import config from '@/config';

// export function authorize(data) {
//   return http.post(`${config.BASEURI}/oauth/token`, data);
// }

export function validate() {
  return http.get('/validate');
}

export function login(params) {
  return http.post('/user/login', params);
}

export function register(params) {
  return http.post('/user/register', params);
}

export function getUserInfo(params) {
  return http.get('/user/userInfo', params);
}

export function getMovieList(params) {
  return http.get('/movie/list', params);
}

export function searchMovie(params) {
  return http.get('/movie/search', params);
}

export function getDetail(params) {
  return http.get('/movie/detail', params);
}

export function wantLook(params) {
  return http.put('/movie/wantLook', params);
}