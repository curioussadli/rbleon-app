
import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  onSnapshot,
  collection
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// =====================================================
// 🚀 WAIT DOM READY (WAJIB SATU SAJA)
// =====================================================
document.addEventListener("DOMContentLoaded", () => {

  // =====================================================
  // 🎛️ TAB SYSTEM
  // =====================================================
  const saldoBtn = document.getElementById("saldoBtn");
  const inputBtn = document.getElementById("inputBtn");

  const saldoContent = document.getElementById("saldoContent");
  const inputContent = document.getElementById("inputContent");

  function setTab(type) {

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

  saldoBtn?.addEventListener("click", () => setTab("saldo"));
  inputBtn?.addEventListener("click", () => setTab("input"));

  setTab("saldo");


  // =====================================================
  // 🧾 FORMAT INPUT RUPIAH
  // =====================================================
  const inputAwal = document.getElementById("saldoAwalInput");
  const inputAkhir = document.getElementById("saldoAkhirInput");

  function format(el) {
    if (!el) return;

    el.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      e.target.value = new Intl.NumberFormat("id-ID").format(value);
    });
  }

  format(inputAwal);
  format(inputAkhir);


  // =====================================================
  // 💾 SAVE SALDO
  // =====================================================
  const saveBtn = document.getElementById("saveSaldoBtn");

  saveBtn?.addEventListener("click", async () => {

    const saldoAwal = parseInt((inputAwal?.value || "0").replace(/\./g, "")) || 0;
    const saldoAkhir = parseInt((inputAkhir?.value || "0").replace(/\./g, "")) || 0;

    try {
      await setDoc(doc(db, "saldo", "utama"), {
        saldoAwal,
        saldoAkhir,
        updatedAt: new Date()
      });

    } catch (err) {
      console.error(err);
    }
  });


  // =====================================================
  // 🔥 REALTIME SALDO
  // =====================================================
  const saldoRef = doc(db, "saldo", "utama");

  onSnapshot(saldoRef, (snap) => {

    if (!snap.exists()) return;

    const data = snap.data();

    const elAwal = document.getElementById("saldoAwalValue");
    const elAkhir = document.getElementById("saldoAkhirValue");

    if (elAwal) elAwal.textContent = data.saldoAwal?.toLocaleString("id-ID") || 0;
    if (elAkhir) elAkhir.textContent = data.saldoAkhir?.toLocaleString("id-ID") || 0;
  });


  // =====================================================
  // 💸 PEMASUKAN REALTIME
  // =====================================================
  const pemasukanEl = document.getElementById("pemasukanValue");

  if (pemasukanEl) {
    onSnapshot(collection(db, "penjualan"), (snap) => {

      let total = 0;

      snap.forEach((d) => {
        const data = d.data();
        if (data.type === "masuk") {
          total += Number(data.total || 0);
        }
      });

      pemasukanEl.textContent = total.toLocaleString("id-ID");
    });
  }


  // =====================================================
  // 💸 PENGELUARAN REALTIME
  // =====================================================
  const pengeluaranEl = document.getElementById("pengeluaranValue");

  if (pengeluaranEl) {
    onSnapshot(collection(db, "transaksi"), (snap) => {

      let total = 0;

      snap.forEach((d) => {
        const data = d.data();
        if (data.type === "keluar") {
          total += Number(data.nominal || 0);
        }
      });

      pengeluaranEl.textContent = total.toLocaleString("id-ID");
    });
  }

});
