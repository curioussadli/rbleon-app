import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const app = initializeApp({
  apiKey: "AIzaSyCE7nPHUvlYTlbX654Iq7pA62eNQeDmKxY",
  authDomain: "rblite-app.firebaseapp.com",
  projectId: "rblite-app",
  appId: "1:373754561853:web:56bdc30bdfe3ccec30b154",
});

export const auth = getAuth(app);
export const db = getFirestore(app);
