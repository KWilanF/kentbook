document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginPage = document.getElementById("login-page");

  // App sections
  const header = document.querySelector("header.topbar");
  const mainLayout = document.querySelector("main.layout");
  const footer = document.querySelector("footer.footer");

  // Loader
  const loader = document.createElement("div");
  loader.className = "loading-screen";
  loader.innerHTML = `
    <div class="loader-logo">KentBook</div>
    <div class="spinner"></div>
  `;
  document.body.appendChild(loader);
  loader.style.display = "none";

  // Retrieve users from localStorage or create default
  let users = JSON.parse(localStorage.getItem("kentbook_users")) || [
    { username: "kent", password: "12345", email: "kent@example.com" }
  ];

  // === LOGIN FUNCTION ===
  function showApp() {
    loader.style.display = "flex";
    loginPage.style.display = "none";

    setTimeout(() => {
      loader.style.display = "none";
      header.style.display = "flex";
      mainLayout.style.display = "flex";
      footer.style.display = "block";

      // Always go to home route
      if (window.App && App.router) {
        App.router.navigate("home", { trigger: true });
      } else {
        location.hash = "#home";
      }
    }, 2000);
  }

  // === LOGIN SUBMIT ===
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

  // === SIGNUP FORM ===
  const signupContainer = document.getElementById("signupFormContainer");
  const signupForm = document.getElementById("signupForm");
  const showSignupLink = document.getElementById("showSignup");
  const backToLogin = document.getElementById("backToLogin");

  if (showSignupLink) {
    showSignupLink.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(".login-card form").style.display = "none";
      document.querySelector(".signup-link").style.display = "none";
      signupContainer.style.display = "block";
    });
  }

  if (backToLogin) {
    backToLogin.addEventListener("click", function (e) {
      e.preventDefault();
      signupContainer.style.display = "none";
      document.querySelector(".login-card form").style.display = "block";
      document.querySelector(".signup-link").style.display = "block";
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const newUser = {
        username: document.getElementById("newUsername").value.trim(),
        email: document.getElementById("newEmail").value.trim(),
        password: document.getElementById("newPassword").value.trim(),
      };

      // Check if username exists
      const exists = users.some((u) => u.username === newUser.username);
      if (exists) {
        alert("Username already exists. Please choose another.");
        return;
      }

      users.push(newUser);
      localStorage.setItem("kentbook_users", JSON.stringify(users));

      alert("Account created successfully! You can now log in.");
      signupContainer.style.display = "none";
      document.querySelector(".login-card form").style.display = "block";
      document.querySelector(".signup-link").style.display = "block";
    });
  }

  // Auto-login check
  if (localStorage.getItem("kentbook_logged_in") === "true") {
    showApp();
  }
});
