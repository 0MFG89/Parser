import axios from 'axios';

export const API_URL = 'http://localhost:5001/api';

const $contentApi = axios.create({
   withCredentials:true,
   baseURL: API_URL
});

export default $contentApi;
