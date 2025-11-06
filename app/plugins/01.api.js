import axios from "axios";
import { useAuth } from "~/composables/useAuth";

export default defineNuxtPlugin(async (nuxtApp) => {
  const { _clearAuth, token } = useAuth();
  
  const api = axios.create({
    baseURL: "https://api.ubmager.bornhub.cloud",
    headers: {
      Accept: "application/json",
    },
    withCredentials: true,
  });

  if (token().value) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token().value}`;
  }

  return {
    provide: {
      api: api,
    },
  };
});
