import axios from 'axios';

const api = axios.create({
    baseURL: 'https://your-fastapi-app.up.railway.app',
});

export default api;
