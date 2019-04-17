var mongoose = require('mongoose');
// var bcrypt = require('bcrypt.js');

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
    }
});

var User = module.exports = mongoose.model('User', uSchema);

// create user

module.exports.createUser = function(nUser, done){
    nUser.save(done);
}

// module.exports.checkPassword = function(userPassword, hide,callback){
//     bcrypt.compare(userPassword, hide, function(err, match){
//         if(err) throw err;
//         callback(null, match);
//     });
// }