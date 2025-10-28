document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginPage = document.getElementById("login-page");
  const mainApp = document.getElementById("main-app");
  const loadingScreen = document.getElementById("loading-screen");
  const createAccountBtn = document.getElementById("createAccountBtn");

  // Initialize users array
  function initializeUsers() {
    let users = JSON.parse(localStorage.getItem("kentbook_users")) || [];
    if (users.length === 0) {
      localStorage.setItem("kentbook_users", JSON.stringify(users));
      console.log("Initialized empty users array");
    }
    return users;
  }

  const users = initializeUsers();

  // === FUNCTION: Create new user with profile picture setup ===
  function createNewUser(userData) {
    const users = JSON.parse(localStorage.getItem('kentbook_users') || '[]');
    
    // New users get default pp.png and complete profile data
    const newUser = {
      ...userData,
      avatar: 'images/pp.png', // Default for new users
      isOnline: true,
      location: "Manila, Philippines",
      workplace: "KentBook",
      education: "University of the Philippines",
      joinedDate: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('kentbook_users', JSON.stringify(users));
    
    // Initialize with default profile picture
    if (typeof ProfilePictureManager !== 'undefined') {
      const profileManager = ProfilePictureManager.getInstance();
      profileManager.saveUserProfilePicture(userData.username, 'images/pp.png');
      console.log("✅ Profile picture initialized for new user:", userData.username);
    }
    
    // Create sample content for new user
    createSampleContentForNewUser(newUser);
    
    return newUser;
  }

  // === FUNCTION: Create sample content for new user ===
  function createSampleContentForNewUser(user) {
    try {
      // Get existing app data
      const appData = JSON.parse(localStorage.getItem('kentbook_data_v1')) || {
        users: [],
        posts: [],
        comments: []
      };
      
      // Add user to Backbone users if not exists
      const userExists = appData.users.some(u => u.username === user.username);
      if (!userExists) {
        appData.users.push({
          id: 1, // Simple ID for demo
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar,
          isOnline: true,
          username: user.username,
          location: user.location,
          workplace: user.workplace,
          education: user.education
        });
      }
      
      // Add welcome post for new user - FIXED VERSION
      const welcomePost = {
        id: 'welcome_post_' + Date.now(),
        user_id: 1,
        user_name: user.name,
        user_username: user.username, // ← CRITICAL: This must match the username
        body: `Welcome to KentBook, ${user.firstName || user.name}! This is your first post. Feel free to edit or delete it and start sharing with your friends! 🎉`,
        image: '',
        likes: 0,
        comments: 0,
        shares: 0,
        created_at: new Date().toISOString(),
        liked: false,
        is_profile_post: true
      };
      
      // Check if welcome post already exists for this user
      const userWelcomePostExists = appData.posts.some(p => 
        p.user_username === user.username && p.body && p.body.includes('Welcome to KentBook')
      );
      
      if (!userWelcomePostExists) {
        appData.posts.push(welcomePost);
        console.log("✅ Welcome post created for user:", user.username);
      } else {
        console.log("ℹ️ Welcome post already exists for user:", user.username);
      }
      
      // Save updated data
      localStorage.setItem('kentbook_data_v1', JSON.stringify(appData));
      console.log("✅ Sample content created/verified for new user:", user.username);
      
      // Debug: Verify the post was saved
      const verifyData = JSON.parse(localStorage.getItem('kentbook_data_v1')) || {};
      const userPosts = verifyData.posts?.filter(p => p.user_username === user.username) || [];
      console.log("✅ User posts after creation:", userPosts);
      
    } catch (error) {
      console.error("Error creating sample content:", error);
    }
  }

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

      updateUserProfile();

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
      
      const dropdownProfileName = document.querySelector('.dropdown-profile-name');
      if (dropdownProfileName) {
        dropdownProfileName.textContent = currentUser.name || currentUser.firstName + ' ' + currentUser.lastName;
      }
    }
  }

  // Toggle password visibility
  function togglePasswordVisibility(inputId, toggleBtn) {
    const passwordInput = document.getElementById(inputId);
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#65676B">
          <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
        </svg>
      `;
      toggleBtn.title = "Hide password";
    } else {
      passwordInput.type = 'password';
      toggleBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#65676B">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
      `;
      toggleBtn.title = "Show password";
    }
  }

  // Add password toggle to login form (Facebook-style - inside but at the end)
  function addLoginPasswordToggle() {
    const passwordInput = document.getElementById('password');
    if (passwordInput && !document.getElementById('loginTogglePassword')) {
      const passwordWrapper = document.createElement('div');
      passwordWrapper.style.cssText = `
        position: relative;
        margin-bottom: 12px;
      `;
      
      // Wrap the existing password input
      const parent = passwordInput.parentNode;
      parent.insertBefore(passwordWrapper, passwordInput);
      passwordWrapper.appendChild(passwordInput);
      
      // Add toggle button (Facebook-style - inside at the end)
      const toggleBtn = document.createElement('button');
      toggleBtn.id = 'loginTogglePassword';
      toggleBtn.type = 'button';
      toggleBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#65676B">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
      `;
      toggleBtn.title = "Show password";
      toggleBtn.style.cssText = `
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        color: #65676b;
        padding: 6px;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      
      toggleBtn.addEventListener('click', () => {
        togglePasswordVisibility('password', toggleBtn);
      });
      
      toggleBtn.addEventListener('mouseenter', () => {
        toggleBtn.style.background = '#f0f2f5';
      });
      
      toggleBtn.addEventListener('mouseleave', () => {
        toggleBtn.style.background = 'none';
      });
      
      passwordWrapper.appendChild(toggleBtn);
      
      // Update input style to accommodate toggle (Facebook-style padding)
      passwordInput.style.paddingRight = '44px';
      passwordInput.style.paddingLeft = '12px';
      passwordInput.style.height = '52px';
      passwordInput.style.fontSize = '16px';
      passwordInput.style.borderRadius = '6px';
      passwordInput.style.border = '1px solid #dddfe2';
    }
  }

  // === LOGIN ===
  if (loginForm) {
    // Add password toggle to login form
    addLoginPasswordToggle();
    
    // Style the username/email input to match Facebook
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
      usernameInput.style.padding = '14px 12px';
      usernameInput.style.height = '52px';
      usernameInput.style.fontSize = '16px';
      usernameInput.style.borderRadius = '6px';
      usernameInput.style.border = '1px solid #dddfe2';
      usernameInput.style.marginBottom = '12px';
    }
    
    // Style the login button to match Facebook
    const loginButton = loginForm.querySelector('button[type="submit"]');
    if (loginButton) {
      loginButton.style.height = '48px';
      loginButton.style.fontSize = '18px';
      loginButton.style.fontWeight = '600';
      loginButton.style.borderRadius = '6px';
      loginButton.style.marginBottom = '16px';
    }
    
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const enteredUser = document.getElementById("username").value.trim();
      const enteredPass = document.getElementById("password").value.trim();

      if (!enteredUser || !enteredPass) {
        showLoginError("Please enter both username/email and password");
        return;
      }

      const currentUsers = JSON.parse(localStorage.getItem("kentbook_users")) || [];
      
      console.log("Login attempt - Username:", enteredUser, "Users in system:", currentUsers.map(u => u.username));
      
      const foundUser = currentUsers.find(
        (u) => u.username === enteredUser || u.email === enteredUser
      );

      if (foundUser) {
        console.log("Found user:", foundUser.username, "Stored password:", foundUser.password, "Entered password:", enteredPass);
      }

      if (foundUser && foundUser.password === enteredPass) {
        localStorage.setItem("kentbook_logged_in", "true");
        localStorage.setItem("kentbook_current_user", foundUser.username);
        console.log("Login successful for user:", foundUser.username);
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

  // Create account button handler
  if (createAccountBtn) {
    createAccountBtn.addEventListener('click', function() {
      showSignupModal();
    });
  }

// Show signup modal - FIXED VERSION
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
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: Helvetica, Arial, sans-serif;
        padding: 20px;
        box-sizing: border-box;
    `;

    const modalContent = document.createElement('div');
    modalContent.className = 'signup-modal';
    modalContent.style.cssText = `
        background: white;
        border-radius: 8px;
        width: 432px;
        max-width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1);
        animation: modalAppear 0.3s ease-out;
    `;

    modalContent.innerHTML = `
        <div class="signup-header" style="padding: 16px 16px 0;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1;">
                    <h2 style="color: #1c1e21; margin: 0; font-size: 32px; font-weight: 600; line-height: 38px;">Sign Up</h2>
                    <p style="color: #606770; margin: 0; font-size: 15px; margin-top: 4px;">It's quick and easy.</p>
                </div>
                <button id="closeSignupModal" style="background: #e4e6eb; border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 20px; color: #606770; flex-shrink: 0; margin-left: 16px;">×</button>
            </div>
        </div>

        <form id="signupForm" style="padding: 16px;">
            <div style="border-top: 1px solid #dadde1; margin: 0 -16px 16px;"></div>
            
            <div class="name-fields" style="display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
                <input type="text" id="signupFirstName" placeholder="First name" style="flex: 1; min-width: 120px; padding: 11px; border: 1px solid #ccd0d5; border-radius: 5px; font-size: 14px; height: 40px; box-sizing: border-box; background: #f5f6f7; font-family: inherit;" required />
                <input type="text" id="signupLastName" placeholder="Last name" style="flex: 1; min-width: 120px; padding: 11px; border: 1px solid #ccd0d5; border-radius: 5px; font-size: 14px; height: 40px; box-sizing: border-box; background: #f5f6f7; font-family: inherit;" required />
            </div>

            <input type="email" id="signupEmail" placeholder="Email address" style="width: 100%; padding: 11px; border: 1px solid #ccd0d5; border-radius: 5px; font-size: 14px; height: 40px; margin-bottom: 10px; box-sizing: border-box; background: #f5f6f7; font-family: inherit;" required />
            
            <!-- Password field with Facebook-style toggle -->
            <div style="position: relative; margin-bottom: 10px;">
                <input type="password" id="signupPassword" placeholder="Password" style="width: 100%; padding: 11px 44px 11px 12px; border: 1px solid #ccd0d5; border-radius: 5px; font-size: 14px; height: 40px; box-sizing: border-box; background: #f5f6f7; font-family: inherit;" required />
                <button type="button" id="toggleSignupPassword" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #606770; padding: 6px; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;" title="Show password">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#606770">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                </button>
            </div>
            
            <!-- Confirm Password field with Facebook-style toggle -->
            <div style="position: relative; margin-bottom: 16px;">
                <input type="password" id="confirmPassword" placeholder="Confirm Password" style="width: 100%; padding: 11px 44px 11px 12px; border: 1px solid #ccd0d5; border-radius: 5px; font-size: 14px; height: 40px; box-sizing: border-box; background: #f5f6f7; font-family: inherit;" required />
                <button type="button" id="toggleConfirmPassword" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #606770; padding: 6px; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;" title="Show password">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#606770">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                </button>
            </div>

            <div style="font-size: 11px; color: #777; text-align: center; margin: 16px 0; line-height: 1.4;">
                By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. 
            </div>

            <button type="submit" style="width: 60%; margin: 0 auto; display: block; background: #00a400; color: white; border: none; border-radius: 6px; padding: 8px; font-size: 18px; font-weight: bold; cursor: pointer; height: 36px; font-family: inherit; min-width: 120px;">
                Sign Up
            </button>
        </form>

        <div style="text-align: center; padding: 16px; border-top: 1px solid #dadde1; background: #f5f6f7;">
            <a href="#" style="color: #1877f2; text-decoration: none; font-size: 15px; font-weight: 600;"></a>
        </div>
    `;

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Add animation and responsive styles
    if (!document.getElementById('modal-responsive-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-responsive-styles';
        style.textContent = `
            @keyframes modalAppear {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            .signup-modal-overlay {
                backdrop-filter: blur(2px);
            }
            
            input:focus, select:focus {
                outline: none;
                border-color: #1877f2 !important;
                box-shadow: 0 0 0 2px #e7f3ff;
            }
            
            button[type="submit"]:hover {
                background: #42b72a !important;
            }
            
            #closeSignupModal:hover {
                background: #d8dadf !important;
            }
            
            /* Mobile Responsive Styles */
            @media (max-width: 480px) {
                .signup-modal-overlay {
                    padding: 10px;
                    align-items: flex-start;
                    padding-top: 20px;
                }
                
                .signup-modal {
                    width: 100% !important;
                    max-width: 100% !important;
                    margin: 0 auto;
                }
                
                .name-fields {
                    flex-direction: column;
                    gap: 8px !important;
                }
                
                .name-fields input {
                    min-width: 100% !important;
                    flex: none !important;
                }
                
                #signupForm {
                    padding: 12px !important;
                }
                
                .signup-header h2 {
                    font-size: 24px !important;
                    line-height: 28px !important;
                }
                
                .signup-header p {
                    font-size: 14px !important;
                }
                
                button[type="submit"] {
                    width: 80% !important;
                    min-width: 140px !important;
                }
                
                input {
                    font-size: 15px !important; /* Prevents zoom on iOS */
                }
            }
            
            @media (max-width: 320px) {
                .signup-modal-overlay {
                    padding: 5px;
                }
                
                #signupForm {
                    padding: 8px !important;
                }
                
                .signup-header {
                    padding: 12px 12px 0 !important;
                }
                
                input {
                    padding: 8px !important;
                    height: 36px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    const closeBtn = document.getElementById('closeSignupModal');
    closeBtn.addEventListener('click', () => {
        modalOverlay.remove();
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.remove();
        }
    });

    // Add hover effects and functionality to signup form toggles
    const toggleSignupPassword = document.getElementById('toggleSignupPassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

    // Add hover effects
    [toggleSignupPassword, toggleConfirmPassword].forEach(btn => {
        if (btn) {
            btn.addEventListener('mouseenter', () => {
                btn.style.background = '#f0f2f5';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'none';
            });
        }
    });

    // Add toggle functionality with correct IDs
    if (toggleSignupPassword) {
        toggleSignupPassword.addEventListener('click', function() {
            togglePasswordVisibility('signupPassword', this);
        });
    }

    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function() {
            togglePasswordVisibility('confirmPassword', this);
        });
    }

    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', handleSignup);
}

  // Handle signup form submission - UPDATED with complete user data
  function handleSignup(e) {
    e.preventDefault();
    console.log("=== SIGNUP PROCESS STARTED ===");

    // Get form values - DON'T TRIM PASSWORDS!
    const firstName = document.getElementById('signupFirstName').value.trim();
    const lastName = document.getElementById('signupLastName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    console.log("Form values:", { 
      firstName, lastName, email, 
      password: `"${password}"`, 
      confirmPassword: `"${confirmPassword}"` 
    });

    // Simple validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      console.log("Validation failed: Empty fields");
      showSignupError("Please fill in all fields");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      console.log("Validation failed: Passwords don't match exactly");
      showSignupError(`Passwords do not match. Please make sure both passwords are exactly the same.`);
      return;
    }

    // Generate username from email (everything before @)
    const username = email.split('@')[0];
    console.log("Generated username from email:", username);

    // Get existing users
    const users = JSON.parse(localStorage.getItem("kentbook_users")) || [];
    console.log("Current users in storage:", users);

    // Check if username already exists
    if (users.some(user => user.username === username)) {
      console.log("Validation failed: Username exists");
      showSignupError("An account with this email already exists");
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email === email)) {
      console.log("Validation failed: Email exists");
      showSignupError("Email already registered");
      return;
    }

    // Create new user object WITH COMPLETE PROFILE DATA
    const userData = {
      id: Date.now(), // Simple ID generation
      firstName: firstName,
      lastName: lastName,
      name: `${firstName} ${lastName}`,
      email: email,
      username: username,
      password: password,
      avatar: 'images/pp.png',
      isOnline: true,
      location: "Manila, Philippines",
      workplace: "KentBook",
      education: "University of the Philippines",
      joinedDate: new Date().toISOString()
    };

    console.log("Creating new user with complete profile:", userData);

    // Use the createNewUser function to create user with profile picture setup and sample content
    const newUser = createNewUser(userData);

    // Verify the save worked
    const verifyUsers = JSON.parse(localStorage.getItem("kentbook_users")) || [];
    console.log("Users after save:", verifyUsers);

    // Also verify profile picture was saved
    let profilePictureVerified = false;
    if (typeof ProfilePictureManager !== 'undefined') {
      const profileManager = ProfilePictureManager.getInstance();
      const savedPicture = profileManager.getUserProfilePicture(username);
      profilePictureVerified = savedPicture === 'images/pp.png';
      console.log("Profile picture verification:", profilePictureVerified, savedPicture);
    }

    if (verifyUsers.some(user => user.username === username)) {
      console.log("✅ User successfully saved to localStorage!");
      console.log("✅ Profile picture setup:", profilePictureVerified ? "SUCCESS" : "PENDING");
      console.log("✅ Sample content created for new user");
      showSignupSuccess();
    } else {
      console.log("❌ Failed to save user");
      showSignupError("Failed to create account. Please try again.");
    }
  }

  // Show signup success
  function showSignupSuccess() {
    const modalOverlay = document.querySelector('.signup-modal-overlay');
    if (!modalOverlay) return;

    modalOverlay.innerHTML = `
      <div style="background: white; padding: 40px; border-radius: 8px; text-align: center; max-width: 400px;">
        <div style="color: #00a400; font-size: 48px; margin-bottom: 20px;">✓</div>
        <h3 style="color: #1877f2; margin-bottom: 10px;">Account Created Successfully!</h3>
        <p style="color: #606770; margin-bottom: 20px;">Your profile has been set up with sample content. You can now log in with your email address.</p>
        <button id="closeSuccessModal" style="background: #1877f2; color: white; border: none; border-radius: 6px; padding: 12px 24px; font-size: 16px; cursor: pointer;">
          Continue to Login
        </button>
      </div>
    `;

    document.getElementById('closeSuccessModal').addEventListener('click', () => {
      modalOverlay.remove();
    });
  }

  // Show signup error
  function showSignupError(message) {
    console.log("Showing signup error:", message);
    
    const existingError = document.querySelector('.signup-error');
    if (existingError) {
      existingError.remove();
    }

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
      /* Password toggle button styles */
      .password-toggle-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: #65676b;
        padding: 6px;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
      }
      .password-toggle-btn:hover {
        background: #f0f2f5;
      }
    `;
    document.head.appendChild(style);
  }
});