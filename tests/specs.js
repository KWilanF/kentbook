describe('KentBook basic model tests', function(){
  it('creates a post and validates non-empty body', function(){
    var p = new App.Post({body:''});
    var err = p.validate(p.attributes);
    expect(err).toBe('Post body cannot be empty.');
    var p2 = new App.Post({body:'Hello test', user_id:1});
    expect(p2.get('body')).toBe('Hello test');
  });

  it('increments likes with toggleLike', function(){
    var p = new App.Post({body:'like test', user_id:1, likes:0});
    p.toggleLike();
    expect(p.get('likes')).toBe(1);
  });
});
