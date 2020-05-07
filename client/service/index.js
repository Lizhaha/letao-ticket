import http from './http';
// import config from '@/config';

// export function authorize(data) {
//   return http.post(`${config.BASEURI}/oauth/token`, data);
// }

export function validate() {
  return http.get('/validate');
}

export function cinemaMsg() {
  return http.get('/cinema');
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

export function getCommentList(params) {
  return http.get('/movie/comment', params);
}

export function wantLook(params) {
  return http.put('/movie/wantLook', params);
}

export function submitGrade(params) {
  return http.post('/movie/grading', params);
}

export function getSchedule(params) {
  return http.get('/movie/schedule', params);
}

export function getUserSelect(params) {
  return http.get('/movie/select', params);
}

export function getSelectedSeat(params) {
  return http.get('/order/seat', params);
}