// =====================================================
// 🔥 FIREBASE IMPORT (WAJIB DI PALING ATAS)
// =====================================================
import { db } from "./firebase.js"; // koneksi firebase

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// =====================================================
// 🎛️ TAB SYSTEM (MASUK / KELUAR)
// =====================================================

// ambil tombol tab
const masukBtn = document.getElementById("masukBtn");     // tombol masuk
const keluarBtn = document.getElementById("keluarBtn");   // tombol keluar

// ambil container tab
const masukContent = document.getElementById("masukContent");   // isi masuk
const keluarContent = document.getElementById("keluarContent"); // isi keluar


// fungsi ganti tab
function setActiveTab(type) {

  // safety check biar tidak error
  if (!masukBtn || !keluarBtn || !masukContent || !keluarContent) return;

  if (type === "masuk") {

    // aktifkan tab masuk
    masukBtn.classList.add("active");
    keluarBtn.classList.remove("active");

    // tampilkan masuk
    masukContent.style.display = "block";
    keluarContent.style.display = "none";

  } else {

    // aktifkan tab keluar
    keluarBtn.classList.add("active");
    masukBtn.classList.remove("active");

    // tampilkan keluar
    keluarContent.style.display = "block";
    masukContent.style.display = "none";
  }
}


// event tab click (aman setelah DOM ready)
document.addEventListener("DOMContentLoaded", () => {

  if (masukBtn) {
    masukBtn.addEventListener("click", () => setActiveTab("masuk"));
  }

  if (keluarBtn) {
    keluarBtn.addEventListener("click", () => setActiveTab("keluar"));
  }

  // default tab
  setActiveTab("masuk");
});


// =====================================================
// 📦 STATE TRANSAKSI (FIREBASE ONLY)
// =====================================================
let transaksi = []; // data dari firebase

const listEl = document.getElementById("transaksiList");


// =====================================================
// ➕ TAMBAH TRANSAKSI (FIREBASE)
// =====================================================
async function tambahTransaksi(keterangan, nominal) {

  try {

    await addDoc(collection(db, "transaksi"), {

      type: "keluar",          // jenis transaksi
      keterangan,              // deskripsi
      nominal,                 // angka
      createdAt: new Date()    // waktu

    });

  } catch (err) {
    console.error("❌ Gagal simpan transaksi:", err);
  }
}


// =====================================================
// ❌ HAPUS TRANSAKSI (FIREBASE)
// =====================================================
window.hapusTransaksi = async function (id) {

  try {

    await deleteDoc(doc(db, "transaksi", id));

  } catch (err) {
    console.error("❌ Gagal hapus:", err);
  }
};


// =====================================================
// 🔄 REALTIME LISTENER FIREBASE
// =====================================================
const q = query(
  collection(db, "transaksi"),
  orderBy("createdAt", "desc")
);

onSnapshot(q, (snapshot) => {

  transaksi = [];

  snapshot.forEach((docItem) => {

    transaksi.push({
      id: docItem.id,
      ...docItem.data()
    });

  });

  renderTransaksi();      // update UI
  updateDashboardTotal(); // update dashboard
});


// =====================================================
// 🧾 RENDER TRANSAKSI KE UI
// =====================================================
function renderTransaksi() {

  if (!listEl) return;

  listEl.innerHTML = "";

  transaksi.forEach((item) => {

    const div = document.createElement("div");
    div.classList.add("rincian-item");

    div.innerHTML = `
      <span class="rincian-desc">${item.keterangan}</span>

      <span class="rincian-nominal">
        ${item.nominal.toLocaleString("id-ID")}
      </span>

      <button class="delete-btn" onclick="hapusTransaksi('${item.id}')">
        ✕
      </button>
    `;

    listEl.appendChild(div);
  });
}


// =====================================================
// 📊 HITUNG TOTAL PENGELUARAN (DASHBOARD)
// =====================================================
function updateDashboardTotal() {

  let total = 0;

  transaksi.forEach(item => {
    total += item.nominal;
  });

  const el = document.getElementById("pengeluaranValue");

  if (el) {
    el.textContent = total.toLocaleString("id-ID");
  }
}


// =====================================================
// 💾 EVENT SIMPAN TRANSAKSI
// =====================================================
document.addEventListener("DOMContentLoaded", () => {

  const saveBtn = document.getElementById("saveSaldoBtn");

  if (!saveBtn) return;

  saveBtn.addEventListener("click", async () => {

    // ambil nominal
    const nominal = parseInt(
      document.getElementById("saldoAwalInput")?.value.replace(/\./g, "")
    ) || 0;

    // ambil keterangan
    const keterangan = document.getElementById("keteranganInput")?.value;

    // validasi
    if (!keterangan || nominal <= 0) return;

    // kirim ke firebase
    await tambahTransaksi(keterangan, nominal);

    // reset input
    document.getElementById("saldoAwalInput").value = "";
    document.getElementById("keteranganInput").value = "";
  });

});






