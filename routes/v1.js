var express = require('express'),
    app = express(),
    router = express.Router()
    User = require('../models/User'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://192.168.33.25:27017/test');
//mongoose.connect('mongodb://localhost:27017/test');

router.get('/',function(req,res){
  res.send('V1 Router');
});

router.get('/users',function(req,res){
  User.find(function (err,users) {
    if (err) return console.error(err);
    res.send(users);
  });
});

module.exports = router;
