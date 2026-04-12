const CACHE_NAME = "rbleon-v3";

const FILES_TO_CACHE = [
  "/rbleon-app/",
  "/rbleon-app/index.html",
  "/rbleon-app/manifest.json",
  "/rbleon-app/css/main.css",
  "/rbleon-app/js/main.js",
  "/rbleon-app/js/dashboard.js",
  "/rbleon-app/assets/icons/icon-192.png"
];

// INSTALL
self.addEventListener("install", (event) => {
  self.skipWaiting(); // 🔥 langsung aktif
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

// ACTIVATE (hapus cache lama)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

// FETCH (network first untuk HTML)
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  if (url.includes(".html") || url.endsWith("/")) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});
