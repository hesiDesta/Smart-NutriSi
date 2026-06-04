/* ════════════════════════════════════════════════════════
   NutriSi — Central API Service (menggunakan Axios)
   Base URL : /api  (proxied ke http://localhost:5000)
   Auth     : Bearer token (userId) di localStorage
   ════════════════════════════════════════════════════════ */

import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('nutrisi_token');

/* Buat instance Axios dengan konfigurasi default */
const axiosInstance = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true'
  },
});

/* Request interceptor: otomatis tambahkan token Authorization */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* Response interceptor: normalisasi error menjadi pesan yang ramah */
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      throw new Error('Tidak bisa terhubung ke server. Pastikan backend berjalan.');
    }
    
    let message = `Error ${error.response.status}`;
    const responseData = error.response.data;
    
    if (responseData) {
      if (typeof responseData === 'string') {
        message = responseData;
      } else if (typeof responseData === 'object') {
        if (responseData.error) {
          if (typeof responseData.error === 'string') {
            message = responseData.error;
          } else if (typeof responseData.error === 'object') {
            message = responseData.error.message || responseData.error.error || JSON.stringify(responseData.error);
          }
        } else if (responseData.message) {
          message = responseData.message;
        }
      }
    }
    
    throw new Error(message);
  }
);

export const api = {
  /* ── AUTH ─────────────────────────────────── */
  register: (username, password, parentName) =>
    axiosInstance.post('/auth/register', { username, password, parentName }),

  login: (username, password) =>
    axiosInstance.post('/auth/login', { username, password }),

  personalize: (profile) =>
    axiosInstance.post('/auth/personalize', profile),

  getProfile: () =>
    axiosInstance.get('/auth/profile'),

  /* ── FOODS ────────────────────────────────── */
  searchFoods: (query = '', limit = 60) =>
    axiosInstance.get('/foods', { params: { query, limit } }),

  getFoodByCode: (code) =>
    axiosInstance.get(`/foods/${encodeURIComponent(code)}`),

  /* ── LOGS ─────────────────────────────────── */
  getLogsByDate: (date) =>
    axiosInstance.get('/logs', { params: { date } }),

  createLog: ({ date, mealType, foodCode, gram }) =>
    axiosInstance.post('/logs', { date, mealType, foodCode, gram }),

  deleteLog: (id) =>
    axiosInstance.delete(`/logs/${id}`),

  getHistory: () =>
    axiosInstance.get('/logs/history'),

  /* ── RECOMMENDATIONS ─────────────────────── */
  getRecommendations: (date) =>
    axiosInstance.get('/recommendations', { params: { date } }),

  generateMenu: (ingredients) =>
    axiosInstance.post('/recommendations/generate-menu', { ingredients }),

  predictSingle: (food) =>
    axiosInstance.post('/recommendations/predict-single', { food }),
};

/* Helper: format tanggal ke YYYY-MM-DD */
export const toDateKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

