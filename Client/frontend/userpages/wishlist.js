const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
const wishlistDiv = document.getElementById("wishlistItems");

// Load wishlist products
async function loadWishlist() {
  if (wishlist.length === 0) {
    wishlistDiv.innerHTML = "<p style='font-size: 18px;'>❤️ Your wishlist is empty</p>";
    return;
  }

  let html = "";

  for (const item of wishlist) {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${item.productId}`);
      const product = await res.json();

      html += `
        <div class="wishlist-card">
          <img src="${product.imageUrl || 'https://via.placeholder.com/150'}" alt="${product.name}" />
          <div class="wishlist-content">
            <h3>${product.name}</h3>
            <p>${product.description || 'No description'}</p>
            <div class="price">₹${product.price}</div>
            <div class="button-group">
              <button class="remove" onclick="removeFromWishlist('${item.productId}')">Remove</button>
              <button class="add-to-cart" onclick="bookNow('${item.productId}', '${item.restaurantId}')">Book Now</button>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      console.error("Error loading product:", err);
    }
  }

  wishlistDiv.innerHTML = html;
}

// Remove from wishlist
function removeFromWishlist(productId) {
  const updated = wishlist.filter(item => item.productId !== productId);
  localStorage.setItem("wishlist", JSON.stringify(updated));
  loadWishlist();
}

// Dummy booking
function bookNow(productId, restaurantId) {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("⚠️ Please login to book");
    return;
  }

  fetch("http://localhost:5000/api/orders/order-all", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      cart: [{ productId, restaurantId }]
    })
  })
    .then(res => res.json())
    .then(data => {
      alert("✅ Order placed (dummy)");
    })
    .catch(err => alert("❌ Error: " + err.message));
}

loadWishlist();
