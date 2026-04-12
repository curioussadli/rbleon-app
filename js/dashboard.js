// =====================================================
// 🔐 LOGIN CHECK (ambil data dari localStorage)
// =====================================================
const group = localStorage.getItem("selectedGroup");
const petugas = localStorage.getItem("selectedPetugas");

// kalau belum login → paksa balik ke index
if (!group || !petugas) {
  window.location.href = "index.html";
}


// =====================================================
// 👤 TAMPILKAN INFO USER DI HEADER
// =====================================================
const petugasInfo = document.getElementById("petugasInfo");

if (petugasInfo) {
  // gabungkan group + nama petugas
  petugasInfo.textContent = `${group} • ${petugas}`;
}


// =====================================================
// ⚠️ PASTIKAN DOM SUDAH SIAP (INI PENTING BIAR TAB TIDAK ERROR)
// =====================================================
document.addEventListener("DOMContentLoaded", () => {

  // =====================================================
  // 🎛️ TAB ELEMENT (ambil tombol & isi tab)
  // =====================================================
  const saldoBtn = document.getElementById("saldoBtn");
  const inputBtn = document.getElementById("inputBtn");

  const saldoContent = document.getElementById("saldoContent");
  const inputContent = document.getElementById("inputContent");


  // =====================================================
  // 🔁 FUNCTION UNTUK GANTI TAB
  // =====================================================
  function setActiveTab(type) {

    // kalau elemen belum ada → stop biar tidak error
    if (!saldoBtn || !inputBtn || !saldoContent || !inputContent) return;

    // reset semua tombol jadi non-active
    saldoBtn.classList.remove("active");
    inputBtn.classList.remove("active");

    // sembunyikan semua isi tab
    saldoContent.style.display = "none";
    inputContent.style.display = "none";

    // jika tab SALDO dipilih
    if (type === "saldo") {
      saldoBtn.classList.add("active");      // aktifkan tombol
      saldoContent.style.display = "block";  // tampilkan isi saldo
    }

    // jika tab INPUT dipilih
    else {
      inputBtn.classList.add("active");       // aktifkan tombol
      inputContent.style.display = "block";   // tampilkan form input
    }
  }


  // =====================================================
  // 🖱️ EVENT CLICK TAB
  // =====================================================
  saldoBtn?.addEventListener("click", () => setActiveTab("saldo"));
  inputBtn?.addEventListener("click", () => setActiveTab("input"));

  // default tab saat halaman dibuka
  setActiveTab("saldo");


  // =====================================================
  // 💰 FORMAT INPUT RUPIAH (otomatis pakai titik)
  // =====================================================
  function formatInput(el) {
    if (!el) return;

    el.addEventListener("input", (e) => {

      // hapus semua selain angka
      let value = e.target.value.replace(/\D/g, "");

      // format ribuan Indonesia
      e.target.value = new Intl.NumberFormat("id-ID").format(value);
    });
  }

  // aktifkan format ke input saldo
  formatInput(document.getElementById("saldoAwalInput"));
  formatInput(document.getElementById("saldoAkhirInput"));


  // =====================================================
  // 💾 SIMPAN SALDO KE FIREBASE
  // =====================================================
  const inputAwal = document.getElementById("saldoAwalInput");
  const inputAkhir = document.getElementById("saldoAkhirInput");

  async function saveSaldo() {

    // ubah format "1.000" → 1000 (angka asli)
    const saldoAwal = parseInt((inputAwal?.value || "0").replace(/\./g, "")) || 0;
    const saldoAkhir = parseInt((inputAkhir?.value || "0").replace(/\./g, "")) || 0;

    try {
      await setDoc(doc(db, "saldo", "utama"), {
        saldoAwal,
        saldoAkhir,
        updatedAt: new Date()
      });

      alert("Saldo berhasil disimpan 🚀");

    } catch (err) {
      console.error("Gagal simpan saldo:", err);
    }
  }

  // tombol simpan saldo awal & akhir
  document.getElementById("saveSaldoBtn")?.addEventListener("click", saveSaldo);
  document.getElementById("saveSaldoAkhirBtn")?.addEventListener("click", saveSaldo);


  // =====================================================
  // 🔥 REALTIME SALDO (FIREBASE LISTENER)
  // =====================================================
  onSnapshot(doc(db, "saldo", "utama"), (snap) => {

    if (!snap.exists()) return;

    const data = snap.data();

    // tampilkan saldo awal
    document.getElementById("saldoAwal")?.textContent =
      new Intl.NumberFormat("id-ID").format(data.saldoAwal || 0);

    // tampilkan saldo akhir
    document.getElementById("saldoAkhir")?.textContent =
      new Intl.NumberFormat("id-ID").format(data.saldoAkhir || 0);
  });


  // =====================================================
  // 💸 REALTIME PENGELUARAN (collection transaksi)
  // =====================================================
  onSnapshot(collection(db, "transaksi"), (snapshot) => {

    let total = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();

      // hanya hitung transaksi keluar
      if (data.type === "keluar") {
        total += Number(data.nominal || 0);
      }
    });

    document.getElementById("pengeluaranValue")?.textContent =
      total.toLocaleString("id-ID");
  });


  // =====================================================
  // 💰 REALTIME PEMASUKAN (collection penjualan)
  // =====================================================
  onSnapshot(collection(db, "penjualan"), (snapshot) => {

    let total = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();

      // hanya hitung yang masuk
      if (data.type === "masuk") {
        total += Number(data.total || 0);
      }
    });

    document.getElementById("pemasukanValue")?.textContent =
      total.toLocaleString("id-ID");
  });

});
