import axios from 'axios';

const api = axios.create({
  baseURL: 'https://blogo-server.onrender.com/api',  //https://blogo-server.onrender.com/api  live hosted
  withCredentials: true, // if using cookies  //http://localhost:3000/ for development
});

export default api;