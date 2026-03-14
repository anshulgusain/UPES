import axios from 'axios';

const API = axios.create({ 
  baseURL: 'http://upes-be.onrender.com/api'  // 👈 change this
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('upes_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (sapId, password) => API.post('/auth/login', { sapId, password });
export const getProfile = () => API.get('/student/profile');
export const getDocuments = () => API.get('/student/documents');
export const getFeeReceipts = () => API.get('/student/fee-receipts');

export default API;
