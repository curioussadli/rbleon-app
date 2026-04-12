import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

// =====================================================
// 📦 FIRESTORE MODULE (FULL TOOLS)
// =====================================================
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  onSnapshot,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// =====================================================
// ⚙️ CONFIG FIREBASE
// =====================================================
const firebaseConfig = {
  apiKey: "AIzaSyCE7nPHUvlYTlbX654Iq7pA62eNQeDmXKxY",
  authDomain: "rblite-app.firebaseapp.com",
  projectId: "rblite-app",
  storageBucket: "rblite-app.firebasestorage.app",
  messagingSenderId: "373754561853",
  appId: "1:373754561853:web:56bdc30bdfe3ccec30b154",
  measurementId: "G-WQ950MP9E9"
};


// =====================================================
// 🚀 INIT FIREBASE APP
// =====================================================
const app = initializeApp(firebaseConfig);

// koneksi database Firestore
const db = getFirestore(app);

console.log("🔥 Firebase CONNECTED OK");


// =====================================================
// 📤 EXPORT GLOBAL UNTUK SEMUA MODUL
// =====================================================
export {
  db,

  // collection tools
  collection,
  doc,

  // read
  getDocs,
  onSnapshot,

  // write
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc
};
