import axios from 'axios';

const api = axios.create({
    baseURL: 'backend-production-81ff.up.railway.app',
});

export default api;
