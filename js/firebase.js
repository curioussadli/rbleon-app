import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// =============================
// CONFIG FIREBASE
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
// INIT FIREBASE
// =============================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("🔥 Firebase connect OK");

// =============================
// EXPORT YANG DIPAKAI APP
// =============================
export { db, collection, onSnapshot, addDoc };


import { getAuth, GoogleAuthProvider, signInWithPopup } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const auth = getAuth();
const provider = new GoogleAuthProvider();

export function loginWithGoogle() {
  return signInWithPopup(auth, provider);
}

