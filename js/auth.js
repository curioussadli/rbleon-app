import { auth, db } from "./firebase.js";

import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const provider = new GoogleAuthProvider();

// 🔥 PENTING: paksa pilih akun (hindari auto redirect aneh)
provider.setCustomParameters({
  prompt: "select_account"
});

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      lastLogin: new Date()
    }, { merge: true });

    return user;

  } catch (error) {
    console.error("Google Login Error:", error);
    throw error;
  }
}
