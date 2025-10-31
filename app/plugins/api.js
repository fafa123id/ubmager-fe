import axios from 'axios';
// plugins/api.ts
export default defineNuxtPlugin(() => {
  // Set base URL untuk API Anda
  axios.defaults.baseURL = 'https://api.yourdomain.com'; // Ganti dengan URL BE Anda
  
  // PENTING: Ini memberitahu browser untuk mengirim cookie
  axios.defaults.withCredentials = true;
});
