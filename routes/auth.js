var express = require('express'),
    app = express()
    passport = require('passport'),
    Strategy = require('passport-facebook'),
    config = require('../config.json'),
    bodyParser = require('body-parser'),
    router = express.Router(),
    User = require('../models/User');

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
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      profileFields: ['id','name','displayName','photos','emails' ,'hometown','location' ,'profileUrl', 'friends']
    }, function(accessToken, refreshToken, profile, done) {

      console.log('User profile', profile);

      //Find user or create one.
      User.findOne({
        facebookId: profile.id
      }, function(err, user){
        if (err) {
          return done(err);
        }
        if (!user) {
          // No user has been found
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            provider: 'facebook',
            facebook: profile._json
          });

          // Save user
          user.save(function(err){
            if (err) console.log(err);
            return done(err, user);
          });
        } else {
          // Found user
          return done(err, user);
        }
      });
      //done(null,cb);
    }));

    passport.serializeUser(function(user, cb) {
      cb(null, user);
    });

    passport.deserializeUser(function(obj, cb) {
      cb(null, obj);
    });

    router.use(passport.initialize());
    router.use(passport.session());
    router.get('/facebook', passport.authenticate('facebook', { scope: 'email'}));

    router.get('/facebook/callback', passport.authenticate('facebook', {
      failureRedirect:'/v1',
      scope: ['email', 'public_profile', 'user_location']
    }),
    function(req,res){
      console.log('Sucessfully connected.');
      console.log(User);
      res.redirect('/');
    });

module.exports = router;
