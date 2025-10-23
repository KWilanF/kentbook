// Models: User, Post, Comment
(function(){
  window.App = window.App || {};

  App.User = Backbone.Model.extend({
    defaults: {
      id: null,
      name: "Anonymous",
      email: ""
    }
  });

  App.Post = Backbone.Model.extend({
    defaults: {
      id: null,
      user_id: null,
      body: "",
      likes: 0,
      created_at: null
    },
    initialize: function(){
      if(!this.get('created_at')) this.set('created_at', new Date().toISOString());
    },
    validate: function(attrs){
      if(!attrs.body || attrs.body.trim().length === 0){
        return "Post body cannot be empty.";
      }
    },
    toggleLike: function(){
      this.set('likes', (this.get('likes')||0) + 1);
    }
  });

  App.Comment = Backbone.Model.extend({
    defaults: {
      id: null, post_id:null, user_id:null, body:"", created_at:null
    },
    initialize: function(){
      if(!this.get('created_at')) this.set('created_at', new Date().toISOString());
    }
  });
})();
