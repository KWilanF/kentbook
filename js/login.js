document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginPage = document.getElementById("login-page");
  const mainApp = document.getElementById("main-app");

  // Demo user — later you can link this to localStorage or database
  const USER = {
    username: "kent",
    password: "12345"
  };

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const enteredUser = document.getElementById("username").value.trim();
      const enteredPass = document.getElementById("password").value.trim();

      if (enteredUser === USER.username && enteredPass === USER.password) {
        // Save login state (optional)
        localStorage.setItem("kentbook_logged_in", "true");

        // Show app and hide login page
        loginPage.style.display = "none";
        mainApp.style.display = "block";
      } else {
        alert("Invalid login credentials!");
      }
    });
  }

  // If user already logged in before, skip login page
  if (localStorage.getItem("kentbook_logged_in") === "true") {
    loginPage.style.display = "none";
    mainApp.style.display = "block";
  }
});
