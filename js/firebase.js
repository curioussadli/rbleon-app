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



import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "XXX",
  authDomain: "XXX",
  projectId: "XXX",
  storageBucket: "XXX",
  messagingSenderId: "XXX",
  appId: "XXX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { auth, db } from "./firebase.js";

const provider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, provider);

  const user = result.user;

  // 🔥 SIMPAN KE FIRESTORE
  await setDoc(doc(db, "users", user.uid), {
    name: user.displayName,
    email: user.email,
    photo: user.photoURL,
    lastLogin: new Date()
  }, { merge: true });

  return user;
}
