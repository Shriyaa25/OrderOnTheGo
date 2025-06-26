// js/checkout.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkoutForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // prevent page reload

    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const payment = document.getElementById("payment").value;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!name || !address || !payment || cart.length === 0) {
      alert("Please fill all fields and ensure your cart isn't empty.");
      return;
    }

    // Simulate order placing
    alert(`Thank you ${name}! Your order has been placed.`);

    // Store order in localStorage
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push({
      name,
      address,
      payment,
      cart,
      date: new Date().toLocaleString()
    });
    localStorage.setItem("orders", JSON.stringify(orders));

    // Clear cart
    localStorage.removeItem("cart");

    // Redirect to home
    window.location.href = "index.html";
  });
});
