import { db } from "./firebase.js";
import { 
  collection, 
  onSnapshot, 
  deleteDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const container = document.getElementById("transaksiMasuk");

onSnapshot(collection(db, "penjualan"), (snapshot) => {

  if (!container) return;
  container.innerHTML = "";

  const list = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    if (data.type === "masuk") {
      list.push({
        id: docSnap.id,   // ⭐ simpan id dokumen
        ...data
      });
    }
  });

  // 🔥 urutkan terbaru di atas
  list.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);

  // render list
  list.forEach((data) => {
    const div = document.createElement("div");
    div.classList.add("transaksi-card");

    div.innerHTML = `
      <div class="trx-info">
        <div>🧾 ${new Date(data.createdAt?.seconds * 1000).toLocaleString("id-ID")}</div>
        <div>Total: Rp ${(data.total || 0).toLocaleString("id-ID")}</div>
      </div>

      <button class="delete-btn" data-id="${data.id}">✖</button>
    `;

    container.appendChild(div);
  });

  // 🗑️ event hapus
  container.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      if (confirm("Hapus transaksi ini?")) {
        await deleteDoc(doc(db, "penjualan", id));
      }
    });
  });

});