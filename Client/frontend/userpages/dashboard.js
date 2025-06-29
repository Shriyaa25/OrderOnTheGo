const userId = localStorage.getItem("userId");
const usernameSpan = document.getElementById("username");
const emailSpan = document.getElementById("email");
const ordersList = document.getElementById("ordersList");

// Load profile and orders
async function loadDashboard() {
  if (!userId) {
    alert("❌ Please login first!");
    location.href = "../login.html";
    return;
  }

  try {
    // Fetch user data
const resUser = await fetch(`http://localhost:5000/api/users/user/${userId}`);
    const user = await resUser.json();

    usernameSpan.textContent = user.username;
    emailSpan.textContent = user.email;

    // Fetch orders
    const resOrders = await fetch(`http://localhost:5000/api/orders/user/${userId}`);
    const orders = await resOrders.json();

    if (orders.length === 0) {
      ordersList.innerHTML = "<p>You haven't placed any orders yet.</p>";
    } else {
      ordersList.innerHTML = orders.map(o => `
        <div class="order-card">
          <p>🧾 <strong>Product:</strong> ${o.productId?.name || "N/A"}</p>
          <p>🏪 <strong>Restaurant:</strong> ${o.restaurantId?.username || "N/A"}</p>
          <p>📦 <strong>Status:</strong> Order confirmed (dummy)</p>
        </div>
      `).join("");
    }

  } catch (err) {
    console.error("Dashboard load error:", err);
  }
}

function editProfile() {
  const newName = prompt("Enter new username:");
  if (!newName) return;

  fetch(`http://localhost:5000/api/users/update/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: newName })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert("❌ " + data.error);
      } else {
        alert("✅ Profile updated!");
        loadDashboard();
      }
    })
    .catch(err => {
      console.error("Update failed:", err);
      alert("❌ Failed to update profile");
    });
}



// Delete account
function deleteAccount() {
  if (!confirm("⚠️ Are you sure you want to delete your account?")) return;

  fetch(`http://localhost:5000/api/admin/delete-user/${userId}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      alert("✅ Account deleted");
      localStorage.clear();
      location.href = "../login.html";
    })
    .catch(err => alert("❌ Failed to delete account"));
}

// Logout
function logout() {
  localStorage.clear();
  location.href = "../login.html";
}

loadDashboard();
