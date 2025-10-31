// plugins/api.ts
import axios from 'axios';

export default defineNuxtPlugin(() => {
  // Buat instance axios yang sudah terkonfigurasi
  const api = axios.create({
    baseURL: 'https://api.ubmager.bornhub.cloud',
    withCredentials: true,
  });

  // Sediakan instance itu ke aplikasi Nuxt
  // Sekarang kamu bisa akses via useNuxtApp().$api
  return {
    provide: {
      api: api,
    },
  };
});