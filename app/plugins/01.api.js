import axios from 'axios';
import { useAuth } from '~/composables/useAuth'; 

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const {_clearAuth, logout} = useAuth();
  const passportClientId = runtimeConfig.public.passportClientId;
  const passportClientSecret = runtimeConfig.public.passportClientSecret;

  const api = axios.create({
    baseURL: 'https://api.ubmager.bornhub.cloud',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  });

  const initialToken = useCookie('auth_token');
  if (initialToken.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${initialToken.value}`;
  }

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/oauth/token') {
        
        originalRequest._retry = true; 

        const { token, refreshToken } = useAuth(); 

        if (!refreshToken.value) {
          _clearAuth();
          navigateTo('/');
          return Promise.reject(error);
        }

        try {
          console.log('Interceptor: Access token expired. Refreshing token...');
          
          const response = await api.post('/oauth/token', {
            grant_type: 'refresh_token',
            refresh_token: refreshToken.value,
            client_id: passportClientId,
            client_secret: passportClientSecret,
            scope: '',
          });

          const newAccessToken = response.data.access_token;
          const newRefreshToken = response.data.refresh_token;

          token.value = newAccessToken;
          refreshToken.value = newRefreshToken;

          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          return api(originalRequest);

        } catch (refreshError) {
          console.error('Interceptor: Gagal refresh token. Logout.', refreshError);
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