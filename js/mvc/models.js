// Models: User, Post, Comment
(function(){
  window.App = window.App || {};

 App.User = Backbone.Model.extend({
    defaults: {
        id: null,
        name: "Anonymous",
        firstName: "",
        lastName: "",
        email: "",
        avatar: "",
        isOnline: true,
        username: "",
        location: "Manila, Philippines",
        workplace: "KentBook",
        education: "University of the Philippines",
        joinedDate: null
    },
    
    initialize: function() {
      if (!this.get('joinedDate')) {
        this.set('joinedDate', new Date().toISOString());
      }
      
      // Generate name from firstName and lastName if not provided
      if (!this.get('name') && (this.get('firstName') || this.get('lastName'))) {
        this.set('name', `${this.get('firstName')} ${this.get('lastName')}`.trim());
      }
    },
    
    // Format for display in UI
    toDisplay: function() {
        let avatar = this.get('avatar');
        
        // Use user-specific profile picture if available
        if (typeof ProfilePictureManager !== 'undefined') {
            const profileManager = ProfilePictureManager.getInstance();
            const username = this.get('username');
            
            if (username) {
                const userProfilePic = profileManager.getUserProfilePicture(username);
                if (userProfilePic) {
                    avatar = userProfilePic;
                }
            }
        }
        
        return {
            id: this.get('id'),
            name: this.get('name'),
            firstName: this.get('firstName'),
            lastName: this.get('lastName'),
            avatar: avatar || 'images/pp.png',
            email: this.get('email'),
            isOnline: this.get('isOnline'),
            username: this.get('username'),
            location: this.get('location'),
            workplace: this.get('workplace'),
            education: this.get('education'),
            joinedDate: this.get('joinedDate')
        };
    },
    
    // Get user's full name
    getFullName: function() {
      return this.get('name') || `${this.get('firstName')} ${this.get('lastName')}`.trim() || 'Anonymous';
    },
    
    // Get user's first name for personalization
    getFirstName: function() {
      return this.get('firstName') || this.get('name')?.split(' ')[0] || 'User';
    }
});

  App.Users = Backbone.Collection.extend({
    model: App.User,
    
    // Find user by username
    findByUsername: function(username) {
      return this.find(function(user) {
        return user.get('username') === username;
      });
    },
    
    // Find user by email
    findByEmail: function(email) {
      return this.find(function(user) {
        return user.get('email') === email;
      });
    },
    
    // Get online users
    getOnlineUsers: function() {
      return this.filter(function(user) {
        return user.get('isOnline') === true;
      });
    }
  });

  App.Post = Backbone.Model.extend({
    defaults: {
      id: null,
      user_id: null,
      user_name: null, // Store user name for easier display
      user_username: null, // Store username for profile linking
      body: "",
      image: "",
      likes: 0,
      comments: 0,
      shares: 0,
      created_at: null,
      liked: false,
      is_profile_post: false // Flag for profile-specific posts
    },
    
    initialize: function(){
      if(!this.get('created_at')) {
        this.set('created_at', new Date().toISOString());
      }
      
      // Generate a unique ID if not provided
      if(!this.get('id')) {
        this.set('id', 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
      }
      
      // Set user_name from user_id if available
      if (this.get('user_id') && !this.get('user_name') && window.App && App.users) {
        const user = App.users.get(this.get('user_id'));
        if (user) {
          this.set({
            user_name: user.get('name'),
            user_username: user.get('username')
          });
        }
      }
    },
    
    validate: function(attrs){
      // Only check for empty or whitespace-only strings
      if(!attrs.body || attrs.body.trim().length === 0){
        return "Post body cannot be empty.";
      }
      
      // Optional: Validate image URL format if provided
      if(attrs.image && !this.isValidImageUrl(attrs.image)) {
        return "Please provide a valid image URL.";
      }
    },
    
    // Helper to validate image URLs
    isValidImageUrl: function(url) {
      if(!url) return true; // Empty is valid (no image)
      // Allow data URLs for uploaded images
      if (url.startsWith('data:image/')) return true;
      try {
        new URL(url);
        return url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null || url.startsWith('data:image/');
      } catch {
        return false;
      }
    },
    
    toggleLike: function(){
      const currentLikes = this.get('likes') || 0;
      const currentlyLiked = this.get('liked') || false;
      
      if(currentlyLiked) {
        this.set({
          likes: Math.max(0, currentLikes - 1),
          liked: false
        });
      } else {
        this.set({
          likes: currentLikes + 1,
          liked: true
        });
      }
      
      // Trigger change for views to update
      this.trigger('change:likes change:liked');
    },
    
    // Format time for display (e.g., "2 hrs", "5 mins")
    getTimeAgo: function() {
      const created = new Date(this.get('created_at'));
      const now = new Date();
      const diffMs = now - created;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      const diffWeeks = Math.floor(diffDays / 7);
      const diffMonths = Math.floor(diffDays / 30);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return diffMins + ' min' + (diffMins === 1 ? '' : 's');
      if (diffHours < 24) return diffHours + ' hr' + (diffHours === 1 ? '' : 's');
      if (diffDays < 7) return diffDays + ' day' + (diffDays === 1 ? '' : 's');
      if (diffWeeks < 4) return diffWeeks + ' week' + (diffWeeks === 1 ? '' : 's');
      if (diffMonths < 12) return diffMonths + ' month' + (diffMonths === 1 ? '' : 's');
      return created.toLocaleDateString();
    },
    
    // Increment comment count
    addComment: function() {
      this.set('comments', (this.get('comments') || 0) + 1);
      this.trigger('change:comments');
    },
    
    // Decrement comment count
    removeComment: function() {
      this.set('comments', Math.max(0, (this.get('comments') || 0) - 1));
      this.trigger('change:comments');
    },
    
    // Increment share count
    addShare: function() {
      this.set('shares', (this.get('shares') || 0) + 1);
      this.trigger('change:shares');
    },
    
    // Check if post has image
    hasImage: function() {
      return !!this.get('image') && this.get('image').trim().length > 0;
    },
    
    // Get user data for this post
    getUser: function() {
      if (window.App && App.users) {
        return App.users.get(this.get('user_id'));
      }
      return null;
    },
    
    // Check if post belongs to specific user
    isByUser: function(userId) {
      return this.get('user_id') === userId;
    },
    
    // Check if post belongs to current user
    isByCurrentUser: function() {
      const currentUsername = localStorage.getItem("kentbook_current_user");
      if (!currentUsername) return false;
      
      const users = JSON.parse(localStorage.getItem("kentbook_users")) || [];
      const currentUser = users.find(u => u.username === currentUsername);
      
      if (!currentUser) return false;
      
      // For simplicity, we'll assume posts with user_id 1 belong to current user
      // In a real app, you'd have proper user ID matching
      return this.get('user_id') === 1 || this.get('user_username') === currentUsername;
    }
  });

  App.Posts = Backbone.Collection.extend({
    model: App.Post,
    
    comparator: function(post) {
      return -new Date(post.get('created_at')).getTime();
    },
    
    // Get posts by a specific user
    getPostsByUser: function(userId) {
      return this.filter(function(post) {
        return post.get('user_id') === userId;
      });
    },
    
    // Get posts by username
    getPostsByUsername: function(username) {
      return this.filter(function(post) {
        return post.get('user_username') === username;
      });
    },
    
    // Get posts by current user
    getCurrentUserPosts: function() {
      const currentUsername = localStorage.getItem("kentbook_current_user");
      if (!currentUsername) return [];
      
      return this.filter(function(post) {
        // For current user, include posts with user_id 1 or matching username
        return post.get('user_id') === 1 || post.get('user_username') === currentUsername;
      });
    },
    
    // Get total likes for a user
    getTotalLikesForUser: function(userId) {
      return this.reduce(function(total, post) {
        return total + (post.get('user_id') === userId ? (post.get('likes') || 0) : 0);
      }, 0);
    },
    
    // Get user's post count
    getUserPostCount: function(userId) {
      return this.getPostsByUser(userId).length;
    }
  });

  App.Comment = Backbone.Model.extend({
    defaults: {
      id: null,
      post_id: null,
      user_id: null,
      user_name: null,
      user_username: null,
      body: "",
      created_at: null,
      likes: 0,
      liked: false
    },
    
    initialize: function(){
      if(!this.get('created_at')) {
        this.set('created_at', new Date().toISOString());
      }
      
      // Generate a unique ID if not provided
      if(!this.get('id')) {
        this.set('id', 'comment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
      }
      
      // Set user_name from user_id if available
      if (this.get('user_id') && !this.get('user_name') && window.App && App.users) {
        const user = App.users.get(this.get('user_id'));
        if (user) {
          this.set({
            user_name: user.get('name'),
            user_username: user.get('username')
          });
        }
      }
    },
    
    validate: function(attrs){
      if(!attrs.body || attrs.body.trim().length === 0){
        return "Comment cannot be empty.";
      }
      if(!attrs.post_id){
        return "Comment must be associated with a post.";
      }
      if(!attrs.user_id){
        return "Comment must have an author.";
      }
    },
    
    // Format time for display
    getTimeAgo: function() {
      const created = new Date(this.get('created_at'));
      const now = new Date();
      const diffMs = now - created;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return diffMins + ' min' + (diffMins === 1 ? '' : 's');
      if (diffHours < 24) return diffHours + ' hr' + (diffHours === 1 ? '' : 's');
      if (diffDays < 7) return diffDays + ' day' + (diffDays === 1 ? '' : 's');
      return created.toLocaleDateString();
    },
    
    // Like/unlike comment
    toggleLike: function(){
      const currentLikes = this.get('likes') || 0;
      const currentlyLiked = this.get('liked') || false;
      
      if(currentlyLiked) {
        this.set({
          likes: Math.max(0, currentLikes - 1),
          liked: false
        });
      } else {
        this.set({
          likes: currentLikes + 1,
          liked: true
        });
      }
      
      this.trigger('change:likes change:liked');
    },
    
    // Get user data for this comment
    getUser: function() {
      if (window.App && App.users) {
        return App.users.get(this.get('user_id'));
      }
      return null;
    },
    
    // Check if comment belongs to current user
    isByCurrentUser: function() {
      const currentUsername = localStorage.getItem("kentbook_current_user");
      if (!currentUsername) return false;
      
      return this.get('user_username') === currentUsername;
    }
  });

  App.CommentCollection = Backbone.Collection.extend({
    model: App.Comment,
    
    // Sort by creation date (newest first)
    comparator: function(comment) {
      return -new Date(comment.get('created_at')).getTime();
    },
    
    // Get comments for a specific post
    forPost: function(postId) {
      return this.filter(function(comment) {
        return comment.get('post_id') === postId;
      });
    },
    
    // Remove all comments for a post
    removeForPost: function(postId) {
      const commentsToRemove = this.filter(function(comment) {
        return comment.get('post_id') === postId;
      });
      this.remove(commentsToRemove);
    },
    
    // Get comments by a specific user
    getCommentsByUser: function(userId) {
      return this.filter(function(comment) {
        return comment.get('user_id') === userId;
      });
    }
  });
})();