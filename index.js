var express = require('express'),
    app = express(),
    passport = require('passport'),
    Strategy = require('passport-facebook'),
    config = require('./config.json');

var router = express.Router();
var v1 = require('./controllers/v1');
var user = {name:"",last_name:"",email:""};

console.log(config);
console.log(Strategy);
// Configure Facebook strategy for Passport
// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy({
  clientID: config.facebook.key,
  clientSecret: config.facebook.secret,
  callbackURL: 'http://localhost:3005/auth/facebook/callback',
  profileFields: ['id', 'emails', 'name','displayName']
}, function(accessToken, refreshToken, profile, cb, done) {
  console.log("Auth done");
  user.name = cb.name.givenName;
  user.last_name = cb.name.familyName;
  user.email = cb.emails[0].value;
  done(null, cb);
}));
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/v1',
    scope: [
      'user_friends',
      'email'
    ]
  }),
  function(req, res) {
    console.log('Booyah!!');
    // Successful authentication, show Display Name.
    console.log(req.user);
    res.send(user);
  });

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.use('/v1',v1);
app.listen(3005,function(){
  console.log('Server Running!!');
});
