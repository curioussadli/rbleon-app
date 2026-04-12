// =====================================================
// 📦 MAIN JS (CLEAN VERSION)
// Fokus: PWA + Service Worker saja
// Login system SUDAH DIHAPUS
// =====================================================


// =============================
// 📦 PWA INSTALL PROMPT
// =============================
let deferredPrompt; // simpan event install PWA

window.addEventListener("beforeinstallprompt", (e) => {

  e.preventDefault(); // cegah popup otomatis install
  deferredPrompt = e; // simpan event untuk trigger manual

  console.log("PWA siap diinstall");
});


// =====================================================
// ⚙️ SERVICE WORKER (OFFLINE CACHE + AUTO UPDATE)
// =====================================================
if ("serviceWorker" in navigator) {

  navigator.serviceWorker
    .register("service-worker.js") // file service worker kamu

    .then((reg) => {

      console.log("Service Worker aktif");

      // paksa cek update saat load
      reg.update();

      // auto check update setiap 60 detik
      setInterval(() => {
        reg.update();
      }, 60000);

    })

    .catch((err) => {
      console.error("Service Worker error:", err);
    });
}


// =====================================================
// 🚀 OPTIONAL: MANUAL INSTALL BUTTON (kalau kamu pakai tombol install)
// =====================================================

// contoh kalau kamu punya tombol install di HTML:
// <button id="installBtn">Install App</button>

const installBtn = document.getElementById("installBtn");

if (installBtn) {

  installBtn.addEventListener("click", async () => {

    if (!deferredPrompt) return;

    deferredPrompt.prompt(); // munculkan dialog install

    const result = await deferredPrompt.userChoice;

    console.log("Install result:", result.outcome);

    deferredPrompt = null; // reset
  });
}