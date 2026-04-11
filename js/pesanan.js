
import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// =============================
// 🛒 LOAD CART
// =============================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// =============================
// ELEMENT
// =============================
const orderList = document.getElementById("orderList");
const totalHarga = document.getElementById("totalHarga");

// =============================
// RENDER STRUK
// =============================
function render() {

  orderList.innerHTML = "";

  let total = 0;

  cart.forEach(item => {

    const subtotal = item.qty * item.price;
    total += subtotal;

    const row = document.createElement("div");
    row.classList.add("order-item");

    row.innerHTML = `
      <div class="item-info">
        <span class="item-qty">${item.qty}x</span>
        <span class="item-name">${item.name}</span>
      </div>

      <div class="item-price">
        ${subtotal.toLocaleString("id-ID")}
      </div>
    `;

    orderList.appendChild(row);
  });

  totalHarga.textContent = total.toLocaleString("id-ID");
}

render();




document.getElementById("payBtn").addEventListener("click", async () => {

  let total = cart.reduce((sum, item) => {
    return sum + item.qty * item.price;
  }, 0);

  try {

    await addDoc(collection(db, "penjualan"), {
      items: cart,
      total: total,
      type: "masuk",
      createdAt: new Date()
    });

    // reset cart
    localStorage.removeItem("cart");

    alert("Pembayaran berhasil 💰");

    // ke transaksi
    window.location.href = "transaksi.html";

  } catch (err) {
    console.error(err);
  }
});