import axios from '@/shared/axios';

export function queryProfile() {
  return axios.get('/api/user/profile');
}

export function queryPermissions() {
  return axios.get('/api/user/permissions');
}

export function accountLogin(params) {
  return axios.post('/api/user/login', params);
}

export function accountLogout() {
  return axios.post('/api/user/logout');
}
