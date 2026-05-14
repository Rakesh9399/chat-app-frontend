import axios from 'axios';

export const baseURL = 'https://chat-app-backend-r0mi.onrender.com';
export const httpClient = axios.create({
    baseURL: baseURL,
});