// Models: User, Post, Comment
(function(){
  window.App = window.App || {};

  App.User = Backbone.Model.extend({
    defaults: {
      id: null,
      name: "Anonymous",
      email: "",
      avatar: "",
      isOnline: true
    },
    
    // Format for display in UI
    toDisplay: function() {
      return {
        name: this.get('name'),
        avatar: this.get('avatar') || 'https://randomuser.me/api/portraits/men/0.jpg',
        email: this.get('email'),
        isOnline: this.get('isOnline')
      };
    }
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
      try {
        new URL(url);
        return url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null;
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
    
    // Increment share count
    addShare: function() {
      this.set('shares', (this.get('shares') || 0) + 1);
    },
    
    // Check if post has image
    hasImage: function() {
      return !!this.get('image') && this.get('image').trim().length > 0;
    }
  });

  App.Comment = Backbone.Model.extend({
    defaults: {
      id: null,
      post_id: null,
      user_id: null,
      body: "",
      created_at: null,
      likes: 0
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
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return diffMins + ' mins';
      return diffHours + ' hrs';
    },
    
    // Like/unlike comment
    toggleLike: function(){
      this.set('likes', (this.get('likes') || 0) + 1);
    }
  });
})();