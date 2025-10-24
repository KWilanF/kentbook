describe('KentBook basic model tests', function(){
  
  describe('Post Model', function(){
    it('creates a post and validates non-empty body', function(){
      var p = new App.Post({body:''});
      var err = p.validate(p.attributes);
      expect(err).toBe('Post body cannot be empty.');
      
      var p2 = new App.Post({body:'Hello test', user_id:1});
      expect(p2.get('body')).toBe('Hello test');
      expect(p2.get('user_id')).toBe(1);
    });

    it('increments and decrements likes with toggleLike', function(){
      var p = new App.Post({body:'like test', user_id:1, likes:0});
      p.toggleLike(); // Like
      expect(p.get('likes')).toBe(1);
      expect(p.get('liked')).toBe(true);
      
      p.toggleLike(); // Unlike
      expect(p.get('likes')).toBe(0);
      expect(p.get('liked')).toBe(false);
    });

    it('generates unique ID and timestamp on initialize', function(){
      var p = new App.Post({body:'test post', user_id:1});
      expect(p.get('id')).toMatch(/^post_\d+_/);
      expect(p.get('created_at')).toBeDefined();
      expect(new Date(p.get('created_at'))).toBeInstanceOf(Date);
    });

    it('validates image URLs', function(){
      var p = new App.Post({body:'test', user_id:1});
      
      // Valid image URL
      p.set('image', 'https://example.com/image.jpg');
      var err1 = p.validate(p.attributes);
      expect(err1).toBeUndefined();
      
      // Invalid image URL
      p.set('image', 'not-a-valid-url');
      var err2 = p.validate(p.attributes);
      expect(err2).toBe('Please provide a valid image URL.');
      
      // Empty image URL is valid
      p.set('image', '');
      var err3 = p.validate(p.attributes);
      expect(err3).toBeUndefined();
    });

    it('calculates time ago correctly', function(){
      var now = new Date();
      var fiveMinutesAgo = new Date(now - 5 * 60 * 1000).toISOString();
      var twoHoursAgo = new Date(now - 2 * 60 * 60 * 1000).toISOString();
      var threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString();
      
      var p1 = new App.Post({body:'test', user_id:1, created_at: fiveMinutesAgo});
      var p2 = new App.Post({body:'test', user_id:1, created_at: twoHoursAgo});
      var p3 = new App.Post({body:'test', user_id:1, created_at: threeDaysAgo});
      
      expect(p1.getTimeAgo()).toBe('5 mins');
      expect(p2.getTimeAgo()).toBe('2 hrs');
      expect(p3.getTimeAgo()).toBe('3 days');
    });

    it('handles comment and share counts', function(){
      var p = new App.Post({body:'test', user_id:1, comments: 5, shares: 2});
      
      p.addComment();
      expect(p.get('comments')).toBe(6);
      
      p.addShare();
      expect(p.get('shares')).toBe(3);
    });

    it('detects if post has image', function(){
      var p1 = new App.Post({body:'test', user_id:1});
      var p2 = new App.Post({body:'test', user_id:1, image: 'https://example.com/image.jpg'});
      
      expect(p1.hasImage()).toBe(false);
      expect(p2.hasImage()).toBe(true);
    });
  });

  describe('User Model', function(){
    it('creates user with default values', function(){
      var user = new App.User();
      expect(user.get('name')).toBe('Anonymous');
      expect(user.get('email')).toBe('');
      expect(user.get('avatar')).toBe('');
      expect(user.get('isOnline')).toBe(true);
    });

    it('formats user for display', function(){
      var user = new App.User({
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar.jpg',
        isOnline: true
      });
      
      var display = user.toDisplay();
      expect(display.name).toBe('John Doe');
      expect(display.avatar).toBe('https://example.com/avatar.jpg');
      expect(display.email).toBe('john@example.com');
      expect(display.isOnline).toBe(true);
    });

    it('provides default avatar when none specified', function(){
      var user = new App.User({name: 'John Doe'});
      var display = user.toDisplay();
      expect(display.avatar).toBe('https://randomuser.me/api/portraits/men/0.jpg');
    });
  });

  describe('Comment Model', function(){
    it('creates comment with required fields', function(){
      var comment = new App.Comment({
        post_id: 'post_123',
        user_id: 1,
        body: 'Test comment'
      });
      
      expect(comment.get('post_id')).toBe('post_123');
      expect(comment.get('user_id')).toBe(1);
      expect(comment.get('body')).toBe('Test comment');
      expect(comment.get('created_at')).toBeDefined();
    });

    it('validates required fields', function(){
      var comment = new App.Comment({body: ''});
      var err1 = comment.validate(comment.attributes);
      expect(err1).toBe('Comment cannot be empty.');
      
      var comment2 = new App.Comment({body: 'test', post_id: null});
      var err2 = comment2.validate(comment2.attributes);
      expect(err2).toBe('Comment must be associated with a post.');
      
      var comment3 = new App.Comment({body: 'test', post_id: 'post_123', user_id: null});
      var err3 = comment3.validate(comment3.attributes);
      expect(err3).toBe('Comment must have an author.');
    });

    it('generates unique ID and handles likes', function(){
      var comment = new App.Comment({body: 'test', post_id: 'post_123', user_id: 1});
      expect(comment.get('id')).toMatch(/^comment_\d+_/);
      
      comment.toggleLike();
      expect(comment.get('likes')).toBe(1);
    });

    it('calculates time ago for comments', function(){
      var now = new Date();
      var tenMinutesAgo = new Date(now - 10 * 60 * 1000).toISOString();
      
      var comment = new App.Comment({
        body: 'test',
        post_id: 'post_123',
        user_id: 1,
        created_at: tenMinutesAgo
      });
      
      expect(comment.getTimeAgo()).toBe('10 mins');
    });
  });

  describe('Collection Functionality', function(){
    it('sorts posts by newest first', function(){
      var posts = new App.Posts([
        {id: '1', body: 'old post', user_id: 1, created_at: new Date('2023-01-01').toISOString()},
        {id: '2', body: 'new post', user_id: 1, created_at: new Date('2023-01-03').toISOString()},
        {id: '3', body: 'middle post', user_id: 1, created_at: new Date('2023-01-02').toISOString()}
      ]);
      
      expect(posts.at(0).get('body')).toBe('new post');
      expect(posts.at(1).get('body')).toBe('middle post');
      expect(posts.at(2).get('body')).toBe('old post');
    });

    it('filters posts by user', function(){
      var posts = new App.Posts([
        {id: '1', body: 'post 1', user_id: 1},
        {id: '2', body: 'post 2', user_id: 2},
        {id: '3', body: 'post 3', user_id: 1}
      ]);
      
      var user1Posts = posts.getPostsByUser(1);
      expect(user1Posts.length).toBe(2);
      expect(user1Posts[0].get('user_id')).toBe(1);
      expect(user1Posts[1].get('user_id')).toBe(1);
    });

    it('calculates total likes for user', function(){
      var posts = new App.Posts([
        {id: '1', body: 'post 1', user_id: 1, likes: 5},
        {id: '2', body: 'post 2', user_id: 2, likes: 3},
        {id: '3', body: 'post 3', user_id: 1, likes: 10}
      ]);
      
      var totalLikes = posts.getTotalLikesForUser(1);
      expect(totalLikes).toBe(15);
    });
  });
});