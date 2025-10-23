document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginPage = document.getElementById("login-page");
  const mainApp = document.getElementById("main-app");
  const loadingScreen = document.getElementById("loading-screen");

  // Retrieve saved users
  let users = JSON.parse(localStorage.getItem("kentbook_users")) || [
    { username: "kent", password: "12345", email: "kent@example.com", name: "Kent Wilan" },
    { username: "alice", password: "12345", email: "alice@example.com", name: "Alice Cooper" },
    { username: "mark", password: "12345", email: "mark@example.com", name: "Mark Wilson" }
  ];

  // Save users to localStorage
  localStorage.setItem("kentbook_users", JSON.stringify(users));

  // === FUNCTION: Show main app after login ===
  function showApp() {
    loginPage.style.display = "none";
    
    if (loadingScreen) {
      loadingScreen.style.display = "flex";
    }

    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.style.display = "none";
      }
      mainApp.style.display = "block";

      // Update user profile in sidebar
      updateUserProfile();

      // Navigate to home route
      if (window.App && App.router) {
        App.router.navigate("home", { trigger: true });
      } else {
        location.hash = "#home";
      }
    }, 1500);
  }

  // Update user profile in sidebar
  function updateUserProfile() {
    const currentUser = users.find(u => u.username === localStorage.getItem("kentbook_current_user"));
    if (currentUser) {
      const profileCard = document.querySelector('.profile-card .info .name');
      if (profileCard) {
        profileCard.textContent = currentUser.name;
      }
      
      // Update topbar avatar if needed
      const topbarAvatar = document.querySelector('.topbar-right .avatar');
      if (topbarAvatar && currentUser.avatar) {
        topbarAvatar.src = currentUser.avatar;
      }
    }
  }

  // === LOGIN ===
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const enteredUser = document.getElementById("username").value.trim();
      const enteredPass = document.getElementById("password").value.trim();

      // Validate inputs
      if (!enteredUser || !enteredPass) {
        showLoginError("Please enter both username and password");
        return;
      }

      const foundUser = users.find(
        (u) => u.username === enteredUser || u.email === enteredUser
      );

      if (foundUser && foundUser.password === enteredPass) {
        localStorage.setItem("kentbook_logged_in", "true");
        localStorage.setItem("kentbook_current_user", foundUser.username);
        showApp();
      } else {
        showLoginError("Invalid login credentials! Try: kent / 12345");
      }
    });
  }

  // Show login error with style
  function showLoginError(message) {
    // Remove existing error message
    const existingError = document.querySelector('.login-error');
    if (existingError) {
      existingError.remove();
    }

    // Create error message element
    const errorEl = document.createElement('div');
    errorEl.className = 'login-error';
    errorEl.style.cssText = `
      background: #ffe6e6;
      color: #d32f2f;
      padding: 12px;
      border-radius: 6px;
      margin: 16px 0;
      text-align: center;
      font-size: 14px;
      border: 1px solid #ffcdd2;
    `;
    errorEl.textContent = message;

    // Insert after form
    const form = document.getElementById('loginForm');
    if (form) {
      form.parentNode.insertBefore(errorEl, form.nextSibling);
    }

    // Shake animation for inputs
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      input.style.borderColor = '#d32f2f';
      input.classList.add('shake');
      setTimeout(() => {
        input.classList.remove('shake');
      }, 500);
    });
  }

  // Create account button handler
  const createAccountBtn = document.querySelector('.create-account-btn');
  if (createAccountBtn) {
    createAccountBtn.addEventListener('click', function() {
      alert('Account creation would go here! For now, use:\nUsername: kent\nPassword: 12345');
    });
  }

  // Forgot password handler
  const forgotPassword = document.querySelector('.forgot-password a');
  if (forgotPassword) {
    forgotPassword.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Password reset feature would go here!');
    });
  }

  // Auto-login if already authenticated
  if (localStorage.getItem("kentbook_logged_in") === "true") {
    showApp();
  } else {
    // Ensure login page is visible
    loginPage.style.display = "flex";
    mainApp.style.display = "none";
    if (loadingScreen) {
      loadingScreen.style.display = "none";
    }
  }

  // Add CSS for shake animation
  if (!document.querySelector('#login-styles')) {
    const style = document.createElement('style');
    style.id = 'login-styles';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
      .shake {
        animation: shake 0.3s ease-in-out;
      }
      .login-card input:focus {
        border-color: var(--primary) !important;
        box-shadow: 0 0 0 2px rgba(24, 119, 242, 0.2) !important;
      }
    `;
    document.head.appendChild(style);
  }
});