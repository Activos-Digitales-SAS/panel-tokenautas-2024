// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/', // Asegúrate de que este sea el URL de tu backend
});

export default API;
