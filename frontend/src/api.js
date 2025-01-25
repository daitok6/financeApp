import axios from 'axios';

const api = axios.create({
    baseURL: 'financeapp.railway.internal',
});

export default api;
