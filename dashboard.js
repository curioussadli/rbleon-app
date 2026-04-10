// =========================
// DATA DUMMY TRANSAKSI
// =========================
const kasArisanData = {
  pemasukan: 50000000,
  pengeluaran: 20000000
};

const jimpitanData = {
  pemasukan: 12000000,
  pengeluaran: 3500000
};

// =========================
// ELEMENT
// =========================
const kasBtn = document.getElementById("kasBtn");
const jimpitanBtn = document.getElementById("jimpitanBtn");

const welcomeTitle = document.getElementById("welcomeTitle");
const petugasInfo = document.getElementById("petugasInfo");

const saldoValue = document.getElementById("saldoValue");
const pemasukanValue = document.getElementById("pemasukanValue");
const pengeluaranValue = document.getElementById("pengeluaranValue");

const danaKas = document.getElementById("danaKas");
const danaSosial = document.getElementById("danaSosial");
const danaDarurat = document.getElementById("danaDarurat");
const uangMeja = document.getElementById("uangMeja");

const tabContent = document.getElementById("tabContent");

// =========================
// FORMAT RUPIAH
// =========================
function formatRupiah(angka) {
  return " " + angka.toLocaleString("id-ID");
}

// =========================
// HITUNG & RENDER DATA
// =========================
function renderDashboard(type) {
  const data = type === "kas" ? kasArisanData : jimpitanData;

  const pemasukan = data.pemasukan;
  const pengeluaran = data.pengeluaran;
  const saldo = pemasukan - pengeluaran;

  const danaKasValue = saldo * 0.2;
  const danaSosialValue = saldo * 0.4;
  const danaDaruratValue = saldo * 0.2;
  const uangMejaValue = saldo * 0.2;

  saldoValue.textContent = formatRupiah(saldo);
  pemasukanValue.textContent = formatRupiah(pemasukan);
  pengeluaranValue.textContent = formatRupiah(pengeluaran);

  danaKas.textContent = formatRupiah(danaKasValue);
  danaSosial.textContent = formatRupiah(danaSosialValue);
  danaDarurat.textContent = formatRupiah(danaDaruratValue);
  uangMeja.textContent = formatRupiah(uangMejaValue);

  if (type === "kas") {
    welcomeTitle.textContent = "Saldo";
    tabContent.innerHTML = `
      <h3>Halaman Kas Arisan</h3>
      <p>Konten masih kosong dulu. Nanti bisa diisi transaksi, riwayat, dan laporan.</p>
    `;
  } else {
    welcomeTitle.textContent = "Stok";
    tabContent.innerHTML = `
      <h3>Halaman Jimpitan</h3>
      <p>Konten Jimpitan masih kosong dulu. Nanti bisa dibuat halaman terpisah.</p>
    `;
  }
}

// =========================
// TOGGLE ACTIVE BUTTON
// =========================
function setActiveTab(type) {
  if (type === "kas") {
    kasBtn.classList.add("active");
    jimpitanBtn.classList.remove("active");
  } else {
    jimpitanBtn.classList.add("active");
    kasBtn.classList.remove("active");
  }

  renderDashboard(type);
}

// =========================
// LOAD DATA PETUGAS
// =========================
const selectedGroup = localStorage.getItem("selectedGroup") || "Grup 1";
const selectedPetugas = localStorage.getItem("selectedPetugas") || "Lionel Messi";

petugasInfo.textContent = `${selectedGroup} • ${selectedPetugas}`;

// =========================
// EVENT
// =========================
kasBtn.addEventListener("click", () => {
  setActiveTab("kas");
});

jimpitanBtn.addEventListener("click", () => {
  setActiveTab("jimpitan");
});

// =========================
// DEFAULT
// =========================
setActiveTab("kas");