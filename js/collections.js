(function(){
  window.App = window.App || {};

  App.Users = Backbone.Collection.extend({
    model: App.User
  });

  App.Posts = Backbone.Collection.extend({
    model: App.Post,
    comparator: function(a,b){
      // Newest first
      return new Date(b.get('created_at')) - new Date(a.get('created_at'));
    }
  });

  App.Comments = Backbone.Collection.extend({
    model: App.Comment
  });
})();
