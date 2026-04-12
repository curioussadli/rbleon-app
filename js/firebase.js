import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// =============================
// CONFIG
// =============================
const firebaseConfig = {
  apiKey: "AIzaSyCE7nPHUvlYTlbX654Iq7pA62eNQeDmKxY",
  authDomain: "rblite-app.firebaseapp.com",
  projectId: "rblite-app",
  storageBucket: "rblite-app.firebasestorage.app",
  messagingSenderId: "373754561853",
  appId: "1:373754561853:web:56bdc30bdfe3ccec30b154",
  measurementId: "G-WQ950MP9E9"
};

// =============================
// INIT APP
// =============================
const app = initializeApp(firebaseConfig);

// =============================
// SERVICES
// =============================
export const db = getFirestore(app);
export const auth = getAuth(app);

// 🔥 INI FIX UTAMA (ANTI LOGOUT + ANTI LOOP)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("🔥 Auth persistence aktif (LOCAL)");
  })
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });

console.log("🔥 Firebase connect OK");
