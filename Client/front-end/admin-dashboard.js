// client/js/admin-dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const pendingContainer = document.getElementById("pendingApprovals");
  const userContainer = document.getElementById("userList");
  const orderContainer = document.getElementById("orderList");

  // Pending restaurants
  const pending = users.filter(u => u.role === "restaurant" && !u.approved);
  if (pending.length === 0) {
    pendingContainer.innerHTML = "<p>No pending approvals.</p>";
  } else {
    pending.forEach((u, i) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <p><strong>${u.username}</strong> wants to register as a restaurant.</p>
        <button onclick="approveRestaurant(${i})">Approve</button>
      `;
      pendingContainer.appendChild(div);
    });
  }

  // All users
  if (users.length === 0) {
    userContainer.innerHTML = "<p>No users found.</p>";
  } else {
    userContainer.innerHTML = users.map(u => `
      <p>${u.username} (${u.role}) - ${u.approved ? "Approved" : "Pending"}</p>
    `).join("");
  }

  // Orders
  if (orders.length === 0) {
    orderContainer.innerHTML = "<p>No orders yet.</p>";
  } else {
    orderContainer.innerHTML = orders.map(o => `
      <div>
        <p><strong>${o.name}</strong> ordered <strong>${o.cart.length}</strong> items</p>
        <p>Address: ${o.address}</p>
        <p>Payment: ${o.payment}</p>
        <p>Date: ${o.date}</p>
        <hr />
      </div>
    `).join("");
  }
});

// Approve logic
function approveRestaurant(index) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const pending = users.filter(u => u.role === "restaurant" && !u.approved);

  if (pending[index]) {
    const actualIndex = users.findIndex(u => u.username === pending[index].username);
    users[actualIndex].approved = true;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Restaurant approved!");
    location.reload();
  }
}

// Logout
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}
