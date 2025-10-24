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

      // sample seed if empty
      if(!(localStorage.getItem('kentbook_seeded'))){
        App.users.add([
          {id:1,name:'Kent Wilan',email:'kent@example.com',avatar:'images/profile.png'},
          {id:2,name:'Alice Cooper',email:'alice@example.com',avatar:'https://randomuser.me/api/portraits/women/33.jpg'},
          {id:3,name:'Mark Wilson',email:'mark@example.com',avatar:'https://randomuser.me/api/portraits/men/45.jpg'},
          {id:4,name:'Sarah Johnson',email:'sarah@example.com',avatar:'https://randomuser.me/api/portraits/women/44.jpg'},
          {id:5,name:'Mike Thompson',email:'mike@example.com',avatar:'https://randomuser.me/api/portraits/men/22.jpg'}
        ]);
        App.posts.add([
          {
            id:'p1', 
            user_id:4, 
            body:'Just finished my morning hike! The view was absolutely breathtaking. 🏞️ #NatureLover #HikingAdventures', 
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
            likes:245, 
            comments:3,
            shares:12,
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            liked: false
          },
          {
            id:'p2', 
            user_id:5, 
            body:'Just launched my new website! Check it out and let me know what you think. It\'s been a long journey but totally worth it. #WebDevelopment #NewProject', 
            likes:189, 
            comments:2,
            shares:7,
            created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            liked: false
          },
          {
            id:'p3', 
            user_id:1, 
            body:'Hello KentBook! This is a seed post.', 
            likes:2, 
            comments:1,
            shares:0,
            created_at: new Date().toISOString(),
            liked: false
          }
        ]);
        
        // Add sample comments with proper liked property
        App.comments.add([
          {
            id: 'c1',
            post_id: 'p1',
            user_id: 2,
            body: 'Wow! That looks amazing! Where is this?',
            created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
            likes: 5,
            liked: false
          },
          {
            id: 'c2',
            post_id: 'p1',
            user_id: 3,
            body: 'Beautiful scenery! I need to visit this place someday. 😍',
            created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            likes: 3,
            liked: false
          },
          {
            id: 'c3',
            post_id: 'p1',
            user_id: 5,
            body: 'Great shot! The colors are incredible.',
            created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            likes: 2,
            liked: false
          },
          {
            id: 'c4',
            post_id: 'p2',
            user_id: 1,
            body: 'Congratulations on the launch! The design looks clean and modern.',
            created_at: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
            likes: 8,
            liked: false
          },
          {
            id: 'c5',
            post_id: 'p2',
            user_id: 4,
            body: 'Amazing work! What tech stack did you use?',
            created_at: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
            likes: 4,
            liked: false
          },
          {
            id: 'c6',
            post_id: 'p3',
            user_id: 2,
            body: 'Welcome to KentBook! Great to have you here!',
            created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            likes: 1,
            liked: false
          }
        ]);
        
        localStorage.setItem('kentbook_seeded','1');
        App.persist();
      }else{
        App.restore();
      }

      // Initialize the main app view
      App.initializeApp = function() {
        // Clear existing content
        $('#composer').empty();
        $('#feed').empty();
        
        // Create composer
        new App.ComposerView({
          collection: App.posts,
          user: App.users.get(1).toJSON()
        });
        
        // Create posts view
        App.postsView = new App.PostsView({
          collection: App.posts,
          users: App.users,
          currentUser: App.users.get(1).toJSON(),
          comments: App.comments
        });
        App.postsView.render();
      };

      // Initialize the app
      App.initializeApp();

      // save on window unload
      $(window).on('beforeunload', function(){ App.persist(); });
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