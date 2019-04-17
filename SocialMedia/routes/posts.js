var express = require('express');
var router = express.Router();
var objectId = require('mongodb').objectID;
var monk = require('monk');
var db = monk('localhost:27017/Post');

// /api/posts with get method
router.get('/', function(req, res){
    var collection = db.get('posts');
    collection.find({}, function(err, posts){
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
        favourited: 0,
        replies: [],
        userMentions: req.body.userMentions
    }, function(err, movie){
        if (err) throw err;
        res.json(movie);
    });
});

// /api/posts/:postid with get method
router.get('/:postid', function(req, res){
    var collection = db.get('posts');
    /* not sure if we have to find one post with the id
    or all the posts with the id*/
    collection.find({_id: req.params.postid}, function(err, posts){
        if(err) throw err;
        res.json(posts);
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
            $push:
            {
                comments:
                {
                   id: objectId,
                   author: req.body.author,
                   content: req.body.content,
                   date: new Date().toString(),
                   votes: 0,
    			   body: req.body.data.content 
                }
            }
        },
        function(err, posts){
            if(err) throw err;
            res.json(posts);
        }
    );
   
});

// /api/posts/:postid with delete method
router.delete('/:postid', function(req, res){
    var collection = db.get('posts');
    collection.remove({_id: req.params.postid}, function(err, posts){
        if(err) throw err;
        res.json(posts);
    });
});

// /api/posts/:postid with put method
router.put('/:postid', function(req, res){
    var collection = db.get('posts');
    collection.update({
        _id: req.params.postid
    },
    {
        favourited: req.body.favourited
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