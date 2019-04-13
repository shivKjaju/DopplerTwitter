var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/POST');

router.get('/', function(req, res){
    var collection = db.get('posts');
    console.alert(collection);
    collection.find({}, function(err, posts){
        if (err) throw err;
        res.json(posts);
    });
});

module.exports = router;