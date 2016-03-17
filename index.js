var express = require('express'),
    app = express(),
    passport = require('passport'),
    Strategy = require('passport-facebook'),
    config = require('./config.json');

var router = express.Router();
var v1 = require('./controllers/v1');
var user = {name:"",last_name:"",email:"",location:""};

//console.log(config);
//console.log(Strategy);
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
  profileFields: ['id','name','displayName','photos','emails' ,'hometown','location' ,'profileUrl', 'friends']
}, function(accessToken, refreshToken, profile, cb, done) {
  console.log(cb._json); //dentro del objeto del perfil, existe el objeto JSON con los datos requeridos
  user.name = cb._json.first_name;
  user.last_name = cb._json.last_name;
  user.email = cb._json.email;
  user.location = cb._json.location;
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

app.get('/auth/facebook', passport.authenticate('facebook',{ scope: ['email', 'public_profile', 'user_location'] }));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/v1',
    scope: ['email', 'public_profile', 'user_location']
  }),
  function(req, res) {
    // Successful authentication, show Display Name.
    //console.log(req);
    res.send(user);
  });

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.use('/v1',v1);
app.listen(3005,function(){
  console.log('Server Running!!');
});
