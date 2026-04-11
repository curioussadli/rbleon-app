import { db } from "./firebase.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("btnSimpanSaldo").addEventListener("click", async () => {
  const saldoAwal = document.getElementById("saldoAwalInput").value;
  const saldoAkhir = document.getElementById("saldoAkhirInput").value;

  if (!saldoAwal || !saldoAkhir) {
    alert("Isi semua saldo!");
    return;
  }

  try {
    await setDoc(doc(db, "saldo", "utama"), {
      saldoAwal: Number(saldoAwal),
      saldoAkhir: Number(saldoAkhir),
      updatedAt: new Date()
    });

    alert("Saldo berhasil disimpan 🚀");
  } catch (error) {
    console.error("Gagal simpan saldo:", error);
  }
});