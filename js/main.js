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
// GOOGLE LOGIN (REAL)
// =============================
import { loginWithGoogle } from "./auth.js";

const googleBtn = document.getElementById("googleLogin");
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      const user = await loginWithGoogle();

      localStorage.setItem("login", "true");
      localStorage.setItem("user", JSON.stringify(user));

      window.location.href = "dashboard.html";
    } catch (err) {
      console.error(err);
    }
  });
}
