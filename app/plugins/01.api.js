import axios from "axios";
import { useAuth } from "~/composables/useAuth";

export default defineNuxtPlugin(async (nuxtApp) => {
  const { _clearAuth, token } = useAuth();

  const ssrHeaders = {"Accept":"application/json"};
  if (process.server) {
    const requestHeaders = useRequestHeaders(["cookie"]);
    if (requestHeaders.cookie) {
      ssrHeaders.cookie = requestHeaders.cookie;
    }
  }
  const api = axios.create({
    baseURL: "https://api.ubmager.bornhub.cloud",
    headers: ssrHeaders,
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
