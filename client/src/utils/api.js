import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',  // here the  base api end point for backend will be there
  withCredentials: true, 
});

export default api;