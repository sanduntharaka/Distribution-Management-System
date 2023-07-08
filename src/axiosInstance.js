import axios from 'axios';
//back.ditributor.codesolusions.online
//http://localhost:8000
// https://main.bixtonlighting.com
const baseURL = '//http://localhost:8000/';

export const axiosInstance = axios.create({
  baseURL: baseURL + 'api',
  timeout: 5000,
  headers: {
    // Authorization: 'JWT ' + sessionStorage.getItem('access'),
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const axiosLoginInstance = axios.create({
  baseURL: baseURL + 'auth',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
