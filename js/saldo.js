import { db } from "./firebase.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("btnSimpanSaldo");

  if (!btn) return;

  btn.addEventListener("click", async () => {

    const saldoAwalRaw = document.getElementById("saldoAwalInput")?.value || "0";
    const saldoAkhirRaw = document.getElementById("saldoAkhirInput")?.value || "0";

    // 🔥 bersihkan format ribuan (1.000.000 → 1000000)
    const saldoAwal = parseInt(saldoAwalRaw.replace(/\./g, "")) || 0;
    const saldoAkhir = parseInt(saldoAkhirRaw.replace(/\./g, "")) || 0;

    if (saldoAwal === 0 && saldoAkhir === 0) {
      alert("Isi semua saldo!");
      return;
    }

    try {
      await setDoc(doc(db, "saldo", "utama"), {
        saldoAwal,
        saldoAkhir,
        updatedAt: new Date()
      });

      alert("✔ Saldo berhasil disimpan");

    } catch (error) {
      console.error("❌ Gagal simpan saldo:", error);
    }

  });

});
