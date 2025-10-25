(function(){
  window.App = window.App || {};

  App.Users = Backbone.Collection.extend({
    model: App.User,
    
    // Helper to get online users (for contacts sidebar)
    getOnlineUsers: function() {
      return this.filter(function(user) {
        return user.id !== 1; // Exclude current user for contacts list
      });
    }
  });

  App.Posts = Backbone.Collection.extend({
    model: App.Post,
    
    comparator: function(a, b) {
      // Newest first - ensure proper date comparison
      var dateA = new Date(a.get('created_at') || 0);
      var dateB = new Date(b.get('created_at') || 0);
      return dateB - dateA;
    },
    
    // Get posts by a specific user
    getPostsByUser: function(userId) {
      return this.where({ user_id: userId });
    },
    
    // Get total likes for a user
    getTotalLikesForUser: function(userId) {
      return this.reduce(function(total, post) {
        return total + (post.get('user_id') === userId ? (post.get('likes') || 0) : 0);
      }, 0);
    }
  });

  App.Comments = Backbone.Collection.extend({
    model: App.Comment,
    
    comparator: function(a, b) {
      // Oldest first for comments (chronological order)
      var dateA = new Date(a.get('created_at') || 0);
      var dateB = new Date(b.get('created_at') || 0);
      return dateA - dateB;
    },
    
    // Get comments for a specific post
    getCommentsForPost: function(postId) {
      return this.where({ post_id: postId });
    }
  });
})();