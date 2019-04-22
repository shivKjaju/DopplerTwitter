var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var monk = require('monk');
var db = monk('localhost:27017/Post');

var uSchema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    following: {
        type: Array
    },
    favorites: {
        type: Array
    }
});

var User = module.exports = mongoose.model('users', uSchema);

// create user

module.exports.createUser = function(nUser, err){
    console.log("Inside of create users", nUser)
    nUser.save(err);
}


module.exports.getUserByUsername = function(uname, rsp){
	var query = {username: uname};
    User.findOne(query, function(err,obj) {
        rsp(obj);
    });
    
}

module.exports.getUserById = function(id, done){
	User.findById(id, done);
}

module.exports.checkPassword = function(userPassword, hide,callback){
    bcrypt.compare(userPassword, hide, function(err, match){
        if(err) throw err;
        callback(null, match);
    });
}