import axios from 'axios';

export const api = axios.create({
    baseURL: "http://172.16.24.82:3333",
    timeout: 700
})