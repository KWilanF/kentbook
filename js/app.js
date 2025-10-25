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
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
          },
          {
            id:'p2', 
            user_id:5, 
            body:'Just launched my new website! Check it out and let me know what you think. It\'s been a long journey but totally worth it. #WebDevelopment #NewProject', 
            likes:189, 
            comments:2,
            shares:7,
            created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
          },
          {
            id:'p3', 
            user_id:1, 
            body:'Hello KentBook! This is a seed post.', 
            likes:2, 
            comments:1,
            shares:0,
            created_at: new Date().toISOString()
          },
          {
            id:'p4', 
            user_id:2, 
            body:'Welcome to the mini Facebook clone built with Backbone.js', 
            likes:1, 
            comments:0,
            shares:0,
            created_at: new Date().toISOString()
          }
        ]);
        
        // Add sample comments
        App.comments.add([
          {
            id: 'c1',
            post_id: 'p1',
            user_id: 2,
            body: 'Wow! That looks amazing! Where is this?',
            created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
            likes: 5
          },
          {
            id: 'c2',
            post_id: 'p1',
            user_id: 3,
            body: 'Beautiful scenery! I need to visit this place someday. 😍',
            created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            likes: 3
          },
          {
            id: 'c3',
            post_id: 'p1',
            user_id: 5,
            body: 'Great shot! The colors are incredible.',
            created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            likes: 2
          },
          {
            id: 'c4',
            post_id: 'p2',
            user_id: 1,
            body: 'Congratulations on the launch! The design looks clean and modern.',
            created_at: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
            likes: 8
          },
          {
            id: 'c5',
            post_id: 'p2',
            user_id: 4,
            body: 'Amazing work! What tech stack did you use?',
            created_at: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
            likes: 4
          },
          {
            id: 'c6',
            post_id: 'p3',
            user_id: 2,
            body: 'Welcome to KentBook! Great to have you here!',
            created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            likes: 1
          }
        ]);
        
        localStorage.setItem('kentbook_seeded','1');
        App.persist();
      }else{
        App.restore();
      }

      // Store composer view instance to prevent duplicates
      App.composerView = null;

      App.appView = {
        showFeed: function () {
          // Show composer and stories on home
          $('#composer').show();
          $('.stories-row').show();
          
          // Update active state in navigation
          $('.icon-btn').removeClass('active');
          $('.icon-btn:first-child').addClass('active');

          // Only create composer view if it doesn't exist or was removed
          if (!App.composerView || !App.composerView.$el.is(':visible')) {
            App.composerView = new App.ComposerView({
              collection: App.posts,
              user: App.users.get(1).toJSON()
            });
          }
          
          // Always recreate posts view to show latest posts
          App.postsView = new App.PostsView({
            collection: App.posts,
            users: App.users,
            currentUser: App.users.get(1).toJSON(),
            comments: App.comments
          });
          App.postsView.render();
        },

        showProfile: function () {
          $('#composer').hide();
          $('.stories-row').hide();

          // Update active state
          $('.icon-btn').removeClass('active');

          var user = App.users.get(1);
          var userPosts = App.posts.where({user_id: 1});
          var totalLikes = userPosts.reduce(function(sum, post) { 
            return sum + post.get('likes'); 
          }, 0);
          var totalComments = userPosts.reduce(function(sum, post) { 
            return sum + post.get('comments'); 
          }, 0);

          $('#feed').html(
            '<div class="card post">' +
              '<div class="profile-header" style="text-align: center; padding: 20px;">' +
                '<img src="' + (user.get('avatar') || '') + '" alt="' + user.get('name') + '" class="avatar" style="width: 100px; height: 100px; margin-bottom: 15px;" />' +
                '<h2 style="margin-bottom: 10px;">' + user.get('name') + '</h2>' +
                '<p style="color: var(--muted);">' + user.get('email') + '</p>' +
              '</div>' +
              '<div class="profile-stats" style="display: flex; justify-content: space-around; padding: 20px; border-top: 1px solid var(--border);">' +
                '<div style="text-align: center;">' +
                  '<div style="font-size: 18px; font-weight: bold;">' + userPosts.length + '</div>' +
                  '<div style="color: var(--muted); font-size: 14px;">Posts</div>' +
                '</div>' +
                '<div style="text-align: center;">' +
                  '<div style="font-size: 18px; font-weight: bold;">' + totalComments + '</div>' +
                  '<div style="color: var(--muted); font-size: 14px;">Comments</div>' +
                '</div>' +
                '<div style="text-align: center;">' +
                  '<div style="font-size: 18px; font-weight: bold;">' + totalLikes + '</div>' +
                  '<div style="color: var(--muted); font-size: 14px;">Likes</div>' +
                '</div>' +
              '</div>' +
            '</div>'
          );

          // Show user's posts
          userPosts.forEach(function(post) {
            var postUser = App.users.get(post.get('user_id'));
            var userData = postUser ? postUser.toDisplay() : { 
              name: 'Guest', 
              avatar: 'https://randomuser.me/api/portraits/men/0.jpg' 
            };
            
            var v = new App.PostView({
              model: post, 
              user: userData,
              currentUser: App.users.get(1).toJSON(),
              comments: App.comments
            });
            $('#feed').append(v.render().el);
          });
        },

        showFriends: function () {
          $('#composer').hide();
          $('.stories-row').hide();
          
          // Update active state
          $('.icon-btn').removeClass('active');
          $('.icon-btn:nth-child(2)').addClass('active');

          var friendsHtml = '<div class="card"><h3 style="padding: 16px; border-bottom: 1px solid var(--border);">Friends</h3><div style="padding: 16px;">';
          
          App.users.each(function(user) {
            if (user.id !== 1) { // Exclude current user
              friendsHtml += 
                '<div style="display: flex; align-items: center; gap: 12px; padding: 12px; border-bottom: 1px solid var(--border);">' +
                  '<div class="avatar-wrapper">' +
                    '<img src="' + (user.get('avatar') || '') + '" alt="' + user.get('name') + '" class="avatar" />' +
                    '<span class="online-dot"></span>' +
                  '</div>' +
                  '<div style="flex: 1;">' +
                    '<div style="font-weight: 600;">' + user.get('name') + '</div>' +
                    '<div style="color: var(--muted); font-size: 13px; margin-top: 2px;">' + user.get('email') + '</div>' +
                  '</div>' +
                  '<button style="background: var(--primary); color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 13px; cursor: pointer;">Message</button>' +
                '</div>';
            }
          });
          
          friendsHtml += '</div></div>';
          $('#feed').html(friendsHtml);
        },

        showWatch: function () {
          $('#composer').hide();
          $('.stories-row').hide();
          
          // Update active state
          $('.icon-btn').removeClass('active');
          $('.icon-btn:nth-child(3)').addClass('active');

          $('#feed').html(
            '<div class="card">' +
              '<h3 style="padding: 16px; border-bottom: 1px solid var(--border);">Watch</h3>' +
              '<div style="padding: 16px;">' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">' +
                  '<div style="cursor: pointer;">' +
                    '<div style="background: var(--bg); border-radius: 8px; height: 120px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; color: var(--muted);">📹 Video 1</div>' +
                    '<div style="font-weight: 600; font-size: 14px;">Amazing Mountain Hike</div>' +
                    '<div style="color: var(--muted); font-size: 13px;">125K views · 2 hours ago</div>' +
                  '</div>' +
                  '<div style="cursor: pointer;">' +
                    '<div style="background: var(--bg); border-radius: 8px; height: 120px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; color: var(--muted);">📹 Video 2</div>' +
                    '<div style="font-weight: 600; font-size: 14px;">Web Development Tutorial</div>' +
                    '<div style="color: var(--muted); font-size: 13px;">98K views · 5 hours ago</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>'
          );
        },

        showSinglePost: function (post) {
          $('#composer').hide();
          $('.stories-row').hide();

          // Update active state
          $('.icon-btn').removeClass('active');

          var postUser = App.users.get(post.get('user_id'));
          var userData = postUser ? postUser.toDisplay() : { 
            name: 'Guest', 
            avatar: 'https://randomuser.me/api/portraits/men/0.jpg' 
          };
          
          var v = new App.PostView({
            model: post,
            user: userData,
            currentUser: App.users.get(1).toJSON(),
            comments: App.comments
          });
          $('#feed').html(v.render().el);
          
          // Automatically expand comments for single post view
          setTimeout(function() {
            v.$('.comments-section').slideDown();
            v.renderComments();
          }, 300);
        },

        showAbout: function () {
          $('#composer').hide();
          $('.stories-row').hide();

          // Update active state
          $('.icon-btn').removeClass('active');

          $('#feed').html(
            '<div class="card post">' +
              '<div class="meta">' +
                '<div class="sidebar-icon" style="background: var(--primary); color: white;">i</div>' +
                '<div class="user-info">' +
                  '<div class="name">About KentBook</div>' +
                '</div>' +
              '</div>' +
              '<div class="body">' +
                '<p>This mini project demonstrates Backbone.js core features (Models, Collections, Views, Router).</p>' +
                '<p style="margin-top: 12px;"><strong>Features:</strong></p>' +
                '<ul style="margin-left: 20px; margin-top: 8px;">' +
                  '<li>Backbone.js MVC architecture</li>' +
                  '<li>LocalStorage persistence</li>' +
                  '<li>Responsive Facebook-like UI</li>' +
                  '<li>Post creation and interaction</li>' +
                  '<li>Real comment system</li>' +
                  '<li>Like functionality</li>' +
                  '<li>User profiles</li>' +
                '</ul>' +
                '<p style="margin-top: 12px;"><strong>Tech Stack:</strong></p>' +
                '<ul style="margin-left: 20px; margin-top: 8px;">' +
                  '<li>Backbone.js</li>' +
                  '<li>jQuery</li>' +
                  '<li>Underscore.js</li>' +
                  '<li>HTML5/CSS3</li>' +
                  '<li>LocalStorage API</li>' +
                '</ul>' +
              '</div>' +
            '</div>'
          );
        },

        // Static route helper
        showStaticPage: function (title, content) {
          $('#composer').hide();
          $('.stories-row').hide();
          $('.icon-btn').removeClass('active');
          
          $('#feed').html(
            '<div class="card post">' +
              '<div class="meta">' +
                '<div class="sidebar-icon" style="background: var(--primary); color: white;">📄</div>' +
                '<div class="user-info">' +
                  '<div class="name">' + title + '</div>' +
                '</div>' +
              '</div>' +
              '<div class="body">' + content + '</div>' +
            '</div>'
          );
        }
      };

      // FIX: Initialize router with delay to ensure DOM is ready
      setTimeout(function() {
        App.router = new App.AppRouter({
          posts: App.posts, 
          users: App.users, 
          comments: App.comments,
          appView: App.appView
        });
        
        // Start Backbone history
        Backbone.history.start();
        
        // Manually trigger home route if no hash
        if (!window.location.hash || window.location.hash === '#') {
          App.router.navigate('home', { trigger: true });
        }
      }, 200);

      // FIX: Add manual icon binding as backup
      setTimeout(function() {
        // Manual icon binding for navbar
        const routes = [
          '.center-icons .icon-btn:nth-child(1)',
          '.center-icons .icon-btn:nth-child(2)', 
          '.center-icons .icon-btn:nth-child(3)',
          '.center-icons .icon-btn:nth-child(4)',
          '.center-icons .icon-btn:nth-child(5)'
        ];
        
        const routeNames = ['home', 'friends', 'watch', 'marketplace', 'groups'];
        
        routes.forEach((selector, index) => {
          const element = document.querySelector(selector);
          if (element) {
            // Remove any existing listeners and add new one
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
            
            newElement.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              
              // Update active state
              document.querySelectorAll('.center-icons .icon-btn').forEach(btn => {
                btn.classList.remove('active');
              });
              newElement.classList.add('active');
              
              // Navigate to route
              if (App.router) {
                App.router.navigate(routeNames[index], { trigger: true });
              } else {
                window.location.hash = routeNames[index];
              }
            });
          }
        });
        
        console.log('Manual icon binding completed');
      }, 500);

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