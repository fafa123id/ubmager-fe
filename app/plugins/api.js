// plugins/api.ts
export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": useCookie("XSRF-TOKEN"), // ambil dari cookie yang diset Laravel
    },
    baseURL: "https://api.ubmager.bornhub.cloud",
    credentials: "include", // <== penting supaya kirim cookie
  });
  return { provide: { api } };
});
