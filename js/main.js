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
// GOOGLE LOGIN
// =============================
import { loginWithGoogle } from "./auth.js";

document.getElementById("googleLogin").addEventListener("click", async () => {
  await loginWithGoogle();
  window.location.href = "dashboard.html";
});
