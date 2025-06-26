// client/js/restaurant.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addProductForm");
  const productList = document.getElementById("productList");

  // Load existing products
  renderProducts();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const price = parseInt(document.getElementById("productPrice").value);
    const desc = document.getElementById("productDesc").value.trim();
    const img = document.getElementById("productImg").value.trim();

    if (!name || !price || !desc || !img) {
      alert("Please fill in all fields.");
      return;
    }

    let products = JSON.parse(localStorage.getItem("restaurantProducts")) || [];

    products.push({ name, price, desc, img });
    localStorage.setItem("restaurantProducts", JSON.stringify(products));

    form.reset();
    renderProducts();
  });

  function renderProducts() {
    const products = JSON.parse(localStorage.getItem("restaurantProducts")) || [];
    productList.innerHTML = "";

    if (products.length === 0) {
      productList.innerHTML = "<p>No products added yet.</p>";
      return;
    }

    products.forEach((p, index) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}" width="150" height="150"/>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <p>₹${p.price}</p>
      `;
      productList.appendChild(card);
    });
  }
});
