import {
  db,
  doc,
  setDoc
} from "./firebase.js";


// =====================================================
// 🎛️ TAB SYSTEM (AMAN)
// =====================================================
document.addEventListener("DOMContentLoaded", () => {

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

  saldoBtn?.addEventListener("click", () => setActiveTab("saldo"));
  inputBtn?.addEventListener("click", () => setActiveTab("input"));

  setActiveTab("saldo");


  // =====================================================
  // 🧾 INPUT SALDO (SAFE)
  // =====================================================
  const inputAwal = document.getElementById("saldoAwalInput");
  const inputAkhir = document.getElementById("saldoAkhirInput");

  function formatInput(el) {
    if (!el) return;

    el.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      e.target.value = new Intl.NumberFormat("id-ID").format(value);
    });
  }

  formatInput(inputAwal);
  formatInput(inputAkhir);


  // =====================================================
  // 💾 SAVE SALDO (FIXED)
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

      alert("✔ Saldo berhasil disimpan");

    } catch (err) {
      console.error("❌ Error simpan saldo:", err);
    }
  });

});
