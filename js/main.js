// =====================================================
// 📦 MAIN JS (PWA CORE ONLY - CLEAN VERSION)
// Tidak ada login, tidak ada business logic
// =====================================================


// =====================================================
// 📦 PWA INSTALL PROMPT HANDLER
// =====================================================
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {

  e.preventDefault(); // cegah popup otomatis install
  deferredPrompt = e; // simpan event install

  // log debug (hapus kalau production)
  console.log("📦 PWA install available");
});


// =====================================================
// ⚙️ SERVICE WORKER REGISTER
// =====================================================
if ("serviceWorker" in navigator) {

  window.addEventListener("load", () => {

    navigator.serviceWorker
      .register("/service-worker.js") // 🔥 pakai root path biar aman

      .then((reg) => {

        console.log("🔥 Service Worker registered");

        // paksa cek update awal
        reg.update();

        // auto update checker
        setInterval(() => {
          reg.update();
        }, 60000);

      })

      .catch((err) => {
        console.error("❌ Service Worker error:", err);
      });
  });
}


// =====================================================
// 🚀 OPTIONAL INSTALL BUTTON HANDLER
// =====================================================
const installBtn = document.getElementById("installBtn");

if (installBtn) {

  installBtn.addEventListener("click", async () => {

    if (!deferredPrompt) {
      console.log("⚠️ Install prompt not ready");
      return;
    }

    deferredPrompt.prompt();

    const result = await deferredPrompt.userChoice;

    console.log("📦 Install result:", result.outcome);

    deferredPrompt = null;
  });
}
