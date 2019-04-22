var express = require('express');
var router = express.Router();
var objectId = require('mongodb').objectID;
var monk = require('monk');
var db = monk('localhost:27017/Post');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../model/user');

/* GET users listing. */
// /api/posts with get method

router.get('/', function(req, res){
  var userCollection = db.get('users');
  userCollection.findOne({username: req.query.username, password: req.query.password}, function(err, users){
      if (err) throw err;
      res.json(users);
  });
});

router.post('/register', function(req, res){
  //console.log("req",req);
  var name = req.body.user.name;
  var username = req.body.user.username;
  var password = req.body.user.password;
  var cpassword = req.body.user.password1;
  var email = req.body.user.email;


  var flag = 1;


  User.getUserByUsername(username, function(doc){
    if(doc) {
      console.log("found", doc);
      res.send({error:'Username is already taken, please choose a different username.'});
      return;
    }
    var nUser = new User({
      name: name,
      username: username,
      email : email,
      password : password 
    });
  
    User.createUser(nUser, function(err){
      if(err)  {
        res.send({msg:'User could not be registered at this time, please contact administrator'});
        return;
      }
      res.send({msg: 'Registration successful, please login'});
    });
  });

});


module.exports = router;
