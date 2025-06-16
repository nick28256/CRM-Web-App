import axios from 'axios';

// Schimbă adresa IP dacă testezi pe telefon
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export default api;
