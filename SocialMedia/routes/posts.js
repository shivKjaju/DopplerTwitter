var express = require('express');
var router = express.Router();
var objectId = require('mongodb').ObjectID;
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

// /api/posts/notification with get method
router.get('/viewnotifications/:userid', function(req, res){
    console.log("Currently here : " + req.params.userid);
    var postCollection = db.get('posts'); 
    var userCollection = db.get('users'); 
    userCollection.find({_id :  req.params.userid}, function(err, user){
        if (err) throw err;
        console.log('got user:', user[0].username);
        postCollection.find({userMentions : "@"+user[0].username}, function(err, posts){
            if (err) throw err;
            console.log('got posts for author:', posts);
            posts.sort()
            res.json(posts);
        });
    });
});

// /api/posts with get method
router.get('/', function(req, res){
    console.log('finding posts for author(obj):', req.query);
    var postCollection = db.get('posts');  
    console.log("The user query is : ", req.query.author);
    if(req.query.author != null){
        postCollection.find({author :  req.query.author}, function(err, posts){
            if (err) throw err;
            console.log('got posts for author:', posts);
            res.json(posts);
        });
    } else{
        postCollection.find({}, function(err, posts){
            if (err) throw err;
            res.json(posts);
        });
    }
});

// posts of followers
// router.get('/', function(req, res){
//     console.log('finding posts for author(obj):', req.query);
//     var collection = db.get('posts'); 
//     var mapFunc = function(){
//         emit(this.author, this.content);
//     };
//     var reduceFunc = function(author, content){
//         return content.join();
//     };
//     collection.mapReduce(
//         {
//             mapFunc,
//             reduceFunc,
//             {
//                 query: req.query,
//                 out: "postResults"
//             }
//         }
//     );
// });

// /api/posts with post method
router.post('/', function(req, res){
    var collection = db.get('posts');
    console.log("Adding a new Post into the DB");
    console.log(req.body.userMentions);
    collection.insert({
        author: req.body.author,
        content: req.body.content,
        date: new Date().toString(),
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
    console.log("Thje request parameter", req);
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
            favorited: req.body.favorited,
            replies: req.body.replies,
            userMentions: req.body.userMentions
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
    console.log("In Put with SpecificID");
    console.log(req.body.favorited);
    collection.update({
        _id: req.body._id
    },
    {
        author: req.body.author,
        content: req.body.content,
        date: new Date().toString(),
        favorited: req.body.favorited,
        replies: req.body.replies,
        userMentions: req.body.userMentions
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