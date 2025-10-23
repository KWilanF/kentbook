document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginPage = document.getElementById("login-page");

  // App sections
  const header = document.querySelector("header.topbar");
  const mainLayout = document.querySelector("main.layout");
  const footer = document.querySelector("footer.footer");

  // Create loader element dynamically
  const loader = document.createElement("div");
  loader.className = "loading-screen";
  loader.innerHTML = `
    <div class="loader-logo">KentBook</div>
    <div class="spinner"></div>
  `;
  document.body.appendChild(loader);
  loader.style.display = "none";

  // Demo user credentials
  const USER = {
    username: "kent",
    password: "12345"
  };

 function showApp() {
  // Show loader first
  loader.style.display = "flex";
  loginPage.style.display = "none";

  setTimeout(() => {
    // After 2 seconds, hide loader and show app
    loader.style.display = "none";
    header.style.display = "flex";
    mainLayout.style.display = "flex";
    footer.style.display = "block";

    // 🟦 Force route to Home after login
    if (window.App && App.router) {
      App.router.navigate("home", { trigger: true });
    } else {
      location.hash = "#home"; // fallback if router isn't ready yet
    }
  }, 2000);
}

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const enteredUser = document.getElementById("username").value.trim();
      const enteredPass = document.getElementById("password").value.trim();

      if (enteredUser === USER.username && enteredPass === USER.password) {
        localStorage.setItem("kentbook_logged_in", "true");
        showApp();
      } else {
        alert("Invalid login credentials!");
      }
    });
  }

  // Auto-login if user already authenticated
  if (localStorage.getItem("kentbook_logged_in") === "true") {
    showApp();
  }
});
