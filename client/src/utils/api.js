import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',  //https://travo-lg0h.onrender.com/  live hosted
  withCredentials: true, // if using cookies  //http://localhost:3000/ for development
});

export default api;