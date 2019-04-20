var express = require('express');
var router = express.Router();
var objectId = require('mongodb').objectID;
var monk = require('monk');
var db = monk('localhost:27017/Post');

// /api/posts/:postid with get method
router.get('/:postid', function(req, res){
    var collection = db.get('posts');
    collection.findOne({_id: req.params.postid}, function(err, posts){
        if(err) throw err;
        res.json(posts);
    });
});

// /api/posts with get method
router.get('/', function(req, res){
    var postCollection = db.get('posts');
    postCollection.find({}, function(err, posts){
        if (err) throw err;
        res.json(posts);
    });
});


// /api/posts with post method
router.post('/', function(req, res){
    var collection = db.get('posts');
    collection.insert({
        author: req.body.author,
        content: req.body.content,
        date: req.body.date,
        favorited: 0,
        replies: [],
        userMentions: req.body.userMentions
    }, function(err, new_post){
        if (err) throw err;
        res.json(new_post);
    });
});


// /api/posts/:postid with post method
router.post('/:postid', function(req, res){
    var collection = db.get('posts');
    var objectId = new objectId();
    collection.update(
        {
            _id: req.params.postid
        },
        {
            _id: objectId,
            author: req.body.author,
            content: req.body.content,
            date: new Date().toString(),
            favorited: req.body.favorited
        },
        function(err, posts){
            if(err) throw err;
            res.json(posts);
        }
    );
   
});

// /api/posts/:postid with delete method
router.delete('post/delete/:postid', function(req, res){
    var collection = db.get('posts');
    collection.remove({_id: req.params.postid}, function(err, posts){
        if(err) throw err;
        res.json(posts);
    });
});

// /api/posts/:postid with put method
router.put('/:postid', function(req, res){
    var collection = db.get('posts');
    console.log("asdasdasd");
    collection.update({
        _id: req.params.postid
    },
    {
        author: req.body.author,
        content: req.body.content,
        date: new Date().toString(),
        favorited: req.body.favorited,
        replies: [],
        userMentions: []
    }, function(err, posts){
        if (err) throw err;
        res.json(posts);
    });
});

router.get('/', function(req, res){
    var collection = db.get('posts');
    var mapFunc = function(){
        emit(this.author, this.content);
    };
    var reduceFunc = function(author, content){
        return content.join();
    };
    collection.mapReduce(
        {
            mapFunc,
            reduceFunc,
            out: "postResults"
        }, function(err, out){
            if (err) throw err;
            res.json(out)
        }
    );

});


//module.exports must be our last line
module.exports = router;