// js/cart.js

// Load cart items from localStorage
let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

// Render the cart dynamically
function renderCart() {
  const container = document.getElementById("cartItems");
  const totalDisplay = document.getElementById("cartTotal");
  let total = 0;

  if (cartItems.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    totalDisplay.textContent = "0";
    return;
  }

  container.innerHTML = "";
  cartItems.forEach((item, index) => {
    total += item.price * item.quantity;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <div>
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>
      </div>
      <div>
        <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)" />
        <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
      </div>
    `;
    container.appendChild(itemDiv);
  });

  totalDisplay.textContent = total;
}

function updateQuantity(index, value) {
  cartItems[index].quantity = parseInt(value);
  localStorage.setItem('cart', JSON.stringify(cartItems));
  renderCart();
}

function removeItem(index) {
  cartItems.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cartItems));
  renderCart();
}

window.addEventListener("DOMContentLoaded", renderCart);
