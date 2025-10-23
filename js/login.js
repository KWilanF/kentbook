document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginPage = document.getElementById("login-page");

  // Get app layout sections
  const header = document.querySelector("header.topbar");
  const mainLayout = document.querySelector("main.layout");
  const footer = document.querySelector("footer.footer");

  // Demo user — you can later replace with real data
  const USER = {
    username: "kent",
    password: "12345"
  };

  function showApp() {
    loginPage.style.display = "none";
    header.style.display = "flex";
    mainLayout.style.display = "flex";
    footer.style.display = "block";
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

  // Auto-login if already authenticated
  if (localStorage.getItem("kentbook_logged_in") === "true") {
    showApp();
  }
});
