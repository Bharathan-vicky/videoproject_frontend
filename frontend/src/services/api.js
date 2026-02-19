import axios from 'axios';

const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8000'
  : 'https://bharathan56-citnow-backend.hf.space';
const api = axios.create({ baseURL: API_BASE });

// Dynamically attach token from context
export const setAuthToken = (token) => {
  // clear any old interceptors to avoid duplicates
  api.interceptors.request.handlers = [];
  api.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

export { API_BASE };
export default api;
