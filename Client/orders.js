// js/orders.js

document.addEventListener("DOMContentLoaded", () => {
  const ordersList = document.getElementById("ordersList");
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders.length === 0) {
    ordersList.innerHTML = "<p>No past orders found.</p>";
    return;
  }

  orders.forEach((order, index) => {
    const itemsHTML = order.cart.map(item => {
      return `${item.name} × ${item.quantity} (₹${item.price})`;
    }).join(", ");

    const orderHTML = `
      <div class="order-card">
        <h3>Order #${index + 1}</h3>
        <p><strong>Name:</strong> ${order.name}</p>
        <p><strong>Items:</strong> ${itemsHTML}</p>
        <p><strong>Payment:</strong> ${order.payment}</p>
        <p><strong>Date:</strong> ${order.date}</p>
      </div>
    `;

    ordersList.innerHTML += orderHTML;
  });
});
