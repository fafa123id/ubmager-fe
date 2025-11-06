import axios from 'axios';
import { useAuth } from '~/composables/useAuth'; 

export default defineNuxtPlugin((nuxtApp) => {
  const {_clearAuth, logout, token, PAT} = useAuth();

  const api = axios.create({
    baseURL: 'https://api.ubmager.bornhub.cloud',
    headers: {
      'Accept': 'application/json',
    },
    withCredentials: true,
  });
  if (PAT.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${PAT.value}`;
  }
  else if (token.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  }

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/api/refresh') {
        
        originalRequest._retry = true; 

        const { token } = useAuth();

        try {
          console.log('Interceptor: Access token expired. Refreshing token...');
          
          const response = await api.post('/api/refresh');

          const newAccessToken = response.data.access_token;

          token.value = newAccessToken;

          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          return api(originalRequest);

        } catch (refreshError) {
          console.error('Interceptor: Gagal refresh token. Logout.', refreshError);
          _clearAuth();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return {
    provide: {
      api: api,
    },
  };
});