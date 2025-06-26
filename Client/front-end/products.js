// client/js/products.js

document.addEventListener("DOMContentLoaded", () => {
  const productList = document.querySelector(".product-list");

  const products = [
    {
      name: "Chicken Noodle Soup",
      description: "Warm and comforting – perfect for late nights!",
      price: 199,
      image: "soup.jpg"
    },
    {
      name: "Veg Burger",
      description: "Crispy patty with fresh veggies and mayo",
      price: 149,
      image: "burger.jpeg"
    },
    {
      name: "Margherita Pizza",
      description: "Classic cheese burst pizza with basil",
      price: 249,
      image: "pizza2.jpeg"
    },
    {
      name: "French Fries",
      description: "Golden, crispy fries with ketchup",
      price: 99,
      image: "fries.jpeg"
    }
  ];

  if (products.length === 0) {
    productList.innerHTML = "<p>No dishes listed yet. Please check back later.</p>";
    return;
  }

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" width="300" height="300" />
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p>₹${product.price}</p>
      <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
    `;

    productList.appendChild(card);
  });
});
