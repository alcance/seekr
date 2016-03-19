var express = require('express'),
    app = express(),
    passport = require('passport'),
    Strategy = require('passport-facebook'),
    config = require('./config.json'),
    bodyParser = require('body-parser'),
    router = express.Router();
    
var v1 = require('./controllers/v1');
var auth = require('./controllers/auth');

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.use('/v1',v1); //API de V1
app.use('/auth',auth); // Todo lo que tenga que ver con auth
app.listen(3005,function(){
  console.log('Server Running!!');
});
