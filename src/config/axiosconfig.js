import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://task-backend-4hye.onrender.com/api/v1',
  withCredentials: true,
   // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
