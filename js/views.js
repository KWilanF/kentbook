(function(){
  window.App = window.App || {};

  App.PostView = Backbone.View.extend({
    tagName: 'article',
    className: 'card post',
    template: _.template('<div class="meta"><%= name %> · <small><%= time %></small></div><div class="body"><%= body %></div><div class="actions"><button class="like">Like (<%= likes %>)</button></div>'),
    events: {
      'click .like': 'onLike'
    },
    initialize: function(opts){
      this.user = opts.user;
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    onLike: function(){
      this.model.toggleLike();
      App.persist(); // save to localStorage
    },
    render: function(){
      var user = this.user || {name:'Unknown'};
      var time = new Date(this.model.get('created_at')).toLocaleString();
      this.$el.html(this.template({name: user.name, time: time, body: _.escape(this.model.get('body')), likes: this.model.get('likes')||0}));
      return this;
    }
  });

  App.PostsView = Backbone.View.extend({
    el: '#feed',
    initialize: function(opts){
      this.users = opts.users;
      this.listenTo(this.collection, 'add remove reset change', this.render);
    },
    render: function(){
      this.$el.html('');
      if(this.collection.length === 0){
        this.$el.html('<div class="card">No posts yet. Be the first!</div>');
        return this;
      }
      this.collection.each(function(post){
        var user = this.users.get(post.get('user_id'));
        var v = new App.PostView({model:post, user: user ? user.toJSON() : {name:'Guest'}});
        this.$el.append(v.render().el);
      }, this);
      return this;
    }
  });

  App.ComposerView = Backbone.View.extend({
    el: '#composer',
    template: _.template('<div class="card"><h3>Compose</h3><textarea id="post-body" placeholder="What\'s happening?"></textarea><div style="text-align:right;margin-top:8px"><button id="publish">Post</button></div></div>'),
    events: {
      'click #publish': 'publish'
    },
    initialize: function(opts){
      this.collection = opts.collection;
      this.user = opts.user;
      this.render();
    },
    publish: function(){
      var body = this.$('#post-body').val() || '';
      var attrs = { body: body, user_id: this.user.id || 1 };
      var post = new App.Post(attrs);
      var validation = post.validate(post.attributes);
      if(validation){
        alert(validation);
        return;
      }
      // assign id
      post.set('id', _.uniqueId('p'));
      this.collection.add(post);
      App.persist();
      this.$('#post-body').val('');
    },
    render: function(){
      this.$el.html(this.template());
      return this;
    }
  });
})();
