const apiBase = "http://localhost:5000/api";

// Elements
const searchBar = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceRange");
const priceLabel = document.getElementById("priceLabel");

window.onload = () => {
  fetchProducts();
};



// Fetch products from backend
async function fetchProducts(query = "") {
  try {
    let url = `${apiBase}/products?`;

    if (query) url += `search=${encodeURIComponent(query)}&`;
    if (categoryFilter.value) url += `category=${categoryFilter.value}&`;
    url += `maxPrice=${priceFilter.value}`;

    const res = await fetch(url);
    const products = await res.json();

    displayProducts(products);
  } catch (err) {
    productList.innerHTML = "<p>❌ Failed to load products</p>";
  }
}


// Display products in UI
function displayProducts(products) {
  if (!products || products.length === 0) {
    productList.innerHTML = "<p>No products found!</p>";
    return;
  }

  productList.innerHTML = products
    .map(
      (p) => `
      <div class="product-card">
        <img src="${p.imageUrl || 'https://via.placeholder.com/200'}" alt="${p.name}" />
        <h4>${p.name}</h4>
        <p>${p.description || 'No description available'}</p>
        <p class="price">₹${p.price}</p>
<button onclick="addToWishlist('${p._id}', '${p.restaurant}')">❤️ Wishlist</button>
        <button onclick="addToCart('${p._id}', '${p.restaurant}')">
🛒 Cart</button>
      </div>
    `
    )
    .join("");
}

function loadPopularSections() {
  // Dummy popular restaurants
  const restaurants = [
    { name: "Spicy Hub", rating: 4.8 },
    { name: "Tasty Treats", rating: 4.6 },
    { name: "Veg Delight", rating: 4.5 }
  ];

  const dishes = [
    { name: "Paneer Tikka", rating: 4.9 },
    { name: "Chicken Biryani", rating: 4.7 },
    { name: "Masala Dosa", rating: 4.6 }
  ];

  const restDiv = document.getElementById("popularRestaurants");
  const dishDiv = document.getElementById("popularDishes");

  restDiv.innerHTML = restaurants.map(r => `
    <div class="card"><h4>${r.name}</h4><p>⭐ ${r.rating}</p></div>
  `).join("");

  dishDiv.innerHTML = dishes.map(d => `
    <div class="card"><h4>${d.name}</h4><p>⭐ ${d.rating}</p></div>
  `).join("");
}

window.onload = () => {
  loadPopularSections();
  fetchProducts();
};


// Search bar
searchBar.addEventListener("input", () => {
  const query = searchBar.value.trim();
  fetchProducts(query);
});

// Wishlist (dummy)
function addToWishlist(productId, restaurantId) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist.push({ productId, restaurantId });
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  alert("✅ Added to wishlist");
}


function addToCart(productId, restaurantId) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ productId, restaurantId });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("✅ Product added to cart!");
}


categoryFilter.addEventListener("change", () => fetchProducts());
priceFilter.addEventListener("input", () => {
  priceLabel.textContent = `₹${priceFilter.value}`;
  fetchProducts();
});


