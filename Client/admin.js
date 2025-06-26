// js/admin.js

document.addEventListener("DOMContentLoaded", () => {
  const users = [
    { username: "shriya", role: "user" },
    { username: "admin", role: "admin" },
    { username: "foodie123", role: "restaurant" }
  ];

  // Load Users
  const userList = document.getElementById("userList");
  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = `${user.username} (${user.role})`;
    userList.appendChild(li);
  });

  // Load Orders
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const orderList = document.getElementById("orderList");

  if (orders.length === 0) {
    orderList.innerHTML = "<p>No orders found.</p>";
  } else {
    orders.forEach((order, index) => {
      const div = document.createElement("div");
      div.className = "order-card";
      div.innerHTML = `
        <h3>Order #${index + 1}</h3>
        <p><strong>Name:</strong> ${order.name}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <p><strong>Payment:</strong> ${order.payment}</p>
        <p><strong>Date:</strong> ${order.date}</p>
        <p><strong>Items:</strong> ${order.cart.map(i => `${i.name} × ${i.quantity}`).join(", ")}</p>
      `;
      orderList.appendChild(div);
    });
  }

  // Load Products (default + restaurant)
  const defaultProducts = [
    {
      name: "Chicken Noodle Soup",
      price: 199,
      desc: "Warm and comforting – perfect for late nights!",
      img: "soup.jpg"
    },
    {
      name: "Veg Burger",
      price: 149,
      desc: "Crispy patty with fresh veggies and mayo",
      img: "burger.jpeg"
    },
    {
      name: "Margherita Pizza",
      price: 249,
      desc: "Classic cheese burst pizza with basil",
      img: "pizza2.jpeg"
    },
    {
      name: "French Fries",
      price: 99,
      desc: "Golden, crispy fries with ketchup",
      img: "fries.jpeg"
    }
  ];

  const dynamicProducts = JSON.parse(localStorage.getItem("restaurantProducts")) || [];
  const allProducts = [...defaultProducts, ...dynamicProducts];

  const productList = document.getElementById("productList");
  if (allProducts.length === 0) {
    productList.innerHTML = "<p>No products available.</p>";
  } else {
    allProducts.forEach((p, i) => {
      const div = document.createElement("div");
      div.className = "product-card";
      div.innerHTML = `
        <img src="${p.img}" alt="${p.name}" width="150" />
        <h4>${p.name}</h4>
        <p>₹${p.price}</p>
        <p>${p.desc}</p>
      `;
      productList.appendChild(div);
    });
  }
});

function logoutAdmin() {
  localStorage.removeItem("loggedInUser");
  alert("Admin logged out.");
  window.location.href = "login.html";
}
