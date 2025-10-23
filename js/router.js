(function () {
  window.App = window.App || {};

  App.AppRouter = Backbone.Router.extend({
    routes: {
      '': 'home',
      'home': 'home',
      'friends': 'friends',
      'watch': 'watch',
      'messenger': 'messenger',
      'notifications': 'notifications',
      'menu': 'menu',
      'profile': 'profile',
      'about': 'about'
    },

    initialize: function (options) {
      this.posts = options.posts;
      this.users = options.users;
      this.appView = options.appView;

      this.bindIconNavigation();
    },

    // 🔗 Bind icon clicks to routes
    bindIconNavigation: function () {
      const routes = [
        { selector: '.icon-home', route: 'home' },
        { selector: '.icon-friends', route: 'friends' },
        { selector: '.icon-watch', route: 'watch' },
        { selector: '.icon-messenger', route: 'messenger' },
        { selector: '.icon-notifications', route: 'notifications' },
        { selector: '.icon-menu', route: 'menu' }
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

    // 🟦 Highlight active icon
    setActiveIcon: function (selector) {
      document.querySelectorAll('.icon-btn').forEach(btn => btn.classList.remove('active'));
      const activeEl = document.querySelector(selector);
      if (activeEl) activeEl.classList.add('active');
    },

    // ===== Routes =====
    home: function () {
      this.appView.showFeed();
    },

    friends: function () {
      this.appView.showStaticPage('Friends', '<p>Here you can see and manage your KentBook friends.</p>');
    },

    watch: function () {
      this.appView.showStaticPage('Watch', '<p>Welcome to KentBook Watch — trending videos appear here.</p>');
    },

    messenger: function () {
      this.appView.showStaticPage('Messenger', '<p>Your messages will appear here soon.</p>');
    },

    notifications: function () {
      this.appView.showStaticPage('Notifications', '<p>No new notifications at the moment.</p>');
    },

    menu: function () {
      this.appView.showStaticPage('Menu', '<p>Quick links and account settings.</p>');
    },

    profile: function () {
      this.appView.showProfile();
    },

    about: function () {
      this.appView.showStaticPage('About KentBook', '<p>This project is built with Backbone.js to simulate Facebook.</p>');
    }
  });
})();
