import axios from '@/shared/axios';

export function queryList(params) {
  return axios.get('/api/fake/list', { params });
}
