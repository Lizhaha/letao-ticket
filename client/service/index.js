import http from './http';
// import config from '@/config';

// export function authorize(data) {
//   return http.post(`${config.BASEURI}/oauth/token`, data);
// }

export function validate() {
  return http.get('/validate');
}

export function updateMemberInfo(params) {
  return http.post('/UpdateUserInfo', params);
}

export function clearSeat(params) {
  return http.post('/ClearUserSeatInfo', params);
}

export function createManager(params) {
  return http.post('/AddManager', params);
}

export function deleteManager(params) {
  return http.post('/DeleteManager', params);
}