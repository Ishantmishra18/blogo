import axios from 'axios';

const api = axios.create({
  baseURL: 'backend/api/point',  // here the  base api end point for backend will be there
  withCredentials: true, 
});

export default api;