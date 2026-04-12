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

// =========================
// SAFE INIT (BIAR TIDAK ERROR DI HALAMAN LAIN)
// =========================
const groupBtn = document.getElementById("groupBtn");

if (groupBtn) {
  const petugasBtn = document.getElementById("petugasBtn");
  const masukBtn = document.getElementById("masukBtn");

  const groupText = document.getElementById("groupText");
  const petugasText = document.getElementById("petugasText");

  const groupOptions = document.getElementById("groupOptions");
  const petugasOptions = document.getElementById("petugasOptions");

  // =========================
  // DATA
  // =========================
  const grupData = {
    "Gemah Raya": ["Rama", "-", "-"],
    "-": ["-", "-", "-"],
  };

  let selectedGroup = "";
  let selectedPetugas = "";

  // =========================
  // RENDER GROUP
  // =========================
  function renderGroups() {
    groupOptions.innerHTML = "";

    Object.keys(grupData).forEach((group) => {
      const item = document.createElement("div");
      item.classList.add("dropdown-item");
      item.textContent = group;

      item.addEventListener("click", () => {
        selectedGroup = group;
        selectedPetugas = "";

        groupText.textContent = group;
        petugasText.textContent = "Pilih Crew";

        groupBtn.classList.add("active-selected");
        petugasBtn.classList.add("active-selected");

        petugasBtn.disabled = false;

        groupOptions.classList.add("hidden");
        petugasOptions.classList.add("hidden");

        masukBtn.disabled = true;
        masukBtn.classList.remove("ready");

        renderPetugas(group);
      });

      groupOptions.appendChild(item);
    });
  }

  // =========================
  // RENDER PETUGAS
  // =========================
  function renderPetugas(group) {
    petugasOptions.innerHTML = "";

    grupData[group].forEach((nama) => {
      const item = document.createElement("div");
      item.classList.add("dropdown-item");
      item.textContent = nama;

      item.addEventListener("click", () => {
        selectedPetugas = nama;
        petugasText.textContent = nama;
        petugasOptions.classList.add("hidden");

        if (selectedGroup && selectedPetugas) {
          masukBtn.disabled = false;
          masukBtn.classList.add("ready");
        }
      });

      petugasOptions.appendChild(item);
    });
  }

  // =========================
  // EVENT
  // =========================
  groupBtn.addEventListener("click", () => {
    groupOptions.classList.toggle("hidden");
    petugasOptions.classList.add("hidden");
  });

  petugasBtn.addEventListener("click", () => {
    if (!selectedGroup) return;
    petugasOptions.classList.toggle("hidden");
    groupOptions.classList.add("hidden");
  });

  masukBtn.addEventListener("click", () => {
    if (!selectedGroup || !selectedPetugas) return;

    localStorage.setItem("selectedGroup", selectedGroup);
    localStorage.setItem("selectedPetugas", selectedPetugas);
    localStorage.setItem("login", "true"); // 🔥 penting

    window.location.href = "dashboard.html";
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".field-wrap")) {
      groupOptions.classList.add("hidden");
      petugasOptions.classList.add("hidden");
    }
  });

  // =========================
  // INIT
  // =========================
  renderGroups();
}
