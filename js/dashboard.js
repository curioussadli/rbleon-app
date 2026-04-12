// =====================================================
// 📦 IMPORT FIREBASE (WAJIB)
// =====================================================
import {
  db,
  doc,
  setDoc,
  collection,
  onSnapshot
} from "./firebase.js";


// =====================================================
// 🎛️ TAB SYSTEM (SAFE INIT)
// =====================================================
document.addEventListener("DOMContentLoaded", () => {

  const saldoBtn = document.getElementById("saldoBtn");
  const inputBtn = document.getElementById("inputBtn");

  const saldoContent = document.getElementById("saldoContent");
  const inputContent = document.getElementById("inputContent");

  function setActiveTab(type) {

    if (!saldoBtn || !inputBtn || !saldoContent || !inputContent) return;

    // reset tombol
    saldoBtn.classList.remove("active");
    inputBtn.classList.remove("active");

    // hide semua tab
    saldoContent.style.display = "none";
    inputContent.style.display = "none";

    // aktifkan tab
    if (type === "saldo") {
      saldoBtn.classList.add("active");
      saldoContent.style.display = "block";
    } else {
      inputBtn.classList.add("active");
      inputContent.style.display = "block";
    }
  }

  // event klik tab
  saldoBtn?.addEventListener("click", () => setActiveTab("saldo"));
  inputBtn?.addEventListener("click", () => setActiveTab("input"));

  // default tab
  setActiveTab("saldo");
});


// =====================================================
// 💰 FORMAT RUPIAH INPUT
// =====================================================
function formatInput(el) {

  if (!el) return;

  el.addEventListener("input", (e) => {

    let value = e.target.value.replace(/\D/g, "");

    e.target.value = new Intl.NumberFormat("id-ID").format(value);
  });
}


// =====================================================
// 🧾 INPUT ELEMENT (SAFE)
// =====================================================
const inputAwal = document.getElementById("saldoAwalInput");
const inputAkhir = document.getElementById("saldoAkhirInput");

formatInput(inputAwal);
formatInput(inputAkhir);


// =====================================================
// 💾 SAVE SALDO KE FIREBASE
// =====================================================
async function saveSaldo() {

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
}


// =====================================================
// 🔘 BUTTON SAVE
// =====================================================
document.getElementById("saveSaldoBtn")
  ?.
