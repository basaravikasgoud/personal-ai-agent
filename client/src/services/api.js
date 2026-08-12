import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || '/api';

if (baseURL !== '/api' && !baseURL.endsWith('/api')) {
  baseURL = baseURL.replace(/\/+$/, '') + '/api';
}

const API = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token if stored locally as fallback
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('agent_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
