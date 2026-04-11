
console.log("🔥 TAB SYSTEM LOADED");

// =============================
// AMBIL ELEMENT
// =============================
const masukBtn = document.getElementById("masukBtn");
const keluarBtn = document.getElementById("keluarBtn");

const masukContent = document.getElementById("masukContent");
const keluarContent = document.getElementById("keluarContent");

// safety check
if (!masukBtn || !keluarBtn || !masukContent || !keluarContent) {
  console.error("❌ TAB ELEMENT TIDAK LENGKAP");
}

// =============================
// SHOW MASUK
// =============================
function showMasuk() {
  masukContent.style.display = "block";
  keluarContent.style.display = "none";

  masukBtn.classList.add("active");
  keluarBtn.classList.remove("active");
}

// =============================
// SHOW KELUAR
// =============================
function showKeluar() {
  masukContent.style.display = "none";
  keluarContent.style.display = "block";

  keluarBtn.classList.add("active");
  masukBtn.classList.remove("active");
}

// =============================
// EVENT CLICK
// =============================
masukBtn?.addEventListener("click", showMasuk);
keluarBtn?.addEventListener("click", showKeluar);

// =============================
// DEFAULT TAB
// =============================
showMasuk();