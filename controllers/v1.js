var express = require('express'),
    app = express(),
    router = express.Router()
    User = require('../models/User');

router.get('/',function(req,res){
  res.send('V1 Router');
});

router.get('/users',function(req,res){
  res.sen(User);
});

module.exports = router;
