// =====================================================
// 🔐 PWA + LOGIN + DROPDOWN SYSTEM (FULL FIXED VERSION)
// =====================================================


// =============================
// 📦 PWA INSTALL PROMPT
// =============================
let deferredPrompt; // menyimpan event install PWA

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault(); // mencegah popup otomatis
  deferredPrompt = e; // simpan event untuk dipanggil manual
  console.log("PWA siap diinstall");
});


// =============================
// ⚙️ SERVICE WORKER (CACHE OFFLINE)
// =============================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js") // pastikan path benar
    .then((reg) => {
      reg.update(); // paksa cek update saat load

      // auto cek update tiap 60 detik
      setInterval(() => {
        reg.update();
      }, 60000);
    })
    .catch((err) => {
      console.error("Service Worker error:", err);
    });
}


// =====================================================
// 🧠 SAFE INIT (BIAR TIDAK ERROR DI HALAMAN YANG TIDAK ADA ELEMENT)
// =====================================================
const groupBtn = document.getElementById("groupBtn");

// kalau tombol group ada → berarti halaman login aktif
if (groupBtn) {

  // =============================
  // 🎛️ ELEMENT UI LOGIN
  // =============================
  const petugasBtn = document.getElementById("petugasBtn");
  const masukBtn = document.getElementById("masukBtn");

  const groupText = document.getElementById("groupText");
  const petugasText = document.getElementById("petugasText");

  const groupOptions = document.getElementById("groupOptions");
  const petugasOptions = document.getElementById("petugasOptions");


  // =============================
  // 📊 DATA GROUP & PETUGAS
  // =============================
  const grupData = {
    "Gemah Raya": ["Rama"] // bisa tambah: "Budi", "Andi", dll
  };


  // =============================
  // 📌 STATE USER
  // =============================
  let selectedGroup = "";
  let selectedPetugas = "";


  // =====================================================
  // 🧩 RENDER LIST GROUP
  // =====================================================
  function renderGroups() {

    groupOptions.innerHTML = ""; // reset isi dropdown

    Object.keys(grupData).forEach((group) => {

      const item = document.createElement("div");
      item.classList.add("dropdown-item");
      item.textContent = group;

      // klik group
      item.addEventListener("click", () => {

        selectedGroup = group; // simpan group
        selectedPetugas = "";   // reset petugas

        groupText.textContent = group;
        petugasText.textContent = "Pilih Crew";

        // aktifkan style tombol
        groupBtn.classList.add("active-selected");
        petugasBtn.classList.add("active-selected");

        petugasBtn.disabled = false; // enable tombol petugas

        // sembunyikan dropdown
        groupOptions.classList.add("hidden");
        petugasOptions.classList.add("hidden");

        // disable tombol login dulu
        masukBtn.disabled = true;
        masukBtn.classList.remove("ready");

        // render petugas sesuai group
        renderPetugas(group);
      });

      groupOptions.appendChild(item);
    });
  }


  // =====================================================
  // 🧩 RENDER LIST PETUGAS
  // =====================================================
  function renderPetugas(group) {

    petugasOptions.innerHTML = ""; // reset

    grupData[group].forEach((nama) => {

      const item = document.createElement("div");
      item.classList.add("dropdown-item");
      item.textContent = nama;

      // klik petugas
      item.addEventListener("click", () => {

        selectedPetugas = nama;

        petugasText.textContent = nama;
        petugasOptions.classList.add("hidden");

        // jika sudah lengkap → enable login
        if (selectedGroup && selectedPetugas) {
          masukBtn.disabled = false;
          masukBtn.classList.add("ready");
        }
      });

      petugasOptions.appendChild(item);
    });
  }


  // =====================================================
  // 🖱️ EVENT OPEN DROPDOWN GROUP
  // =====================================================
  groupBtn.addEventListener("click", () => {
    groupOptions.classList.toggle("hidden"); // toggle buka/tutup
    petugasOptions.classList.add("hidden");  // tutup yang lain
  });


  // =====================================================
  // 🖱️ EVENT OPEN DROPDOWN PETUGAS
  // =====================================================
  petugasBtn.addEventListener("click", () => {

    if (!selectedGroup) {
      alert("Silakan pilih group dulu");
      return;
    }

    petugasOptions.classList.toggle("hidden");
    groupOptions.classList.add("hidden");
  });


  // =====================================================
  // 🚀 LOGIN & SIMPAN LOCALSTORAGE
  // =====================================================
  masukBtn.addEventListener("click", () => {

    if (!selectedGroup || !selectedPetugas) return;

    // simpan session login
    localStorage.setItem("selectedGroup", selectedGroup);
    localStorage.setItem("selectedPetugas", selectedPetugas);
    localStorage.setItem("login", "true");

    // pindah ke dashboard
    window.location.href = "dashboard.html";
  });


  // =====================================================
  // ❌ CLOSE DROPDOWN JIKA CLICK DI LUAR
  // =====================================================
  document.addEventListener("click", (e) => {

    if (!e.target.closest(".field-wrap")) {
      groupOptions.classList.add("hidden");
      petugasOptions.classList.add("hidden");
    }
  });


  // =====================================================
  // ▶️ INIT FIRST LOAD
  // =====================================================
  renderGroups();
}
