var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/User')
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var user = require('../model/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var collection = db.get('users');
  collection.findOne({username:req.query.username, password:req.query.password},function(err, callback){
    if (err) throw err;
    res.json(callback);
  });
});

router.post('/register', function(req, res){
  
});
module.exports = router;
