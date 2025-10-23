(function(){
  window.App = window.App || {};

  App.PostView = Backbone.View.extend({
    tagName: 'article',
    className: 'card post',
    
    template: _.template(`
      <div class="meta">
        <img src="<%= user.avatar %>" alt="<%= user.name %>" class="avatar" />
        <div class="user-info">
          <div class="name"><%= user.name %></div>
          <div class="time">
            <span><%= time %></span>
            <svg class="public-icon" viewBox="0 0 16 16" fill="#65676b">
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12zm.5-9.5h-1v5h1v-5zm0 6.5h-1v1h1v-1z"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="body"><%= body %></div>
      <% if (image) { %>
        <img src="<%= image %>" class="post-image" alt="Post image" />
      <% } %>
      <div class="action-counts">
        <div class="likes-count">
          <div class="like-icon-small">👍</div>
          <span><%= likes %></span>
        </div>
        <div><%= comments %> comments · <%= shares %> shares</div>
      </div>
      <div class="actions">
        <button class="like <%= liked ? 'liked' : '' %>">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12zm.5-9.5h-1v5h1v-5zm0 6.5h-1v1h1v-1z"/>
          </svg>
          Like
        </button>
        <button class="comment">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12zm.5-9.5h-1v5h1v-5zm0 6.5h-1v1h1v-1z"/>
          </svg>
          Comment
        </button>
        <button class="share">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12zm.5-9.5h-1v5h1v-5zm0 6.5h-1v1h1v-1z"/>
          </svg>
          Share
        </button>
      </div>
    `),
    
    events: {
      'click .like': 'onLike',
      'click .comment': 'onComment',
      'click .share': 'onShare'
    },
    
    initialize: function(opts){
      this.user = opts.user;
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    
    onLike: function(e){
      e.preventDefault();
      this.model.toggleLike();
      App.persist();
    },
    
    onComment: function(e){
      e.preventDefault();
      alert('Comment functionality would go here!');
      // In a real app, this would open a comment composer
    },
    
    onShare: function(e){
      e.preventDefault();
      this.model.addShare();
      alert('Shared post!');
      App.persist();
    },
    
    render: function(){
      var user = this.user || { name: 'Unknown', avatar: 'https://randomuser.me/api/portraits/men/0.jpg' };
      var time = this.model.getTimeAgo ? this.model.getTimeAgo() : new Date(this.model.get('created_at')).toLocaleString();
      
      this.$el.html(this.template({
        user: user,
        time: time,
        body: _.escape(this.model.get('body')),
        image: this.model.get('image') || '',
        likes: this.model.get('likes') || 0,
        comments: this.model.get('comments') || 0,
        shares: this.model.get('shares') || 0,
        liked: this.model.get('liked') || false
      }));
      
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
        this.$el.html(
          '<div class="card post" style="text-align: center; padding: 40px;">' +
            '<div style="font-size: 48px; margin-bottom: 16px;">📝</div>' +
            '<h3 style="margin-bottom: 8px;">No posts yet</h3>' +
            '<p style="color: var(--muted);">Be the first to share something!</p>' +
          '</div>'
        );
        return this;
      }
      
      this.collection.each(function(post){
        var user = this.users.get(post.get('user_id'));
        var userData = user ? user.toDisplay ? user.toDisplay() : user.toJSON() : { 
          name: 'Guest', 
          avatar: 'https://randomuser.me/api/portraits/men/0.jpg' 
        };
        
        var v = new App.PostView({
          model: post, 
          user: userData
        });
        this.$el.append(v.render().el);
      }, this);
      
      return this;
    }
  });

  App.ComposerView = Backbone.View.extend({
    el: '#composer',
    
    template: _.template(`
      <div class="composer-header">
        <img src="<%= user.avatar %>" alt="<%= user.name %>" class="avatar" />
        <textarea placeholder="What's on your mind, <%= user.name %>?" rows="1"></textarea>
      </div>
      <div class="composer-divider"></div>
      <div class="composer-actions">
        <div class="action-buttons">
          <button class="action-btn" data-type="live">
            <svg class="action-icon" viewBox="0 0 24 24" fill="#f02849">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11H7v2h4v4h2v-4h4v-2h-4V7h-2v4z"/>
            </svg>
            Live Video
          </button>
          <button class="action-btn" data-type="photo">
            <svg class="action-icon" viewBox="0 0 24 24" fill="#45bd62">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11H7v2h4v4h2v-4h4v-2h-4V7h-2v4z"/>
            </svg>
            Photo/Video
          </button>
          <button class="action-btn" data-type="feeling">
            <svg class="action-icon" viewBox="0 0 24 24" fill="#f7b928">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11H7v2h4v4h2v-4h4v-2h-4V7h-2v4z"/>
            </svg>
            Feeling/Activity
          </button>
        </div>
        <button class="post-btn" disabled>Post</button>
      </div>
      <div class="preview" style="display: none;"></div>
    `),
    
    events: {
      'click .post-btn': 'publish',
      'keyup textarea': 'onTextChange',
      'click .action-btn[data-type="photo"]': 'onPhotoClick',
      'change #image-upload': 'onImageSelect'
    },
    
    initialize: function(opts){
      this.collection = opts.collection;
      this.user = opts.user;
      this.imageFile = null;
      this.render();
      this.setupTextareaAutoResize();
    },
    
    setupTextareaAutoResize: function() {
      const textarea = this.$('textarea');
      textarea.on('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
      });
    },
    
    onTextChange: function() {
      const text = this.$('textarea').val().trim();
      const postBtn = this.$('.post-btn');
      
      if (text.length > 0) {
        postBtn.prop('disabled', false);
      } else {
        postBtn.prop('disabled', true);
      }
    },
    
    onPhotoClick: function(e) {
      e.preventDefault();
      // Create file input if it doesn't exist
      if (!this.$('#image-upload').length) {
        this.$el.append('<input type="file" id="image-upload" accept="image/*" style="display: none;">');
        this.$('#image-upload').on('change', this.onImageSelect.bind(this));
      }
      this.$('#image-upload').click();
    },
    
    onImageSelect: function(e) {
      const file = e.target.files[0];
      if (file) {
        this.imageFile = file;
        const reader = new FileReader();
        reader.onload = (event) => {
          this.$('.preview').html(`
            <img src="${event.target.result}" alt="Preview" />
            <button class="remove-preview">×</button>
          `).show();
          
          // Add remove preview handler
          this.$('.remove-preview').on('click', () => {
            this.$('.preview').hide().empty();
            this.imageFile = null;
            this.$('#image-upload').val('');
          });
        };
        reader.readAsDataURL(file);
      }
    },
    
    publish: function(e){
      e.preventDefault();
      
      var body = this.$('textarea').val().trim();
      var attrs = { 
        body: body, 
        user_id: this.user.id || 1,
        image: this.imageFile ? URL.createObjectURL(this.imageFile) : ''
      };
      
      var post = new App.Post(attrs);
      var validation = post.validate(post.attributes);
      
      if(validation){
        alert(validation);
        return;
      }
      
      // Generate unique ID and set timestamp
      post.set({
        id: 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString()
      });
      
      this.collection.add(post);
      App.persist();
      
      // Reset form
      this.$('textarea').val('').trigger('input');
      this.$('.preview').hide().empty();
      this.imageFile = null;
      this.$('#image-upload').val('');
      
      // Scroll to show new post
      $('html, body').animate({
        scrollTop: this.$el.offset().top - 100
      }, 500);
    },
    
    render: function(){
      this.$el.html(this.template({ user: this.user }));
      return this;
    }
  });
})();