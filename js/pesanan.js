import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  doc,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// =============================
// 🔙 BACK BUTTON
// =============================
const backBtn = document.getElementById("backBtn");

backBtn?.addEventListener("click", () => {
  window.history.back();
});


// =============================
// 🛒 LOAD CART
// =============================
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// =============================
// 🎯 ELEMENT
// =============================
const orderList = document.getElementById("orderList");
const totalHarga = document.getElementById("totalHarga");
const payBtn = document.getElementById("payBtn");

// =============================
// 📅 TODAY (WAJIB UNTUK FILTER)
// =============================
const now = new Date();
const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 10);
// =============================
// 🔥 GENERATE KODE RB (ANTI Nabrak)
// =============================
async function generateKodePesanan() {
  const counterRef = doc(db, "counters", "pesanan");

  const result = await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);

    let lastNumber = 0;

    // 🔥 kalau belum ada
    if (!counterDoc.exists()) {
      lastNumber = 1;
      transaction.set(counterRef, { lastNumber: lastNumber });
      return lastNumber;
    }

    // 🔥 ambil data lama + amankan dari NaN
    const data = counterDoc.data();
    lastNumber = Number(data.lastNumber) || 0;
    lastNumber += 1;

    transaction.update(counterRef, {
      lastNumber: lastNumber
    });

    return lastNumber;
  });

  return `RB ${String(result).padStart(3, "0")}`;
}


// =============================
// 💾 SIMPAN CART
// =============================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}


// =============================
// 🔄 RENDER UI
// =============================
function render() {

  orderList.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {

    const subtotal = item.qty * item.price;
    total += subtotal;

    const row = document.createElement("div");
    row.classList.add("order-item");

    row.innerHTML = `
      <div class="item-info">
        <span class="item-name">${item.name}</span>
        <span class="item-price">Rp ${item.price.toLocaleString("id-ID")}</span>
      </div>

      <div class="item-action">
        <button class="qty-btn minus" data-i="${index}">-</button>
        <span class="qty">${item.qty}</span>
        <button class="qty-btn plus" data-i="${index}">+</button>

        <button class="delete-btn" data-i="${index}">
          <img src="assets/icons/icon-close.svg">
        </button>
      </div>
    `;

    orderList.appendChild(row);
  });

  totalHarga.textContent = total.toLocaleString("id-ID");

  attachEvents();
}


// =============================
// 🎯 EVENT HANDLER
// =============================
function attachEvents() {

  document.querySelectorAll(".plus").forEach(btn => {
    btn.onclick = (e) => {
      const i = e.target.dataset.i;
      cart[i].qty++;
      saveCart();
      render();
    };
  });

  document.querySelectorAll(".minus").forEach(btn => {
    btn.onclick = (e) => {
      const i = e.target.dataset.i;

      if (cart[i].qty > 1) {
        cart[i].qty--;
      } else {
        cart.splice(i, 1);
      }

      saveCart();
      render();
    };
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.onclick = (e) => {
      const i = e.target.dataset.i;
      cart.splice(i, 1);
      saveCart();
      render();
    };
  });
}


// =============================
// 💳 BAYAR (SUDAH FIX)
// =============================
payBtn?.addEventListener("click", async () => {

  if (cart.length === 0) {
    alert("Pesanan kosong!");
    return;
  }

payBtn.disabled = true;
  payBtn.innerText = "Memproses...";

  try {

    // 💰 HITUNG TOTAL
    const total = cart.reduce((sum, item) => {
      return sum + item.qty * item.price;
    }, 0);

    // 🔢 KODE RB
    const kode = await generateKodePesanan();

    // 💾 SIMPAN KE FIRESTORE
    await addDoc(collection(db, "penjualan"), {
      kode: kode,                 // ✅ INI KUNCI UTAMA
      items: cart,
      total: total,
      metode: "Tunai",           // default
      tipe: "masuk",
      tanggal: today, // 🔥 WAJIB untuk filter & reset harian

      createdAt: serverTimestamp()
    });

    // 🧹 RESET CART
    cart = [];
    localStorage.removeItem("cart");

    alert(`Pembayaran berhasil 💰\n${kode}`);

    // 🔁 redirect
    window.location.href = "riwayat-pesanan.html";

  } catch (err) {
    console.error("Gagal simpan:", err);
    alert("Terjadi kesalahan saat menyimpan");
  }

  payBtn.disabled = false;
  payBtn.innerText = "Bayar";
});




// =============================
// 🚀 INIT
// =============================
render();

