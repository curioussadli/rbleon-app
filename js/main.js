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

import { auth } from "./firebase.js";
import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const googleBtn = document.getElementById("googleLogin");

// 🔥 GLOBAL LISTENER (JALAN SEKALI SAJA)
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Already logged in:", user.email);
    window.location.href = "dashboard.html";
  }
});

if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      await loginWithGoogle();

      // 🔥 kasih waktu Firebase sync session
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 300);

    } catch (err) {
      console.error(err);
    }
  });
}
