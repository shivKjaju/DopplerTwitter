var express = require('express');
var router = express.Router();
var objectId = require('mongodb').objectID;
var monk = require('monk');
var db = monk('localhost:27017/Post');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var user = require('../model/user');

/* GET users listing. */

router.get('/', function(req, res){
  var userCollection = db.get('users');
  userCollection.find({}, function(err, users){
      if (err) throw err;
      res.json(users);
  });
});

// register user
//router.post('/register', function(req, res){
  
//});
module.exports = router;
