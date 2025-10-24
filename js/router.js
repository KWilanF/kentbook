(function () {
  window.App = window.App || {};

  App.AppRouter = Backbone.Router.extend({
    routes: {
      '': 'home',
      'home': 'home',
      'friends': 'friends',
      'watch': 'watch',
      'marketplace': 'marketplace',
      'groups': 'groups',
      'profile': 'profile',
      'about': 'about',
      'post/:id': 'singlePost',
      'menu': 'menu'
    },

    initialize: function (options) {
      this.posts = options.posts;
      this.users = options.users;
      this.appView = options.appView;

      this.bindIconNavigation();
      this.bindSidebarNavigation();
      this.setupTopbarLogout();
      this.bindDropdownNavigation();
    },

    // 🔗 Bind topbar icon clicks to routes
    bindIconNavigation: function () {
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
            this.navigate(link.route, { trigger: true });
            this.setActiveIcon(link.selector);
          });
        }
      });
    },

    // 🔗 Bind sidebar navigation
    bindSidebarNavigation: function () {
      // Profile click in sidebar
      const profileCard = document.querySelector('.left-sidebar .profile-card');
      if (profileCard) {
        profileCard.addEventListener('click', (e) => {
          e.preventDefault();
          this.navigate('profile', { trigger: true });
          this.setActiveIcon(null); // Clear topbar active state for sidebar navigation
        });
      }

      // Sidebar menu items
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
            this.navigate(link.route, { trigger: true });
            this.setActiveIcon(null); // Clear topbar active state
          });
        }
      });
    },

    // Bind dropdown menu navigation
    bindDropdownNavigation: function() {
      const dropdownItems = document.querySelectorAll('.dropdown-item[data-route]');
      dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const route = item.getAttribute('data-route');
          this.navigate(route, { trigger: true });
          this.setActiveIcon(null);
          // Hide dropdown after selection
          const dropdownMenu = document.querySelector('.dropdown-menu');
          if (dropdownMenu) {
            dropdownMenu.style.display = 'none';
          }
        });
      });
    },

    // Setup topbar logout dropdown
    setupTopbarLogout: function() {
      const menuBtn = document.querySelector('.menu-btn');
      const dropdownMenu = document.querySelector('.dropdown-menu');
      
      if (menuBtn && dropdownMenu) {
        menuBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
        });
        
        // Close dropdown when clicking elsewhere
        document.addEventListener('click', () => {
          dropdownMenu.style.display = 'none';
        });
        
        // Logout handler
        const logoutItem = dropdownMenu.querySelector('.logout-btn');
        if (logoutItem) {
          logoutItem.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
          });
        }
      }
    },

    // Logout function
    logout: function() {
      // Clear all authentication data
      localStorage.removeItem("kentbook_logged_in");
      localStorage.removeItem("kentbook_current_user");
      
      // Hide main app and show login page
      const mainApp = document.getElementById("main-app");
      const loginPage = document.getElementById("login-page");
      const loadingScreen = document.getElementById("loading-screen");
      
      if (mainApp) mainApp.style.display = "none";
      if (loginPage) loginPage.style.display = "flex";
      if (loadingScreen) loadingScreen.style.display = "none";
      
      // Clear any hash from URL
      window.location.hash = "";
      
      // Optional: Clear form fields
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

    // 🟦 Highlight active icon in topbar
    setActiveIcon: function (selector) {
      document.querySelectorAll('.center-icons .icon-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      if (selector) {
        const activeEl = document.querySelector(selector);
        if (activeEl) activeEl.classList.add('active');
      }
    },

    // ===== Routes =====
    home: function () {
      this.appView.showFeed();
    },

    friends: function () {
      this.appView.showFriends();
    },

    watch: function () {
      this.appView.showWatch();
    },

    marketplace: function () {
      this.appView.showStaticPage(
        'Marketplace', 
        '<div style="text-align: center; padding: 40px 20px;">' +
          '<div style="font-size: 48px; margin-bottom: 20px;">🏪</div>' +
          '<h3>KentBook Marketplace</h3>' +
          '<p style="color: var(--muted); margin-bottom: 20px;">Buy and sell items in your community</p>' +
          '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 30px;">' +
            '<div style="background: var(--bg); padding: 20px; border-radius: 8px;">' +
              '<div style="font-size: 24px; margin-bottom: 10px;">📱</div>' +
              '<div style="font-weight: 600;">Electronics</div>' +
            '</div>' +
            '<div style="background: var(--bg); padding: 20px; border-radius: 8px;">' +
              '<div style="font-size: 24px; margin-bottom: 10px;">👕</div>' +
              '<div style="font-weight: 600;">Clothing</div>' +
            '</div>' +
            '<div style="background: var(--bg); padding: 20px; border-radius: 8px;">' +
              '<div style="font-size: 24px; margin-bottom: 10px;">🏠</div>' +
              '<div style="font-weight: 600;">Housing</div>' +
            '</div>' +
            '<div style="background: var(--bg); padding: 20px; border-radius: 8px;">' +
              '<div style="font-size: 24px; margin-bottom: 10px;">🚗</div>' +
              '<div style="font-weight: 600;">Vehicles</div>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
      this.setActiveIcon('.center-icons .icon-btn:nth-child(4)');
    },

    groups: function () {
      this.appView.showStaticPage(
        'Groups',
        '<div style="text-align: center; padding: 40px 20px;">' +
          '<div style="font-size: 48px; margin-bottom: 20px;">👥</div>' +
          '<h3>Your Groups</h3>' +
          '<p style="color: var(--muted); margin-bottom: 30px;">Connect with people who share your interests</p>' +
          '<div style="display: flex; flex-direction: column; gap: 12px; max-width: 400px; margin: 0 auto;">' +
            '<div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg); border-radius: 8px;">' +
              '<div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; color: white;">🌲</div>' +
              '<div style="flex: 1;">' +
                '<div style="font-weight: 600;">Weekend Trips</div>' +
                '<div style="font-size: 13px; color: var(--muted);">125 members</div>' +
              '</div>' +
            '</div>' +
            '<div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg); border-radius: 8px;">' +
              '<div style="width: 40px; height: 40px; border-radius: 50%; background: var(--secondary); display: flex; align-items: center; justify-content: center; color: white;">🥾</div>' +
              '<div style="flex: 1;">' +
                '<div style="font-weight: 600;">Best Hiking Trails</div>' +
                '<div style="font-size: 13px; color: var(--muted);">89 members</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
      this.setActiveIcon('.center-icons .icon-btn:nth-child(5)');
    },

    menu: function () {
      // Show menu static page with logout button
      this.appView.showStaticPage(
        "Menu & Settings",
        `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg); border-radius: 8px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; color: white;">👤</div>
            <div>
              <div style="font-weight: 600;">Account Settings</div>
              <div style="font-size: 13px; color: var(--muted);">Manage your account preferences</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg); border-radius: 8px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--secondary); display: flex; align-items: center; justify-content: center; color: white;">🔒</div>
            <div>
              <div style="font-weight: 600;">Privacy</div>
              <div style="font-size: 13px; color: var(--muted);">Control your privacy settings</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg); border-radius: 8px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: #f7b928; display: flex; align-items: center; justify-content: center; color: white;">🌙</div>
            <div>
              <div style="font-weight: 600;">Display</div>
              <div style="font-size: 13px; color: var(--muted);">Dark mode and display options</div>
            </div>
          </div>
          <div style="margin-top: 20px; border-top: 1px solid var(--border); padding-top: 20px;">
            <button id="logoutBtn" class="logout-btn" style="width: 100%;">Log Out</button>
          </div>
        </div>
        `
      );

      // Clear active state for menu
      this.setActiveIcon(null);

      // Attach click event after render
      setTimeout(() => {
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
          logoutBtn.addEventListener("click", () => {
            this.logout();
          });
        }
      }, 100);
    },

    profile: function () {
      this.appView.showProfile();
      this.setActiveIcon(null); // Clear topbar active state
    },

    about: function () {
      this.appView.showAbout();
      this.setActiveIcon(null); // Clear topbar active state
    },

    singlePost: function (id) {
      try {
        const post = this.posts.get(id);
        if (post) {
          this.appView.showSinglePost(post);
        } else {
          console.warn('Post not found:', id);
          this.navigate('home', { trigger: true });
        }
      } catch (error) {
        console.error('Error loading post:', error);
        this.navigate('home', { trigger: true });
      }
      this.setActiveIcon(null); // Clear topbar active state
    }
  });
})();