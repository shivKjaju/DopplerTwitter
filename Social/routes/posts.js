var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/POST');

router.get('/', function(req, res){
    var collection = db.get('posts');
    collection.find({}, function(err, posts){
        if (err) throw err;
        res.json(posts);
    });
});

router.post('/', function(req, res){
    var collection = db.get('posts');
    collection.insert({
        author: req.body.author,
        content: req.body.content,
        date: req.body.date,
        favourited: 0,
        replies: [],
        userMentions: req.body.userMentions
    }, function(err, movie){
        if (err) throw err;
        res.json(movie);
    });
});

//module.exports must be our last line
module.exports = router;