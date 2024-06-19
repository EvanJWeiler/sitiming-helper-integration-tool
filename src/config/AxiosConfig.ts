import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8085/api',
});

export default axiosInstance;
