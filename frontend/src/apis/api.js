import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000', // Update with your backend's URL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
