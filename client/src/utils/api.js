import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,  // http://localhost:3000
                //https://exanalybackend.onrender.com

  withCredentials: true, 
});

export default api;