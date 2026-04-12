const CACHE_NAME = "rbleon-v2";

// ⚠️ jangan cache JS Firebase app terlalu agresif
const FILES_TO_CACHE = [
  "/rbleon-app/",
  "/rbleon-app/index.html",
  "/rbleon-app/manifest.json",
  "/rbleon-app/css/main.css",
  "/rbleon-app/assets/icons/icon-192.png",
  "/rbleon-app/assets/icons/icon-512.png"
];

// =====================
// INSTALL
// =====================
self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// =====================
// ACTIVATE
// =====================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// =====================
// FETCH (NETWORK FIRST for HTML)
// =====================
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // 🔥 penting: HTML selalu ambil fresh
  if (url.includes(".html") || url.endsWith("/")) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // 🔥 assets boleh cache
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
