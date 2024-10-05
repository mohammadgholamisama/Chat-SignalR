// lib/axiosConfig.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://chat.micapi.ir',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
