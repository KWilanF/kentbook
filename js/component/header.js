(function(){
  'use strict';

  window.App = window.App || {};

  // Header functionality
  App.HeaderManager = {
    init: function() {
      this.bindMenuButton();
      this.bindDropdownNavigation();
      this.bindSearch();
    },

    // Bind menu button for dropdown
    bindMenuButton: function() {
      const menuBtn = document.querySelector('.menu-btn');
      const dropdownMenu = document.querySelector('.dropdown-menu');
      
      if (menuBtn && dropdownMenu) {
        menuBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isVisible = dropdownMenu.style.display === 'block';
          dropdownMenu.style.display = isVisible ? 'none' : 'block';
        });
        
        // Close dropdown when clicking elsewhere
        document.addEventListener('click', () => {
          dropdownMenu.style.display = 'none';
        });
        
        // Prevent dropdown from closing when clicking inside it
        dropdownMenu.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
    },

    // Bind dropdown navigation items
    bindDropdownNavigation: function() {
      const dropdownItems = document.querySelectorAll('.dropdown-item[data-route]');
      dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const route = item.getAttribute('data-route');
          
          // Close dropdown
          const dropdownMenu = document.querySelector('.dropdown-menu');
          if (dropdownMenu) {
            dropdownMenu.style.display = 'none';
          }
          
          // Navigate to route
          if (window.App.router) {
            App.router.navigate(route, { trigger: true });
          } else {
            window.location.hash = route;
          }
        });
      });

      // Handle logout button
      const logoutItems = document.querySelectorAll('.logout-btn');
      logoutItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleLogout();
        });
      });
    },

    // Bind search functionality
    bindSearch: function() {
      const searchInput = document.querySelector('.search');
      if (searchInput) {
        searchInput.addEventListener('focus', function() {
          this.parentElement.style.background = 'var(--card)';
          this.parentElement.style.boxShadow = '0 0 0 1px var(--primary)';
        });
        
        searchInput.addEventListener('blur', function() {
          this.parentElement.style.background = 'var(--bg)';
          this.parentElement.style.boxShadow = 'none';
        });
        
        searchInput.addEventListener('input', function() {
          // Add search functionality here if needed
          console.log('Search:', this.value);
        });
      }
    },

    // Handle logout
    handleLogout: function() {
      // Clear authentication data
      localStorage.removeItem("kentbook_logged_in");
      localStorage.removeItem("kentbook_current_user");
      
      // Hide main app and show login page
      const mainApp = document.getElementById("main-app");
      const loginPage = document.getElementById("login-page");
      const loadingScreen = document.getElementById("loading-screen");
      
      if (mainApp) mainApp.style.display = "none";
      if (loginPage) loginPage.style.display = "flex";
      if (loadingScreen) loadingScreen.style.display = "none";
      
      // Clear URL hash
      window.location.hash = "";
      
      // Reset login form
      const loginForm = document.getElementById("loginForm");
      if (loginForm) {
        loginForm.reset();
      }

      // Hide dropdown if open
      const dropdownMenu = document.querySelector('.dropdown-menu');
      if (dropdownMenu) {
        dropdownMenu.style.display = 'none';
      }
    },

    // Update active icon in topbar
    setActiveIcon: function(selector) {
      document.querySelectorAll('.center-icons .icon-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      if (selector) {
        const activeEl = document.querySelector(selector);
        if (activeEl) activeEl.classList.add('active');
      }
    },

    // Bind topbar icon clicks
    bindTopbarIcons: function() {
      const routes = [
        { selector: '.center-icons .icon-btn:nth-child(1)', route: 'home' },
        { selector: '.center-icons .icon-btn:nth-child(2)', route: 'friends' },
        { selector: '.center-icons .icon-btn:nth-child(3)', route: 'watch' },
        { selector: '.center-icons .icon-btn:nth-child(4)', route: 'marketplace' },
        { selector: '.center-icons .icon-btn:nth-child(5)', route: 'groups' }
      ];

      routes.forEach(link => {
        const el = document.querySelector(link.selector);
        if (el) {
          el.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active state
            this.setActiveIcon(link.selector);
            
            // Navigate to route
            if (window.App.router) {
              App.router.navigate(link.route, { trigger: true });
            } else {
              window.location.hash = link.route;
            }
          });
        }
      });
    },

    // Bind sidebar navigation
    bindSidebarNavigation: function() {
      const sidebarRoutes = [
        { selector: '.left-sidebar li:nth-child(1)', route: 'friends' },
        { selector: '.left-sidebar li:nth-child(2)', route: 'watch' },
        { selector: '.left-sidebar li:nth-child(6)', route: 'groups' },
        { selector: '.left-sidebar li:nth-child(8)', route: 'marketplace' }
      ];

      sidebarRoutes.forEach(link => {
        const el = document.querySelector(link.selector);
        if (el) {
          el.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Clear topbar active state for sidebar navigation
            this.setActiveIcon(null);
            
            // Navigate to route
            if (window.App.router) {
              App.router.navigate(link.route, { trigger: true });
            } else {
              window.location.hash = link.route;
            }
          });
        }
      });
    }
  };

  // Initialize header when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the main app to initialize
    setTimeout(function() {
      if (document.getElementById('main-app') && 
          document.getElementById('main-app').style.display !== 'none') {
        App.HeaderManager.init();
        App.HeaderManager.bindTopbarIcons();
        App.HeaderManager.bindSidebarNavigation();
      }
    }, 1000);
  });

  // Re-initialize when main app becomes visible (after login)
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        const mainApp = document.getElementById('main-app');
        if (mainApp && mainApp.style.display !== 'none') {
          // Small delay to ensure everything is loaded
          setTimeout(function() {
            App.HeaderManager.init();
            App.HeaderManager.bindTopbarIcons();
            App.HeaderManager.bindSidebarNavigation();
          }, 500);
        }
      }
    });
  });

  const mainApp = document.getElementById('main-app');
  if (mainApp) {
    observer.observe(mainApp, { attributes: true });
  }

})();