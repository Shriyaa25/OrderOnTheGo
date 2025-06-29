const cartItemsContainer = document.getElementById("cartItems");
const api = "http://localhost:5000/api";

// Fetch and display cart from localStorage
function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty 🛒</p>";
    return;
  }

  // Fetch product details by productId
  Promise.all(
    cart.map(item =>
      fetch(`${api}/products/${item.productId}`).then(res => res.json())
    )
  )
    .then(products => {
      cartItemsContainer.innerHTML = products
        .map((p, i) => `
          <div class="cart-item">
            <img src="${p.imageUrl || 'https://via.placeholder.com/80'}" />
            <div class="item-details">
              <h4>${p.name}</h4>
              <p>₹${p.price}</p>
            </div>
            <button onclick="removeItem(${i})">❌ Remove</button>
          </div>
        `)
        .join("");
    })
    .catch(err => {
      cartItemsContainer.innerHTML = "<p>Failed to load cart items</p>";
    });
}

// Remove one item
function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// Clear all items
function clearCart() {
  localStorage.removeItem("cart");
  loadCart();
}

// Order All - Dummy Payment + Save to DB
async function orderAll() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("❌ Cart is empty!");
    return;
  }

  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("❌ Please login first.");
    return;
  }

  alert("💳 Processing dummy payment...");

  try {
    const res = await fetch(`${api}/orders/place`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        items: cart
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Order placed successfully!");
      localStorage.removeItem("cart");
      loadCart();
    } else {
      alert("❌ Failed to place order: " + data.error);
    }
  } catch (err) {
    alert("❌ Server error");
  }
}

// On load
loadCart();
