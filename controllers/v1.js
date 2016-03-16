var express = require('express');
var app = express();
var router = express.Router();

router.get('/',function(req,res){
  res.send('V1 Router');
});

module.exports = router;
