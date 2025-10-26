// Models: User, Post, Comment
(function(){
  window.App = window.App || {};

 App.User = Backbone.Model.extend({
    defaults: {
        id: null,
        name: "Anonymous",
        email: "",
        avatar: "",
        isOnline: true,
        username: "" // Add username field
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
            name: this.get('name'),
            avatar: avatar || 'images/pp.png',
            email: this.get('email'),
            isOnline: this.get('isOnline'),
            username: this.get('username')
        };
    }
});

  App.Users = Backbone.Collection.extend({
    model: App.User
  });

  App.Post = Backbone.Model.extend({
    defaults: {
      id: null,
      user_id: null,
      body: "",
      image: "",
      likes: 0,
      comments: 0,
      shares: 0,
      created_at: null,
      liked: false
    },
    
    initialize: function(){
      if(!this.get('created_at')) {
        this.set('created_at', new Date().toISOString());
      }
      
      // Generate a unique ID if not provided
      if(!this.get('id')) {
        this.set('id', 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
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
    },
    
    // Format time for display (e.g., "2 hrs", "5 mins")
    getTimeAgo: function() {
      const created = new Date(this.get('created_at'));
      const now = new Date();
      const diffMs = now - created;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return diffMins + ' mins';
      if (diffHours < 24) return diffHours + ' hrs';
      if (diffDays < 7) return diffDays + ' days';
      return created.toLocaleDateString();
    },
    
    // Increment comment count
    addComment: function() {
      this.set('comments', (this.get('comments') || 0) + 1);
    },
    
    // Decrement comment count
    removeComment: function() {
      this.set('comments', Math.max(0, (this.get('comments') || 0) - 1));
    },
    
    // Increment share count
    addShare: function() {
      this.set('shares', (this.get('shares') || 0) + 1);
    },
    
    // Check if post has image
    hasImage: function() {
      return !!this.get('image') && this.get('image').trim().length > 0;
    }
  });

  App.Posts = Backbone.Collection.extend({
    model: App.Post,
    
    comparator: function(post) {
      return -new Date(post.get('created_at')).getTime();
    }
  });

  App.Comment = Backbone.Model.extend({
    defaults: {
      id: null,
      post_id: null,
      user_id: null,
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
      if (diffMins < 60) return diffMins + ' mins';
      if (diffHours < 24) return diffHours + ' hrs';
      if (diffDays < 7) return diffDays + ' days';
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
    }
  });
})();