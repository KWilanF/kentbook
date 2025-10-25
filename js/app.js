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

    // Create sample content for new users
    App.createSampleContent = function(userId, userName) {
      console.log("Creating sample content for user:", userName);
      
      // Add welcome post
      App.posts.add({
        id: 'welcome_post_' + Date.now(),
        user_id: userId,
        body: `Welcome to KentBook, ${userName}! This is your first post. Feel free to edit or delete it and start sharing with your friends! 🎉`,
        image: '',
        likes: 0,
        comments: 0,
        shares: 0,
        created_at: new Date().toISOString(),
        liked: false
      });

      App.persist();
    };

    // Initialize app after everything is loaded
    App.initializeApp = function() {
      console.log("Initializing KentBook app...");
      
      // Check if user is logged in
      const isLoggedIn = localStorage.getItem("kentbook_logged_in") === "true";
      const currentUsername = localStorage.getItem("kentbook_current_user");
      
      if (isLoggedIn && currentUsername) {
        console.log("User is logged in:", currentUsername);
        
        // User is logged in, restore their data
        App.restore();
        
        // Clear existing content
        $('#composer').empty();
        $('#feed').empty();
        
        // Get current user from localStorage users
        const localStorageUsers = JSON.parse(localStorage.getItem("kentbook_users")) || [];
        const currentUserData = localStorageUsers.find(u => u.username === currentUsername);
        
        if (currentUserData) {
          console.log("Found user data:", currentUserData);
          
          // Generate unique user ID based on username
          const userId = Math.abs(currentUsername.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0));
          
          // Check if we need to create Backbone user model
          const existingBackboneUser = App.users.find(user => user.get('name') === currentUserData.name);
          
          if (!existingBackboneUser) {
            console.log("Creating new Backbone user model");
            
            // Create Backbone user model for the current user
            // NOTE: User model in models.js doesn't have 'username' field, using 'name' and 'email'
            const userModel = new App.User({
              id: userId,
              name: currentUserData.name || currentUserData.firstName + ' ' + currentUserData.lastName,
              email: currentUserData.email,
              avatar: 'images/profile.png'
            });
            
            // Add to users collection
            App.users.add(userModel);
            
            // Create sample content if this is a new user with no posts
            if (App.posts.length === 0) {
              console.log("Creating sample content for new user");
              App.createSampleContent(userId, currentUserData.name || currentUserData.firstName);
            }
          }

          // Get the user model for views
          const userForViews = App.users.find(user => user.get('name') === currentUserData.name) || 
                              App.users.find(user => user.get('email') === currentUserData.email);
          
          if (userForViews) {
            console.log("Initializing views with user:", userForViews.toJSON());
            
            // Check if required views exist before creating them
            if (typeof App.ComposerView !== 'undefined') {
              // Create composer with current user
              new App.ComposerView({
                collection: App.posts,
                user: userForViews.toJSON()
              });
            } else {
              console.warn("ComposerView not available");
            }
            
            if (typeof App.PostsView !== 'undefined') {
              // Create posts view
              App.postsView = new App.PostsView({
                collection: App.posts,
                users: App.users,
                currentUser: userForViews.toJSON(),
                comments: App.comments
              });
              App.postsView.render();
            } else {
              console.warn("PostsView not available");
            }
            
            console.log("App initialized successfully with", App.posts.length, "posts");
          } else {
            console.error("Failed to find user for views");
            // Fallback: use raw data if Backbone model not found
            if (typeof App.ComposerView !== 'undefined' && typeof App.PostsView !== 'undefined') {
              new App.ComposerView({
                collection: App.posts,
                user: currentUserData
              });
              
              App.postsView = new App.PostsView({
                collection: App.posts,
                users: App.users,
                currentUser: currentUserData,
                comments: App.comments
              });
              App.postsView.render();
            }
          }
        } else {
          console.error("Current user data not found in localStorage for username:", currentUsername);
          // Logout user if data is corrupted
          localStorage.removeItem("kentbook_logged_in");
          localStorage.removeItem("kentbook_current_user");
          window.location.reload();
        }

        // save on window unload
        $(window).on('beforeunload', function(){ App.persist(); });
      } else {
        // User is not logged in, ensure main app is hidden
        console.log("User not logged in, hiding main app");
        const mainApp = document.getElementById('main-app');
        if (mainApp) {
          mainApp.style.display = 'none';
        }
        
        // Ensure login page is visible
        const loginPage = document.getElementById('login-page');
        if (loginPage) {
          loginPage.style.display = 'flex';
        }
      }
    };

    $(function(){
      console.log("DOM ready, setting up collections...");
      
      // Initialize collections
      App.users = new App.Users();
      App.posts = new App.Posts();
      App.comments = new App.CommentCollection();

      // Make collections globally accessible
      window.App.users = App.users;
      window.App.posts = App.posts;
      window.App.comments = App.comments;

      console.log("Collections initialized, waiting for Backbone views...");
      
      // Wait a bit for Backbone views to load, then initialize app
      setTimeout(function() {
        App.initializeApp();
      }, 100);
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