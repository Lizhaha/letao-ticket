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

export function submitOrder(params) {
  return http.post('/order/submit', params);
}

export function orderList(params) {
  return http.get('/order/list', params);
}

export function editPersonalMsg(params) {
  return http.put('/user/edit', params);
}

export function allUser(params) {
  return http.get('/user/allUser', params);
}

export function allMovie(params) {
  return http.get('/movie/allMovie', params);
}

export function allRoom(params) {
  return http.get('/movie/allRoom', params);
}

export function allSchedule(params) {
  return http.get('/movie/allSchedule', params);
}

export function wantLookList(params) {
  return http.get('/movie/wantLook', params);
}

export function changeRole(params) {
  return http.put('/user/changeRole', params);
}

export function deleteUser(params) {
  return http.put('/user/deleteUser', params);
}

export function deleteMovie(params) {
  return http.put('/movie/deleteMovie', params);
}

export function deleteRoom(params) {
  return http.put('/movie/deleteRoom', params);
}

export function deleteSchedule(params) {
  return http.put('/movie/deleteSchedule', params);
}

export function addOperate(params) {
  return http.post('/movie/add', params);
}