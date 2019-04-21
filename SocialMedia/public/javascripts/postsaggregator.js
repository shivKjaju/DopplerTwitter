//A single JavaScript file that contains all controllers
var app = angular.module('dopplerTwitter', ['ngResource','ngRoute']);
app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/login',{
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
        })
        .when('/register', {
            templateUrl: 'partials/register.html',
            controller: 'registerCtrl'
        })
        .when('/createPost', {
            templateUrl: 'partials/createPost.html',
            controller: 'createpostCtrl'
        })
        .when('/post/delete/:postid',{
            templateUrl: 'partials/post-delete.html',
            controller: 'DeletePostCtrl'
        })
        .when('/post/:postid',{
            templateUrl: 'partials/post-edit.html',
            controller: 'EditPostCtrl'
        })
        .when('/post/reply/:postid',{
            templateUrl: 'partials/post-reply.html',
            controller: 'ReplyPostCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

}]);

app.controller('HomeCtrl', ['$scope', '$resource', '$routeParams', '$location',
    function($scope, $resource, $routeParams, $location){
        var Posts = $resource('/api/posts');
        var Users = $resource('/users')
        Posts.query(function(post){
            $scope.Posts = post;
        });
        Users.query(function(user){
            $scope.Users = user;
        });
        //Add a like function
        $scope.like = function(postid, fav_count){
            var test_post = $resource('/api/posts/:postid');
            test_post.query({id:postid}, function(post){
                console.log("In here");
                for(i =0 ; i < post.length ; i++){
                    if(post[i]._id == postid){
                        console.log(parseInt(postid.favorited));
                        postid.favorited = fav_count + 1;
                    }
                }
            });
            var curr_post = $resource('/api/posts/:postid', {postid: postid}, {
                update: { method: 'PUT' }
            });
            curr_post.update({postid: $routeParams.postid}, function(post){
                $scope.post = post;
                $location.path('/#/');
            });
        };
}]);

app.controller('ReplyPostCtrl', ['$scope', '$resource', '$location','$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Posts = $resource('/api/posts/:replypostid', { replypostid: $routeParams.postid }, {
            update: { method: 'PUT' }});
        Posts.get({ editpostid: $routeParams.postid}, function(post){
            $scope.reply_post = post;
        });

        $scope.reply = function(postid){
            var posts = $resource('/api/posts');
            console.log(posts);
            var newid = 0;
            posts.save($scope.post, function(post){  
                newid = post
                $scope.reply_post.replies.push(newid);
                Posts.update($scope.reply_post, function(){
                    console.log("Updating replies");
                    $location.path('/#/');
                });
            });
        }
}]); 

app.controller('createpostCtrl', ['$scope', '$resource', '$location',
    function( $scope, $resource, $location){
        $scope.save = function(){
            var posts = $resource('/api/posts');
            posts.save($scope.post, function(){  
            $location.path('/#/');
        });
    };
}]); 

app.controller('LoginCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
        $scope.submit = function(){
            var loginForm = $resource('/api/users');
            loginForm.save($scope.new_user, function(){
                $location.path('/#/');
            });
        };
}]);

app.controller('DeletePostCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Post = $resource('/api/posts/:postid');
        alert(Post.content);
        Post.query({_id: $routeParams.postid}, function(post){
            for(i = 0; i <post.length; i++){
                if(post[i]._id == $routeParams.postid ){
                    $scope.delete_post = post[i];   
                }
            }
        })
        $scope.delete = function(){
            Post.delete({ postid: $routeParams.postid}, function(delete_post){
                $location.path('/#/');
            });
        }
    }
]);

app.controller('EditPostCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Posts = $resource('/api/posts/:editpostid', { editpostid: $routeParams.postid }, {
            update: { method: 'PUT' }
        });
        Posts.get({ editpostid: $routeParams.postid}, function(post){
            $scope.post = post;
        });
        $scope.edit = function(postid){
            Posts.update($scope.post, function(){
                $location.path('/');
            });
        }
    }]);
