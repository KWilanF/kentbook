(function(){
  try {
    window.App = window.App || {};

    // Load/Save from localStorage for persistence
    App.persist = function(){
      try{
        var data = {
          users: App.users.toJSON(),
          posts: App.posts.toJSON(),
          comments: App.comments.toJSON()
        };
        localStorage.setItem('kentbook_data_v1', JSON.stringify(data));
      }catch(e){ console.warn('Persist failed', e); }
    };

    App.restore = function(){
      var raw = localStorage.getItem('kentbook_data_v1');
      if(!raw) return;
      try{
        var data = JSON.parse(raw);
        App.users.reset(data.users || []);
        App.posts.reset(data.posts || []);
        App.comments.reset(data.comments || []);
      }catch(e){ console.warn('Restore failed', e); }
    };

    $(function(){
      // collections
      App.users = new App.Users();
      App.posts = new App.Posts();
      App.comments = new App.CommentCollection();

      // Make collections globally accessible
      window.App.users = App.users;
      window.App.posts = App.posts;
      window.App.comments = App.comments;

      // Check if user is logged in before initializing app
      const isLoggedIn = localStorage.getItem("kentbook_logged_in") === "true";
      const currentUsername = localStorage.getItem("kentbook_current_user");
      
      if (isLoggedIn && currentUsername) {
        // User is logged in, restore their data
        App.restore();
        
        // Initialize the main app view
        App.initializeApp = function() {
          // Clear existing content
          $('#composer').empty();
          $('#feed').empty();
          
          // Get current user from localStorage users
          const localStorageUsers = JSON.parse(localStorage.getItem("kentbook_users")) || [];
          const currentUserData = localStorageUsers.find(u => u.username === currentUsername);
          
          if (currentUserData) {
            // Create Backbone user model for the current user
            const currentUserModel = new App.User({
              id: 1,
              name: currentUserData.name || currentUserData.firstName + ' ' + currentUserData.lastName,
              email: currentUserData.email,
              avatar: 'images/profile.png'
            });
            
            // Add current user to users collection
            App.users.add(currentUserModel);
            
            // Create composer with current user
            new App.ComposerView({
              collection: App.posts,
              user: currentUserModel.toJSON()
            });
            
            // Create posts view
            App.postsView = new App.PostsView({
              collection: App.posts,
              users: App.users,
              currentUser: currentUserModel.toJSON(),
              comments: App.comments
            });
            App.postsView.render();
          }
        };

        // Initialize the app
        App.initializeApp();

        // save on window unload
        $(window).on('beforeunload', function(){ App.persist(); });
      } else {
        // User is not logged in, ensure main app is hidden
        const mainApp = document.getElementById('main-app');
        if (mainApp) {
          mainApp.style.display = 'none';
        }
      }
    });
  } catch (error) {
    console.error('Application initialization failed:', error);
    // Show user-friendly error message
    if (document.getElementById('main-app')) {
      document.getElementById('main-app').innerHTML = 
        '<div style="padding: 20px; text-align: center; color: red;">' +
        'Application failed to load. Please refresh the page.' +
        '</div>';
    }
  }
})();