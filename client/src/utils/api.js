import axios from 'axios';

const api = axios.create({
  baseURL: 'https://exanalybackend.onrender.com',  // http://localhost:3000
                //https://exanalybackend.onrender.com

  withCredentials: true, 
});

export default api;