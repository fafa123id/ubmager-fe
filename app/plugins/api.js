// plugins/api.ts
import axios from 'axios';

export default defineNuxtPlugin(() => {
  const api = axios.create({
    baseURL: 'https://api.ubmager.bornhub.cloud',
    // Kita TIDAK SET 'withCredentials' lagi. Tidak perlu.
    // withCredentials: true, 
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
  });

  return {
    provide: {
      api: api,
    },
  };
});