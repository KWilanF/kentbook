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
        <div class="post-menu-container">
          <button class="post-menu-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
          <div class="post-dropdown-menu">
            <button class="dropdown-item delete-post">
              <svg class="dropdown-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              Delete Post
            </button>
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
      'click .share': 'onShare',
      'click .post-menu-btn': 'onMenuClick',
      'click .delete-post': 'onDeletePost'
    },
    
    initialize: function(opts){
      this.user = opts.user;
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
      
      // Close dropdown when clicking elsewhere
      $(document).on('click', this.onDocumentClick.bind(this));
    },
    
    onMenuClick: function(e){
      e.preventDefault();
      e.stopPropagation();
      
      // Close all other dropdowns
      $('.post-dropdown-menu').removeClass('active');
      
      // Toggle this dropdown
      this.$('.post-dropdown-menu').toggleClass('active');
    },
    
    onDocumentClick: function(e){
      if (!this.$el.find(e.target).length) {
        this.$('.post-dropdown-menu').removeClass('active');
      }
    },
    
    onDeletePost: function(e){
      e.preventDefault();
      e.stopPropagation();
      
      if (confirm('Are you sure you want to delete this post?')) {
        this.model.destroy();
        App.persist();
      }
      
      // Close dropdown
      this.$('.post-dropdown-menu').removeClass('active');
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
    
    remove: function() {
      // Clean up document event listener
      $(document).off('click', this.onDocumentClick);
      return Backbone.View.prototype.remove.call(this);
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
      this.imageUrl = null;
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
    // Revoke previous URL if exists
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
    
    this.imageFile = file;
    this.imageUrl = URL.createObjectURL(file);
    
    // Show preview with object URL for display
    this.$('.preview').html(`
      <img src="${this.imageUrl}" alt="Preview" style="max-width: 100%; border-radius: 8px;" />
      <button class="remove-preview">×</button>
    `).show();
    
    // Add remove preview handler
    this.$('.remove-preview').on('click', () => {
      this.$('.preview').hide().empty();
      this.imageFile = null;
      if (this.imageUrl) {
        URL.revokeObjectURL(this.imageUrl);
        this.imageUrl = null;
      }
      this.$('#image-upload').val('');
    });
  }
},
    
   publish: function(e){
  e.preventDefault();
  
  var body = this.$('textarea').val().trim();
  
  // Check if body is empty before proceeding
  if (!body || body.trim().length === 0) {
    
    return;
  }
  
  var attrs = { 
    body: body, 
    user_id: this.user.id || 1,
    image: '' // Don't use object URL for persistence
  };
  
  // If we have an image file, we need to handle it differently
  // For now, we'll just skip the image or convert it to data URL
  if (this.imageFile) {
    // Convert image to data URL for persistence
    const reader = new FileReader();
    reader.onload = (event) => {
      attrs.image = event.target.result;
      this.createPost(attrs);
    };
    reader.readAsDataURL(this.imageFile);
  } else {
    this.createPost(attrs);
  }
},

// Helper function to create the post
createPost: function(attrs) {
  var post = new App.Post(attrs);
  var validation = post.validate(post.attributes);
  
  if(validation){
    alert(validation);
    return;
  }
  
  // Generate unique ID and set timestamp
  post.set({
    id: 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString(),
    likes: 0,
    comments: 0,
    shares: 0,
    liked: false
  });
  
  this.collection.add(post, { at: 0 }); // Add at beginning for newest first
  App.persist();
  
  // Reset form
  this.resetForm();
  
  // Scroll to show new post
  $('html, body').animate({
    scrollTop: $('#feed').offset().top - 100
  }, 500);
},

// Reset form function
resetForm: function() {
  this.$('textarea').val('').trigger('input');
  this.$('.preview').hide().empty();
  this.imageFile = null;
  if (this.imageUrl) {
    URL.revokeObjectURL(this.imageUrl);
    this.imageUrl = null;
  }
  this.$('#image-upload').val('');
  this.$('.post-btn').prop('disabled', true);
},
    
    // Clean up object URLs when view is removed
    remove: function() {
      if (this.imageUrl) {
        URL.revokeObjectURL(this.imageUrl);
      }
      return Backbone.View.prototype.remove.call(this);
    },
    
    render: function(){
      this.$el.html(this.template({ user: this.user }));
      return this;
    }
  });
})();