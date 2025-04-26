import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8080/api' // Spring backend port
    : 'https://your-production-api.com/api',
});

export default api;