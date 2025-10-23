document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginPage = document.getElementById("login-page");
  const mainApp = document.getElementById("main-app"); // ✅ Main wrapper

  // Create loading screen
  const loader = document.createElement("div");
  loader.className = "loading-screen";
  loader.innerHTML = `
    <div class="loader-logo">KentBook</div>
    <div class="spinner"></div>
  `;
  document.body.appendChild(loader);
  loader.style.display = "none";

  // Retrieve saved users
  let users = JSON.parse(localStorage.getItem("kentbook_users")) || [
    { username: "kent", password: "12345", email: "kent@example.com" }
  ];

  // === FUNCTION: Show main app after login ===
  function showApp() {
    loader.style.display = "flex";
    loginPage.style.display = "none";

    setTimeout(() => {
      loader.style.display = "none";
      mainApp.style.display = "block"; // ✅ FIXED: show wrapper instead of header/main/footer

      // Navigate to home route
      if (window.App && App.router) {
        App.router.navigate("home", { trigger: true });
      } else {
        location.hash = "#home";
      }
    }, 2000);
  }

  // === LOGIN ===
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const enteredUser = document.getElementById("username").value.trim();
      const enteredPass = document.getElementById("password").value.trim();

      const foundUser = users.find(
        (u) => u.username === enteredUser && u.password === enteredPass
      );

      if (foundUser) {
        localStorage.setItem("kentbook_logged_in", "true");
        showApp();
      } else {
        alert("Invalid login credentials!");
      }
    });
  }

  // Auto-login if already authenticated
  if (localStorage.getItem("kentbook_logged_in") === "true") {
    showApp();
  }
});
