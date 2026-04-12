const CACHE_NAME = "rbleon-v3";

// =====================================================
// 📦 FILE CACHE (RELATIVE PATH - LEBIH AMAN)
// =====================================================
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/main.css",
  "./js/main.js",
  "./js/dashboard.js",
  "./assets/icons/icon-192.png"
];


// =====================================================
// 📥 INSTALL EVENT
// =====================================================
self.addEventListener("install", (event) => {

  self.skipWaiting(); // langsung aktif

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {

        // pakai addAll tapi dibungkus biar tidak gagal total
        return Promise.allSettled(
          FILES_TO_CACHE.map((file) => cache.add(file))
        );
      })
  );
});


// =====================================================
// ♻️ ACTIVATE EVENT (CLEAN OLD CACHE)
// =====================================================
self.addEventListener("activate", (event) => {

  event.waitUntil(
    caches.keys().then((keys) => {

      return Promise.all(
        keys.map((key) => {

          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }

        })
      );

    })
  );

  self.clients.claim();
});


// =====================================================
// 🌐 FETCH STRATEGY (NETWORK FIRST + CACHE FALLBACK)
// =====================================================
self.addEventListener("fetch", (event) => {

  const req = event.request;

  event.respondWith(
    fetch(req)
      .then((res) => {

        // simpan ke cache kalau berhasil
        const resClone = res.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(req, resClone);
        });

        return res;
      })
      .catch(() => {

        // fallback ke cache kalau offline
        return caches.match(req);

      })
  );
});
