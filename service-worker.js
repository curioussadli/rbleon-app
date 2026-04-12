const CACHE_NAME = "app-cache-v3";

const FILES_TO_CACHE = [
  "/rbleon-app/",
  "/rbleon-app/index.html",
  "/rbleon-app/manifest.json",
  "/rbleon-app/css/main.css",
  "/rbleon-app/css/pesanan.css",
  "/rbleon-app/js/main.js",
  "/rbleon-app/js/pesanan.js",
  "/rbleon-app/js/dashboard.js",
  "/rbleon-app/assets/icons/icon-192.png",
  "/rbleon-app/assets/icons/icon-512.png"
];

// INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
