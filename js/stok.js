import { db } from "./firebase.js";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* =========================
   STATE LOKAL
========================= */
let localData = {};

/* =========================
   FORMAT
========================= */
function formatAngka(num) {
  return Number(num || 0).toLocaleString("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });
}

function formatRupiah(num) {
  return "Rp " + Number(num || 0).toLocaleString("id-ID");
}

/* =========================
   HITUNG OTOMATIS
========================= */
function hitung(data) {
  const stokMasuk = Number(data.stokMasuk || 0);
  const stokKeluar = Number(data.stokKeluar || 0);

  const stokUtuh = Number(data.stokBahanUtuh || 0);
  const stokKoma = Number(data.stokBahanKoma || 0);

  const persediaan = stokMasuk - stokKeluar;
  const stokBahan = stokUtuh + stokKoma;

  const stokTotal = persediaan + stokBahan;

  const harga = Number(data.harga || 0);
  const nominal = stokTotal * harga;

  const stokMinimal = Number(data.stokMinimal || 0);
  const stokRequest = Math.max(0, stokMinimal - stokTotal);

  return {
    persediaan,
    stokTotal,
    nominal,
    stokRequest
  };
}

/* =========================
   RENDER UI
========================= */
function renderUI() {
  Object.keys(localData).forEach((id) => {
    const data = localData[id];
    const card = document.querySelector(`[data-id="${id}"]`);
    if (!card) return;

    const hasil = hitung(data);

    const setVal = (cls, val) => {
      const el = card.querySelector(cls);
      if (el) el.value = val;
    };

    const setText = (cls, val) => {
      const el = card.querySelector(cls);
      if (el) el.innerText = val;
    };

    setVal(".stokMasuk", data.stokMasuk);
    setVal(".stokKeluar", data.stokKeluar);
    setVal(".stokBahanUtuh", data.stokBahanUtuh);
    setVal(".stokBahanKoma", data.stokBahanKoma);

    setText(".persediaan", formatAngka(hasil.persediaan));
    setText(".stokTotal", formatAngka(hasil.stokTotal));
    setText(".nominal", formatRupiah(hasil.nominal));
    setText(".stokRequest", formatAngka(hasil.stokRequest));
  });
}

/* =========================
   FIRESTORE REALTIME
========================= */
onSnapshot(collection(db, "stok"), (snapshot) => {
  snapshot.forEach((docSnap) => {
    localData[docSnap.id] = docSnap.data();
  });

  renderUI();
});

/* =========================
   CHANGE VALUE
========================= */
window.changeValue = function (el, field, delta) {
  const card = el.closest(".stok-card");
  const id = card.dataset.id;

  if (!localData[id]) return;

  let value = Number(localData[id][field] || 0);
  value += delta;

  // batas minimal 0
  if (value < 0) value = 0;

  // khusus koma
  if (field === "stokBahanKoma") {
    value = Math.min(0.9, Math.max(0, value));
    value = Math.round(value * 10) / 10;
  }

  localData[id][field] = value;

  renderUI();
};

/* =========================
   SAVE STOK
========================= */
window.saveStok = async function (el) {
  const card = el.closest(".stok-card");
  const id = card.dataset.id;

  const data = localData[id];
  const hasil = hitung(data);

  await updateDoc(doc(db, "stok", id), {
    ...data,
    ...hasil,
    updatedAt: new Date()
  });

  alert("Stok berhasil disimpan!");
};

/* =========================
   KIRIM STOK HARIAN
========================= */
window.kirimStokHarian = async function () {
  const snapshot = await getDocs(collection(db, "stok"));

  const today = new Date().toISOString().slice(0, 10);

  const promises = [];

  snapshot.forEach((item) => {
    const ref = doc(db, "stok_harian", today, "items", item.id);

    promises.push(
      setDoc(ref, {
        ...item.data(),
        createdAt: new Date()
      })
    );
  });

  await Promise.all(promises);

  alert("Stok harian berhasil dikirim!");
};

/* =========================
   TOGGLE CARD
========================= */
window.toggleCard = function (el) {
  const card = el.parentElement;

  document.querySelectorAll(".stok-card").forEach((c) => {
    if (c !== card) c.classList.remove("active");
  });

  card.classList.toggle("active");
};