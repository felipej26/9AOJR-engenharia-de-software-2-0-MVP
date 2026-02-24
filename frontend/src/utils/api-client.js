import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
