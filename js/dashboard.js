// =====================================================
// 🔥 FIREBASE INIT (DARI firebase.js)
// =====================================================
import { db } from "./firebase.js";
import { doc, setDoc, onSnapshot, collection } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";




// =====================================================
// 🎛️ TAB ELEMENT
// =====================================================
const saldoBtn = document.getElementById("saldoBtn");
const inputBtn = document.getElementById("inputBtn");

const saldoContent = document.getElementById("saldoContent");
const inputContent = document.getElementById("inputContent");


// =====================================================
// 🔄 TAB CONTROLLER
// =====================================================
function setActiveTab(type) {
  if (!saldoBtn || !inputBtn || !saldoContent || !inputContent) return;

  if (type === "saldo") {
    saldoBtn.classList.add("active");
    inputBtn.classList.remove("active");

    saldoContent.style.display = "block";
    inputContent.style.display = "none";

  } else {
    inputBtn.classList.add("active");
    saldoBtn.classList.remove("active");

    inputContent.style.display = "block";
    saldoContent.style.display = "none";
  }
}


// =====================================================
// 🎯 EVENT TAB CLICK
// =====================================================
document.addEventListener("DOMContentLoaded", () => {

  const saldoBtn = document.getElementById("saldoBtn");
  const inputBtn = document.getElementById("inputBtn");

  if (saldoBtn) {
    saldoBtn.addEventListener("click", () => setActiveTab("saldo"));
  }

  if (inputBtn) {
    inputBtn.addEventListener("click", () => setActiveTab("input"));
  }

  // default tab
  setActiveTab("saldo");
});


// =====================================================
// 💰 FORMAT INPUT SALDO
// =====================================================
const inputAwal = document.getElementById("saldoAwalInput");
if (inputAwal) {
  inputAwal.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    e.target.value = new Intl.NumberFormat("id-ID").format(value);
  });
}

const inputAkhir = document.getElementById("saldoAkhirInput");
if (inputAkhir) {
  inputAkhir.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    e.target.value = new Intl.NumberFormat("id-ID").format(value);
  });
}


// =====================================================
// 💾 SIMPAN SALDO KE FIREBASE
// =====================================================
const saveBtn = document.getElementById("saveSaldoBtn");
const saveAkhirBtn = document.getElementById("saveSaldoAkhirBtn");

async function saveSaldoToFirebase() {

  const saldoAwal =
    parseInt((inputAwal?.value || "0").replace(/\./g, "")) || 0;

  const saldoAkhir =
    parseInt((inputAkhir?.value || "0").replace(/\./g, "")) || 0;

  try {
    await setDoc(doc(db, "saldo", "utama"), {
      saldoAwal,
      saldoAkhir,
      updatedAt: new Date()
    });

    alert("Saldo berhasil disimpan 🚀");

  } catch (err) {
    console.error("Gagal simpan saldo:", err);
  }
}

if (saveBtn) saveBtn.addEventListener("click", saveSaldoToFirebase);
if (saveAkhirBtn) saveAkhirBtn.addEventListener("click", saveSaldoToFirebase);


// =====================================================
// 🔥 REALTIME SALDO (DASHBOARD)
// =====================================================
const saldoRef = doc(db, "saldo", "utama");

onSnapshot(saldoRef, (snap) => {

  if (!snap.exists()) return;

  const data = snap.data();

  const elAwal = document.getElementById("saldoAwal");
  if (elAwal) {
    elAwal.textContent =
      new Intl.NumberFormat("id-ID").format(data.saldoAwal || 0);
  }

  const elAkhir = document.getElementById("saldoAkhir");
  if (elAkhir) {
    elAkhir.textContent =
      new Intl.NumberFormat("id-ID").format(data.saldoAkhir || 0);
  }
});


// =====================================================
// 💸 REALTIME PENGELUARAN (FIX UTAMA)
// =====================================================
function listenPengeluaran(db) {

  const colRef = collection(db, "transaksi");

  onSnapshot(colRef, (snapshot) => {

    let totalKeluar = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();

      // 🔥 SESUAI FIREBASE KAMU
      if (data.type === "keluar") {
        totalKeluar += Number(data.nominal || 0);
      }
    });

    const pengeluaranEl = document.getElementById("pengeluaranValue");

    if (pengeluaranEl) {
      pengeluaranEl.textContent =
        totalKeluar.toLocaleString("id-ID");
    }
  });
}


// =====================================================
// 🚀 START LISTENER
// =====================================================
listenPengeluaran(db);






document.addEventListener("DOMContentLoaded", () => {

  // =============================
  // 💰 REALTIME TOTAL PEMASUKAN
  // =============================
  const pemasukanEl = document.getElementById("pemasukanValue");

  if (!pemasukanEl) {
    console.warn("pemasukanValue tidak ditemukan");
    return;
  }

  onSnapshot(collection(db, "penjualan"), (snapshot) => {

    let totalMasuk = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();

      if (data.type === "masuk") {
        totalMasuk += Number(data.total || 0);
      }
    });

    pemasukanEl.textContent = totalMasuk.toLocaleString("id-ID");
  });

});
