// =============================
// PWA INSTALL PROMPT
// =============================
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log("PWA bisa diinstall!");
});


// =============================
// SERVICE WORKER
// =============================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/rbleon-app/service-worker.js")
    .then((reg) => {
      reg.update();

      setInterval(() => {
        reg.update();
      }, 60000);
    });
}


// =============================
// LOGIN GOOGLE (ONLY 1 VERSION)
// =============================
import { loginWithGoogle } from "./auth.js";

const btn = document.getElementById("googleLogin");

if (btn) {
  btn.onclick = async () => {
    try {
      btn.disabled = true;
      document.body.classList.add("loading");

      await loginWithGoogle();

      // 🔥 pakai replace biar tidak back loop
      window.location.replace("dashboard.html");

    } catch (e) {
      console.log(e);
      btn.disabled = false;
      document.body.classList.remove("loading");
    }
  };
}
