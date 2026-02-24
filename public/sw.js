const CACHE = "ubmager-runtime-v1";

// install
self.addEventListener("install", () => {
  self.skipWaiting();
});

// activate
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// cache homepage runtime
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // cache homepage SSR runtime
  if (url.pathname === "/") {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((cache) => cache.put("/", clone));
          return res;
        })
        .catch(() => caches.match("/"))
    );
    return;
  }

  // cache API runtime
  if (url.hostname === "dev-api.ubmager.shop") {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
  }
});