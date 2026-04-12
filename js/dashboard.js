// =====================================================
// 📊 DASHBOARD SYSTEM (NO LOGIN VERSION)
// Semua user langsung masuk tanpa auth/login
// =====================================================


// =====================================================
// 🎛️ TAB SYSTEM (SALDO / INPUT)
// =====================================================

// tombol tab
const saldoBtn = document.getElementById("saldoBtn");   // tombol tab saldo
const inputBtn = document.getElementById("inputBtn");   // tombol tab input

// konten tab
const saldoContent = document.getElementById("saldoContent"); // section saldo
const inputContent = document.getElementById("inputContent"); // section input


// =====================================================
// 🔁 FUNGSI GANTI TAB
// =====================================================
function setActiveTab(type) {

  // safety check kalau elemen tidak ditemukan
  if (!saldoBtn || !inputBtn || !saldoContent || !inputContent) return;

  // reset status active di tombol
  saldoBtn.classList.remove("active");
  inputBtn.classList.remove("active");

  // sembunyikan semua tab dulu
  saldoContent.style.display = "none";
  inputContent.style.display = "none";

  // kalau pilih TAB SALDO
  if (type === "saldo") {
    saldoBtn.classList.add("active");        // aktifkan tombol
    saldoContent.style.display = "block";    // tampilkan saldo
  }

  // kalau pilih TAB INPUT
  else {
    inputBtn.classList.add("active");        // aktifkan tombol
    inputContent.style.display = "block";    // tampilkan input
  }
}


// =====================================================
// 🖱️ EVENT CLICK TAB
// =====================================================
saldoBtn?.addEventListener("click", () => setActiveTab("saldo")); // klik saldo
inputBtn?.addEventListener("click", () => setActiveTab("input")); // klik input

// default saat halaman dibuka
setActiveTab("saldo");


// =====================================================
// 💰 FORMAT INPUT RUPIAH OTOMATIS
// =====================================================
function formatInput(el) {

  if (!el) return; // kalau input tidak ada stop

  el.addEventListener("input", (e) => {

    // hapus semua selain angka
    let value = e.target.value.replace(/\D/g, "");

    // format jadi ribuan Indonesia (1.000.000)
    e.target.value = new Intl.NumberFormat("id-ID").format(value);
  });
}

// aktifkan format ke input saldo
formatInput(document.getElementById("saldoAwalInput"));
formatInput(document.getElementById("saldoAkhirInput"));


// =====================================================
// 💾 SIMPAN SALDO KE FIREBASE
// =====================================================

// ambil input DOM
const inputAwal = document.getElementById("saldoAwalInput");   // input saldo awal
const inputAkhir = document.getElementById("saldoAkhirInput"); // input saldo akhir

// fungsi simpan ke firestore
async function saveSaldo() {

  // convert format "1.000" → 1000 (angka asli)
  const saldoAwal = parseInt((inputAwal?.value || "0").replace(/\./g, "")) || 0;
  const saldoAkhir = parseInt((inputAkhir?.value || "0").replace(/\./g, "")) || 0;

  try {

    // simpan ke collection "saldo" doc "utama"
    await setDoc(doc(db, "saldo", "utama"), {
      saldoAwal,              // data saldo awal
      saldoAkhir,             // data saldo akhir
      updatedAt: new Date()   // timestamp update
    });

    alert("Saldo berhasil disimpan 🚀");

  } catch (err) {
    console.error("Gagal simpan saldo:", err); // log error
  }
}


// tombol simpan saldo awal
document.getElementById("saveSaldoBtn")
  ?.addEventListener("click", saveSaldo);

// tombol simpan saldo akhir
document.getElementById("saveSaldoAkhirBtn")
  ?.addEventListener("click", saveSaldo);


// =====================================================
// 🔥 REALTIME LISTENER SALDO (FIREBASE)
// =====================================================
onSnapshot(doc(db, "saldo", "utama"), (snap) => {

  if (!snap.exists()) return; // kalau data kosong stop

  const data = snap.data(); // ambil data firestore

  // tampilkan saldo awal
  document.getElementById("saldoAwal")?.textContent =
    new Intl.NumberFormat("id-ID").format(data.saldoAwal || 0);

  // tampilkan saldo akhir
  document.getElementById("saldoAkhir")?.textContent =
    new Intl.NumberFormat("id-ID").format(data.saldoAkhir || 0);
});


// =====================================================
// 💸 REALTIME PENGELUARAN (COLLECTION transaksi)
// =====================================================
onSnapshot(collection(db, "transaksi"), (snapshot) => {

  let total = 0; // penampung total pengeluaran

  snapshot.forEach((doc) => {

    const data = doc.data();

    // hanya hitung transaksi keluar
    if (data.type === "keluar") {
      total += Number(data.nominal || 0);
    }
  });

  // tampilkan ke UI
  document.getElementById("pengeluaranValue")?.textContent =
    total.toLocaleString("id-ID");
});


// =====================================================
// 💰 REALTIME PEMASUKAN (COLLECTION penjualan)
// =====================================================
onSnapshot(collection(db, "penjualan"), (snapshot) => {

  let total = 0; // penampung pemasukan

  snapshot.forEach((doc) => {

    const data = doc.data();

    // hanya hitung yang masuk
    if (data.type === "masuk") {
      total += Number(data.total || 0);
    }
  });

  // tampilkan ke UI
  document.getElementById("pemasukanValue")?.textContent =
    total.toLocaleString("id-ID");
});
