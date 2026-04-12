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
// GOOGLE LOGIN (REAL FIREBASE)
// =============================
import { loginWithGoogle } from "./auth.js";

import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { auth } from "./firebase.js";

const googleBtn = document.getElementById("googleLogin");

if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      await loginWithGoogle();

      // 🔥 tunggu Firebase benar-benar login
      onAuthStateChanged(auth, (user) => {
        if (user) {
          window.location.href = "dashboard.html";
        }
      });

    } catch (err) {
      console.error(err);
    }
  });
}
