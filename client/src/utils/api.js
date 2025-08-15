import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',  // http://localhost:3000
                //https://exanalybackend.onrender.com

  withCredentials: true, 
});

export default api;