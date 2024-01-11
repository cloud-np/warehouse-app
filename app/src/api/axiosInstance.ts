import axios from 'axios';

export const serverAxios = axios.create({
    // Server API url
    baseURL: "http://localhost:3000/api"
});
