(function(){
  window.App = window.App || {};

  App.AppRouter = Backbone.Router.extend({
    routes: {
      '': 'home',
      'home': 'home',
      'profile': 'profile',
      'post/:id': 'viewPost',
      'about': 'about'
    },
    initialize: function(options){
      this.posts = options.posts;
      this.users = options.users;
      this.appView = options.appView;
    },
    home: function(){
      // default route shows feed
      this.appView.showFeed();
    },
    profile: function(){
      this.appView.showProfile();
    },
    viewPost: function(id){
      var p = this.posts.get(id);
      if(!p){ alert('Post not found'); this.navigate('home',{trigger:true}); return; }
      this.appView.showSinglePost(p);
    },
    about: function(){
      this.appView.showAbout();
    }
  });
})();
