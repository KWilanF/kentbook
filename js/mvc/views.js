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
      
      <!-- Comments Section -->
      <div class="comments-section" style="display: none;">
        <div class="comments-list"></div>
        <div class="comment-composer">
          <div class="comment-input-container">
            <img src="<%= currentUser.avatar %>" alt="<%= currentUser.name %>" class="avatar comment-avatar" />
            <div class="comment-input-wrapper">
              <input type="text" class="comment-input" placeholder="Write a comment..." />
              <div class="comment-actions">
                <button class="comment-submit">Post</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `),
    
    events: {
      'click .like': 'onLike',
      'click .comment': 'onCommentToggle',
      'click .share': 'onShare',
      'click .post-menu-btn': 'onMenuClick',
      'click .delete-post': 'onDeletePost',
      'click .comment-submit': 'onCommentSubmit',
      'keypress .comment-input': 'onCommentKeypress',
      'click .comment-like': 'onCommentLike',
      'click .delete-comment': 'onDeleteComment',
      'click .comment-menu-btn': 'onCommentMenuClick'
    },
    
    initialize: function(opts){
      this.user = opts.user;
      this.currentUser = opts.currentUser;
      this.comments = opts.comments;
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(this.comments, 'add remove reset', this.renderComments);
      
      // Listen for profile picture changes
      if (typeof ProfilePictureManager !== 'undefined') {
        this.profileManager = ProfilePictureManager.getInstance();
        $(document).on('profilePictureChanged.postview', this.onProfilePictureChange.bind(this));
      }
      
      // Close dropdown when clicking elsewhere
      $(document).on('click.postview', this.onDocumentClick.bind(this));
    },
    
    // Handle profile picture changes
    onProfilePictureChange: function() {
      console.log('Profile picture changed, updating post view');
      this.updateUserAvatars();
      this.render();
    },
    
    // Update user avatars with current profile picture
    updateUserAvatars: function() {
      if (!this.profileManager) return;
      
      const currentProfilePic = this.profileManager.getProfilePicture();
      const currentUsername = localStorage.getItem("kentbook_current_user");
      const localStorageUsers = JSON.parse(localStorage.getItem("kentbook_users")) || [];
      const currentUserData = localStorageUsers.find(u => u.username === currentUsername);
      
      if (currentUserData) {
        // Update post author avatar if it's the current user
        if (this.user && this.user.name === currentUserData.name) {
          this.user.avatar = currentProfilePic;
        }
        
        // Update current user avatar in comments
        if (this.currentUser && this.currentUser.name === currentUserData.name) {
          this.currentUser.avatar = currentProfilePic;
        }
      }
    },
    
    onMenuClick: function(e){
      e.preventDefault();
      e.stopPropagation();
      
      // Close all other dropdowns
      $('.post-dropdown-menu').removeClass('active');
      $('.comment-dropdown-menu').removeClass('active');
      
      // Toggle this dropdown
      this.$('.post-dropdown-menu').toggleClass('active');
    },
    
    onCommentMenuClick: function(e){
      e.preventDefault();
      e.stopPropagation();
      
      const $target = $(e.currentTarget);
      const $commentItem = $target.closest('.comment-item');
      const $dropdown = $commentItem.find('.comment-dropdown-menu');
      
      // Close all other dropdowns
      $('.post-dropdown-menu').removeClass('active');
      $('.comment-dropdown-menu').removeClass('active');
      
      // Toggle this dropdown
      $dropdown.toggleClass('active');
    },
    
    onDocumentClick: function(e){
      if (!this.$el.find(e.target).length) {
        this.$('.post-dropdown-menu').removeClass('active');
        $('.comment-dropdown-menu').removeClass('active');
      }
    },
    
    onDeletePost: function(e){
      e.preventDefault();
      e.stopPropagation();
      
      if (confirm('Are you sure you want to delete this post?')) {
        // Remove all comments for this post first
        this.comments.removeForPost(this.model.id);
        // Remove the post from collection
        App.posts.remove(this.model);
        App.persist();
        
        // Remove the view from DOM
        this.remove();
      }
      
      // Close dropdown
      this.$('.post-dropdown-menu').removeClass('active');
    },
    
    onLike: function(e){
      e.preventDefault();
      this.model.toggleLike();
      App.persist();
    },
    
    onCommentToggle: function(e){
      e.preventDefault();
      const $commentsSection = this.$('.comments-section');
      const isVisible = $commentsSection.is(':visible');
      
      if (isVisible) {
        $commentsSection.slideUp();
      } else {
        $commentsSection.slideDown();
        this.renderComments();
        this.$('.comment-input').focus();
      }
    },
    
    onCommentSubmit: function(e){
      e.preventDefault();
      this.submitComment();
    },
    
    onCommentKeypress: function(e){
      if (e.which === 13) { // Enter key
        e.preventDefault();
        this.submitComment();
      }
    },
    
    onCommentLike: function(e){
      e.preventDefault();
      const $target = $(e.currentTarget);
      const commentId = $target.closest('.comment-item').data('comment-id');
      const comment = this.comments.get(commentId);
      
      if (comment) {
        comment.toggleLike();
        App.persist();
        this.renderComments();
      }
    },
    
    onDeleteComment: function(e){
      e.preventDefault();
      e.stopPropagation();
      
      const $target = $(e.currentTarget);
      const commentId = $target.closest('.comment-item').data('comment-id');
      const comment = this.comments.get(commentId);
      
      if (comment && confirm('Are you sure you want to delete this comment?')) {
        // Remove comment from collection
        this.comments.remove(comment);
        // Decrement post comment count
        this.model.set('comments', Math.max(0, (this.model.get('comments') || 0) - 1));
        App.persist();
        this.renderComments(); // Refresh comments display
      }
      
      // Close dropdown
      $('.comment-dropdown-menu').removeClass('active');
    },
    
    submitComment: function(){
      const commentText = this.$('.comment-input').val().trim();
      
      if (!commentText) return;
      
      const comment = new App.Comment({
        id: 'comment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        post_id: this.model.id,
        user_id: this.currentUser.id,
        body: commentText,
        created_at: new Date().toISOString(),
        likes: 0,
        liked: false
      });
      
      this.comments.add(comment);
      this.model.set('comments', (this.model.get('comments') || 0) + 1);
      
      // Clear input
      this.$('.comment-input').val('');
      
      App.persist();
      this.renderComments(); // Refresh comments display
    },
    
    renderComments: function(){
      const $commentsList = this.$('.comments-list');
      $commentsList.empty();
      
      // Use the collection's forPost method
      const postComments = this.comments.forPost(this.model.id);
      
      if (postComments.length === 0) {
        $commentsList.html('<div class="no-comments">No comments yet. Be the first to comment!</div>');
        return;
      }
      
      postComments.forEach((comment) => {
        const commentUser = window.App.users.get(comment.get('user_id'));
        let userData = commentUser ? commentUser.toDisplay() : { 
          name: 'Guest', 
          avatar: 'https://randomuser.me/api/portraits/men/0.jpg' 
        };
        
        // Update avatar if this is the current user
        if (this.profileManager && comment.get('user_id') === this.currentUser.id) {
          userData.avatar = this.profileManager.getProfilePicture();
        }
        
        const isCurrentUserComment = comment.get('user_id') === this.currentUser.id;
        
        const commentEl = $(`
          <div class="comment-item" data-comment-id="${comment.id}">
            <img src="${userData.avatar}" alt="${userData.name}" class="avatar comment-avatar" />
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-author">${_.escape(userData.name)}</span>
                <span class="comment-time">${comment.getTimeAgo ? comment.getTimeAgo() : 'Just now'}</span>
              </div>
              <div class="comment-body">${_.escape(comment.get('body'))}</div>
              <div class="comment-actions">
                <button class="comment-like ${comment.get('liked') ? 'comment-liked' : ''}">
                  ${comment.get('liked') ? 'Liked' : 'Like'}
                </button>
                <span class="comment-likes-count">${comment.get('likes') || 0}</span>
                ${isCurrentUserComment ? `
                  <div class="comment-menu-container">
                    <button class="comment-menu-btn">···</button>
                    <div class="comment-dropdown-menu">
                      <button class="dropdown-item delete-comment">
                        <svg class="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                        Delete Comment
                      </button>
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `);
        
        $commentsList.append(commentEl);
      });
    },
    
    onShare: function(e){
      e.preventDefault();
      this.model.set('shares', (this.model.get('shares') || 0) + 1);
      alert('Shared post!');
      App.persist();
    },
    
    remove: function() {
      // Clean up event listeners
      $(document).off('click.postview');
      $(document).off('profilePictureChanged.postview');
      return Backbone.View.prototype.remove.call(this);
    },
    
    render: function(){
      // Update avatars before rendering
      this.updateUserAvatars();
      
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
        liked: this.model.get('liked') || false,
        currentUser: this.currentUser
      }));
      
      this.renderComments();
      
      return this;
    }
  });

  App.PostsView = Backbone.View.extend({
    el: '#feed',
    
    initialize: function(opts){
      this.users = opts.users;
      this.currentUser = opts.currentUser;
      this.comments = opts.comments;
      this.listenTo(this.collection, 'add', this.addPost);
      this.listenTo(this.collection, 'remove', this.render);
      this.listenTo(this.collection, 'reset', this.render);
      
      // Listen for user changes to update avatars
      this.listenTo(this.users, 'change', this.onUserChange);
      
      // Listen for profile picture changes
      if (typeof ProfilePictureManager !== 'undefined') {
        this.profileManager = ProfilePictureManager.getInstance();
        $(document).on('profilePictureChanged.postsview', this.onProfilePictureChange.bind(this));
      }
    },
    
    onUserChange: function() {
      // Re-render when user data changes
      this.render();
    },
    
    onProfilePictureChange: function() {
      console.log('Profile picture changed, re-rendering posts');
      this.render();
    },
    
    addPost: function(post) {
      var user = this.users.get(post.get('user_id'));
      var userData = user ? user.toDisplay() : { 
        name: 'Guest', 
        avatar: 'images/pp.png' 
      };
      
      // Use user-specific profile picture if available
      if (typeof ProfilePictureManager !== 'undefined' && user) {
        const profileManager = ProfilePictureManager.getInstance();
        const username = user.get('username');
        if (username) {
          const userProfilePic = profileManager.getUserProfilePicture(username);
          if (userProfilePic) {
            userData.avatar = userProfilePic;
          }
        }
      }
      
      var v = new App.PostView({
        model: post, 
        user: userData,
        currentUser: this.currentUser,
        comments: this.comments
      });
      
      // Add new post at the top
      this.$el.prepend(v.render().el);
    },
    
    render: function(){
      this.$el.empty();
      
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
        var userData = user ? user.toDisplay() : { 
          name: 'Guest', 
          avatar: 'images/pp.png' 
        };
        
        // Use user-specific profile picture if available
        if (typeof ProfilePictureManager !== 'undefined' && user) {
          const profileManager = ProfilePictureManager.getInstance();
          const username = user.get('username');
          if (username) {
            const userProfilePic = profileManager.getUserProfilePicture(username);
            if (userProfilePic) {
              userData.avatar = userProfilePic;
            }
          }
        }
        
        var v = new App.PostView({
          model: post, 
          user: userData,
          currentUser: this.currentUser,
          comments: this.comments
        });
        this.$el.append(v.render().el);
      }, this);
      
      return this;
    },
    
    remove: function() {
      // Clean up event listeners
      $(document).off('profilePictureChanged.postsview');
      return Backbone.View.prototype.remove.call(this);
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
      
      // Listen for profile picture changes to update composer avatar
      if (typeof ProfilePictureManager !== 'undefined') {
        this.profileManager = ProfilePictureManager.getInstance();
        $(document).on('profilePictureChanged.composerview', this.onProfilePictureChange.bind(this));
      }
      
      this.render();
      this.setupTextareaAutoResize();
    },
    
    onProfilePictureChange: function() {
      console.log('Profile picture changed, updating composer');
      if (this.profileManager) {
        this.user.avatar = this.profileManager.getProfilePicture();
        this.render();
      }
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
      
      // If we have an image file, convert it to data URL
      if (this.imageFile) {
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
      
      // Add to collection (this will trigger the PostsView to render)
      this.collection.add(post, { at: 0 });
      App.persist();
      
      // Reset form
      this.resetForm();
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
      if (this.$('#image-upload').length) {
        this.$('#image-upload').val('');
      }
      this.$('.post-btn').prop('disabled', true);
    },
    
    // Clean up object URLs when view is removed
    remove: function() {
      if (this.imageUrl) {
        URL.revokeObjectURL(this.imageUrl);
      }
      $(document).off('profilePictureChanged.composerview');
      return Backbone.View.prototype.remove.call(this);
    },
    
    render: function(){
      this.$el.html(this.template({ user: this.user }));
      return this;
    }
  });
})();