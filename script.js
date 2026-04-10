const groupBtn = document.getElementById("groupBtn");
const petugasBtn = document.getElementById("petugasBtn");
const masukBtn = document.getElementById("masukBtn");

const groupText = document.getElementById("groupText");
const petugasText = document.getElementById("petugasText");

const groupOptions = document.getElementById("groupOptions");
const petugasOptions = document.getElementById("petugasOptions");

// Data dummy grup & petugas
const grupData = {
  "Gemah Raya": ["Rama", "-", "-"],
  "-": ["-", "-", "-"],
};

let selectedGroup = "";
let selectedPetugas = "";

// Render grup
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

// Render petugas
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

// Klik tombol grup
groupBtn.addEventListener("click", () => {
  groupOptions.classList.toggle("hidden");
  petugasOptions.classList.add("hidden");
});

// Klik tombol petugas
petugasBtn.addEventListener("click", () => {
  if (!selectedGroup) return;
  petugasOptions.classList.toggle("hidden");
  groupOptions.classList.add("hidden");
});

// Klik masuk
masukBtn.addEventListener("click", () => {
  if (!selectedGroup || !selectedPetugas) return;

  localStorage.setItem("selectedGroup", selectedGroup);
  localStorage.setItem("selectedPetugas", selectedPetugas);

  window.location.href = "dashboard.html";
});

// Klik luar area = tutup dropdown
document.addEventListener("click", (e) => {
  if (!e.target.closest(".field-wrap")) {
    groupOptions.classList.add("hidden");
    petugasOptions.classList.add("hidden");
  }
});

// Init
renderGroups();