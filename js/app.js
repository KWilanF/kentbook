(function(){
  window.App = window.App || {};

  // Load/Save from localStorage for persistence
  App.persist = function(){
    try{
      var data = {
        users: App.users.toJSON(),
        posts: App.posts.toJSON()
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
    }catch(e){ console.warn('Restore failed', e); }
  };

  $(function(){
    // collections
    App.users = new App.Users();
    App.posts = new App.Posts();

    // sample seed if empty
    if(!(localStorage.getItem('kentbook_seeded'))){
      App.users.add([{id:1,name:'Kent Wilan',email:'kent@example.com'},{id:2,name:'Alice',email:'alice@example.com'}]);
      App.posts.add([
        {id:'p1', user_id:1, body:'Hello KentBook! This is a seed post.', likes:2, created_at: new Date().toISOString()},
        {id:'p2', user_id:2, body:'Welcome to the mini Facebook clone built with Backbone.js', likes:1, created_at: new Date().toISOString()}
      ]);
      localStorage.setItem('kentbook_seeded','1');
      App.persist();
    }else{
      App.restore();
    }

    // app view helpers (not a heavy MVC view but central controller)
    App.appView = {
      showFeed: function(){
        $('#composer').show();
        var composer = new App.ComposerView({collection: App.posts, user: App.users.get(1).toJSON()});
        App.postsView = new App.PostsView({collection: App.posts, users: App.users});
        App.postsView.render();
      },
      showProfile: function(){
        $('#composer').hide();
        $('#feed').html('<div class="card"><h3>Profile</h3><p>Name: '+App.users.get(1).get('name')+'</p><p>Email: '+App.users.get(1).get('email')+'</p></div>');
      },
      showSinglePost: function(post){
        $('#composer').hide();
        var v = new App.PostView({model:post, user: App.users.get(post.get('user_id')) ? App.users.get(post.get('user_id')).toJSON() : {name:'Guest'}});
        $('#feed').html(v.render().el);
      },
      showAbout: function(){
        $('#composer').hide();
        $('#feed').html('<div class="card"><h3>About KentBook</h3><p>This mini project demonstrates Backbone.js core features (Models, Collections, Views, Router).</p></div>');
      }
    };

    // router
    App.router = new App.AppRouter({posts:App.posts, users:App.users, appView:App.appView});
    Backbone.history.start();

    // save on window unload
    $(window).on('beforeunload', function(){ App.persist(); });
  });
})();
