var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/Post');

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

router.get('/:id', function(req, res){
    var collection = db.get('posts');
    /* not sure if we have to find one post with the id
    or all the posts with the id*/
    collection.findOne({_id: req.params.id}, function(err, posts){
        if(err) throw err;
        res.json(posts);
    });
});

router.post('/:id', function(req, res){
    var collection = db.get('posts');
    collection.insertOne({_id: req.params.id} ,{
        author: req.body.author,
        content: req.body.content,
        date: req.body.date,
        // not sure about favourited field here
       userMentions: req.body.userMentions
    },
    function(err, movie){
        if(err) throw err;
        res.json(movie);
    });
});

router.delete('/:id', function(req, res){
    var collection = db.get('posts');
    collection.remove({_id: req.params.id}, function(err, posts){
        if(err) throw err;
        res.json(posts);
    });
});
//module.exports must be our last line
module.exports = router;