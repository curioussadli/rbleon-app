// =====================================================
// 🔐 AUTH GUARD (WAJIB PALING ATAS)
// =====================================================
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  onSnapshot,
  collection
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ⛔ STOP ACCESS JIKA BELUM LOGIN
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    console.log("Login OK:", user.email);
  }
});


// =====================================================
// 🎛️ TAB ELEMENT
// =====================================================
const saldoBtn = document.getElementById("saldoBtn");
const inputBtn = document.getElementById("inputBtn");

const saldoContent = document.getElementById("saldoContent");
const inputContent = document.getElementById("inputContent");

function setActiveTab(type) {
  if (!saldoBtn || !inputBtn || !saldoContent || !inputContent) return;

  saldoBtn.classList.remove("active");
  inputBtn.classList.remove("active");

  saldoContent.style.display = "none";
  inputContent.style.display = "none";

  if (type === "saldo") {
    saldoBtn.classList.add("active");
    saldoContent.style.display = "block";
  } else {
    inputBtn.classList.add("active");
    inputContent.style.display = "block";
  }
}

if (saldoBtn && inputBtn) {
  saldoBtn.addEventListener("click", () => setActiveTab("saldo"));
  inputBtn.addEventListener("click", () => setActiveTab("input"));

  setActiveTab("saldo");
}


// =====================================================
// 💰 FORMAT INPUT
// =====================================================
function formatInput(el) {
  if (!el) return;

  el.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    e.target.value = new Intl.NumberFormat("id-ID").format(value);
  });
}

formatInput(document.getElementById("saldoAwalInput"));
formatInput(document.getElementById("saldoAkhirInput"));


// =====================================================
// 💾 SIMPAN SALDO
// =====================================================
const inputAwal = document.getElementById("saldoAwalInput");
const inputAkhir = document.getElementById("saldoAkhirInput");

async function saveSaldo() {
  const saldoAwal = parseInt((inputAwal?.value || "0").replace(/\./g, "")) || 0;
  const saldoAkhir = parseInt((inputAkhir?.value || "0").replace(/\./g, "")) || 0;

  try {
    await setDoc(doc(db, "saldo", "utama"), {
      saldoAwal,
      saldoAkhir,
      updatedAt: new Date()
    });

    alert("Saldo berhasil disimpan 🚀");
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("saveSaldoBtn")?.addEventListener("click", saveSaldo);
document.getElementById("saveSaldoAkhirBtn")?.addEventListener("click", saveSaldo);


// =====================================================
// 🔥 REALTIME SALDO
// =====================================================
onSnapshot(doc(db, "saldo", "utama"), (snap) => {
  if (!snap.exists()) return;

  const data = snap.data();

  document.getElementById("saldoAwal")?.textContent =
    new Intl.NumberFormat("id-ID").format(data.saldoAwal || 0);

  document.getElementById("saldoAkhir")?.textContent =
    new Intl.NumberFormat("id-ID").format(data.saldoAkhir || 0);
});


// =====================================================
// 💸 PENGELUARAN REALTIME
// =====================================================
onSnapshot(collection(db, "transaksi"), (snapshot) => {
  let total = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.type === "keluar") {
      total += Number(data.nominal || 0);
    }
  });

  document.getElementById("pengeluaranValue")?.textContent =
    total.toLocaleString("id-ID");
});


// =====================================================
// 💰 PEMASUKAN REALTIME
// =====================================================
onSnapshot(collection(db, "penjualan"), (snapshot) => {
  let total = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.type === "masuk") {
      total += Number(data.total || 0);
    }
  });

  document.getElementById("pemasukanValue")?.textContent =
    total.toLocaleString("id-ID");
});
