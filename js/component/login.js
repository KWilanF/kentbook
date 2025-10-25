document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginPage = document.getElementById("login-page");
  const mainApp = document.getElementById("main-app");
  const loadingScreen = document.getElementById("loading-screen");
  const createAccountBtn = document.getElementById("createAccountBtn");

  // Initialize users array
  function initializeUsers() {
    let users = JSON.parse(localStorage.getItem("kentbook_users")) || [];
    localStorage.setItem("kentbook_users", JSON.stringify(users));
    return users;
  }

  const users = initializeUsers();

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
    const currentUsername = localStorage.getItem("kentbook_current_user");
    const users = JSON.parse(localStorage.getItem("kentbook_users")) || [];
    const currentUser = users.find(u => u.username === currentUsername);
    
    if (currentUser) {
      const profileCard = document.querySelector('.profile-card .info .name');
      if (profileCard) {
        profileCard.textContent = currentUser.name || currentUser.firstName + ' ' + currentUser.lastName;
      }
      
      // Update dropdown profile name
      const dropdownProfileName = document.querySelector('.dropdown-profile-name');
      if (dropdownProfileName) {
        dropdownProfileName.textContent = currentUser.name || currentUser.firstName + ' ' + currentUser.lastName;
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
        showLoginError("Please enter both username/email and password");
        return;
      }

      // Get current users list from localStorage
      const currentUsers = JSON.parse(localStorage.getItem("kentbook_users")) || [];
      
      const foundUser = currentUsers.find(
        (u) => u.username === enteredUser || u.email === enteredUser
      );

      if (foundUser && foundUser.password === enteredPass) {
        // Login successful
        localStorage.setItem("kentbook_logged_in", "true");
        localStorage.setItem("kentbook_current_user", foundUser.username);
        showApp();
      } else {
        showLoginError("Invalid login credentials! Please check your username/email and password.");
      }
    });
  }

  // Show login error with style
  function showLoginError(message) {
    const existingError = document.querySelector('.login-error');
    if (existingError) {
      existingError.remove();
    }

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

    const form = document.getElementById('loginForm');
    if (form) {
      form.parentNode.insertBefore(errorEl, form.nextSibling);
    }

    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      input.style.borderColor = '#d32f2f';
      input.classList.add('shake');
      setTimeout(() => {
        input.classList.remove('shake');
      }, 500);
    });
  }

  // Create account button handler - Show signup modal
  if (createAccountBtn) {
    createAccountBtn.addEventListener('click', function() {
      showSignupModal();
    });
  }

  // Show signup modal
  function showSignupModal() {
    const existingModal = document.querySelector('.signup-modal-overlay');
    if (existingModal) {
      existingModal.remove();
    }

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'signup-modal-overlay';
    modalOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;

    const modalContent = document.createElement('div');
    modalContent.className = 'signup-modal';
    modalContent.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 8px;
      width: 90%;
      max-width: 400px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    `;

    modalContent.innerHTML = `
      <div class="signup-header" style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #1877f2; margin: 0 0 8px 0;">Sign Up</h2>
        <p style="color: #606770; margin: 0;">It's quick and easy.</p>
        <div style="text-align: right;">
          <button id="closeSignupModal" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #65676b;">×</button>
        </div>
      </div>

      <form id="signupForm">
        <input type="text" id="firstName" placeholder="First name" style="width: 100%; padding: 11px; border: 1px solid #dddfe2; border-radius: 6px; font-size: 15px; margin-bottom: 12px; box-sizing: border-box;" required />
        
        <input type="text" id="lastName" placeholder="Last name" style="width: 100%; padding: 11px; border: 1px solid #dddfe2; border-radius: 6px; font-size: 15px; margin-bottom: 12px; box-sizing: border-box;" required />

        <input type="email" id="email" placeholder="Email address" style="width: 100%; padding: 11px; border: 1px solid #dddfe2; border-radius: 6px; font-size: 15px; margin-bottom: 12px; box-sizing: border-box;" required />
        
        <input type="text" id="username" placeholder="Username" style="width: 100%; padding: 11px; border: 1px solid #dddfe2; border-radius: 6px; font-size: 15px; margin-bottom: 12px; box-sizing: border-box;" required />
        
        <input type="password" id="password" placeholder="Password" style="width: 100%; padding: 11px; border: 1px solid #dddfe2; border-radius: 6px; font-size: 15px; margin-bottom: 12px; box-sizing: border-box;" required />
        
        <input type="password" id="confirmPassword" placeholder="Confirm Password" style="width: 100%; padding: 11px; border: 1px solid #dddfe2; border-radius: 6px; font-size: 15px; margin-bottom: 16px; box-sizing: border-box;" required />

        <div style="font-size: 11px; color: #777; text-align: center; margin: 16px 0; line-height: 1.4;">
          By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. 
        </div>

        <button type="submit" style="width: 100%; background: #00a400; color: white; border: none; border-radius: 6px; padding: 12px; font-size: 18px; font-weight: bold; cursor: pointer;">
          Sign Up
        </button>
      </form>
    `;

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    const closeBtn = document.getElementById('closeSignupModal');
    closeBtn.addEventListener('click', () => {
      modalOverlay.remove();
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.remove();
      }
    });

    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', handleSignup);
  }

  // Handle signup form submission - SIMPLIFIED
  function handleSignup(e) {
    e.preventDefault();

    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Simple validation
    if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
      showSignupError("Please fill in all fields");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      showSignupError("Passwords do not match");
      return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem("kentbook_users")) || [];

    // Check if username already exists
    if (users.some(user => user.username === username)) {
      showSignupError("Username already exists");
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email === email)) {
      showSignupError("Email already registered");
      return;
    }

    // Create new user object
    const newUser = {
      firstName: firstName,
      lastName: lastName,
      name: `${firstName} ${lastName}`,
      email: email,
      username: username,
      password: password,
      joinedDate: new Date().toISOString()
    };

    // Add new user
    users.push(newUser);

    // Save to localStorage
    localStorage.setItem("kentbook_users", JSON.stringify(users));

    // Show success message
    showSignupSuccess();
  }

  // Show signup success
  function showSignupSuccess() {
    const modalOverlay = document.querySelector('.signup-modal-overlay');
    if (!modalOverlay) return;

    modalOverlay.innerHTML = `
      <div style="background: white; padding: 40px; border-radius: 8px; text-align: center; max-width: 400px;">
        <div style="color: #00a400; font-size: 48px; margin-bottom: 20px;">✓</div>
        <h3 style="color: #1877f2; margin-bottom: 10px;">Account Created Successfully!</h3>
        <p style="color: #606770; margin-bottom: 20px;">You can now log in with your credentials.</p>
        <button id="closeSuccessModal" style="background: #1877f2; color: white; border: none; border-radius: 6px; padding: 12px 24px; font-size: 16px; cursor: pointer;">
          Continue to Login
        </button>
      </div>
    `;

    document.getElementById('closeSuccessModal').addEventListener('click', () => {
      modalOverlay.remove();
    });
  }

  // Show signup error - ADDED THIS MISSING FUNCTION
  function showSignupError(message) {
    // Remove existing error message
    const existingError = document.querySelector('.signup-error');
    if (existingError) {
      existingError.remove();
    }

    // Create error message element
    const errorEl = document.createElement('div');
    errorEl.className = 'signup-error';
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
    const form = document.getElementById('signupForm');
    if (form) {
      form.parentNode.insertBefore(errorEl, form);
    }
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