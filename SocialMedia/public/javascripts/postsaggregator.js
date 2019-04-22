//A single JavaScript file that contains all controllers
var app = angular.module('dopplerTwitter', ['ngResource','ngRoute','ngStorage']);
app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/viewnotifications/:userid', {
            templateUrl: 'partials/viewnotification.html',
            controller: 'NotificationCtrl'
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

app.controller('HomeCtrl', ['$scope','$localStorage', '$resource', '$routeParams', '$location',
    function($scope, $localStorage, $resource, $routeParams, $location){
        var Posts = $resource('/api/posts');
        var PostsFollowing = $resource('/users/following');
        var pFollow = $resource('/users/follow');
        var Users = $resource('/users');
        console.log("username is ", $localStorage.user)
        Posts.query({author: $localStorage.user._id}, function(post){
            $scope.Posts = post;
        });
        // Users.query(function(user){
        //     $scope.Users = user;
        // });
        PostsFollowing.get({author:$localStorage.user._id}, function(usersReturn){
            console.log("The content from users is ",usersReturn.following);
            var arr = [];
            for(i = 0; i< usersReturn.following.length; i++){
                console.log("The users are", usersReturn.following[i]);
                pFollow.get({username:usersReturn.following[i] }, function(returnBack){
                    console.log("Return of the users",returnBack._id );
                    Posts.query({author: returnBack._id}, function(postBack){
                        console.log("Return back from users and posts", postBack);
                        arr.push(postBack);
                        
                    });
                })
            }
            $scope.postFollowing = arr;
        })
        
        //Add a like function
        $scope.like = function(postid, fav_count){
            var test_post = $resource('/api/posts/:postid');
            console.log(test_post);
            test_post.query({author: $localStorage.user._id}, function(post){
                console.log(post.favorited);
                for(i =0 ; i < post.length ; i++){
                    if(post[i]._id == postid){
                        post[i].favorited = fav_count + 1;
                        var curr_post = $resource('/api/posts/:postid', {postid: post[i]._id}, {
                            update: { method: 'PUT' }
                        });
                        curr_post.update(post[i], function(post){
                            $scope.post = post;
                            console.log("HIT: " + post.favorited);
                            $location.path('/#/');
                        });
                    }
                }
            });
        };
        $scope.search = function(user_name){
            var search_q = user_name;
            console.log(search_q);
            Posts.query(search_q, function(post){
                $scope.user_query = post;
                console.log(post._id);
            });
        };
        $scope.logout = function(){
            console.log("logging out")
            $localStorage.$reset();
            $location.path('/login')
        }
}]);

app.controller('NotificationCtrl', ['$scope', '$resource', '$location','$routeParams','$localStorage',
    function($scope, $resource, $location, $routeParams, $localStorage){
        //Get everything based on the username
        var Posts = $resource('/api/posts/viewnotifications/:userid', { userid: $routeParams.userid }, {
            update: { method: 'PUT' }
        });
        console.log("The post is ", Posts)
        var Users = $resource('/users');
        console.log(Users);
        console.log($localStorage.user.username);
        Posts.query({userMentions: "@"+$localStorage.user.username}, function(post){
            console.log("Here");
            $scope.Posts = post;
        });
    }
]);

app.controller('ReplyPostCtrl', ['$scope', '$resource', '$location','$routeParams','$localStorage',
    function($scope, $resource, $location, $routeParams, $localStorage){
        var Posts = $resource('/api/posts/:replypostid', { replypostid: $routeParams.postid }, {
            update: { method: 'PUT' }
        });
        Posts.get({ editpostid: $routeParams.postid}, function(post){
            $scope.reply_post = post;
        });
        $scope.reply = function(postid){
            var posts = $resource('/api/posts');
            console.log(posts);
            var newid = 0;
            $scope.post.author = $localStorage.user._id;
            console.log($scope.post.author);
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

app.controller('createpostCtrl', ['$scope', '$resource', '$location', '$localStorage',
    function( $scope, $resource, $location, $localStorage){
        $scope.save = function(){
            var posts = $resource('/api/posts');
            var content = $scope.post;
            content.author = $localStorage.user._id;
            console.log("Original : " + content.userMentions);
            // //Parse user mentions
            // var userMenArr = [];
            // var userName = [];
            // async function parsestring(){
            //     for(i = 0 ; i <= content.userMentions.length; i++){
            //         console.log(i);
            //         console.log(content.userMentions[i]);
            //         if(content.userMentions[i] != ","){
            //             userName.push(content.userMentions[i]);
            //         }
            //         else if(content.userMentions[i] == ","){
            //             var add = userName.join("");
            //             console.log("Inhere : " + add);
            //             userMenArr.push("@"+ add);
            //             userName = [];
            //         }
            //     }
            //     return userMenArr;
            // }
            // userMenArr = parsestring();
            // $scope.post.userMentions = userMenArr;
            // console.log($scope.post.userMentions);
            posts.save($scope.post, function(){
                $location.path('/#/');
            });
            
    };
}]);  

app.controller('LoginCtrl', ['$localStorage','$scope', '$resource', '$location',
    function($localStorage, $scope, $resource, $location){
        $scope.submit = function(){
            var error = 0;
            if($scope.user.username == null || $scope.user.password == null){
                alert("Please fill in both the fields");
                error = 1;
            }
            if(error != 1){
            var loginForm = $resource('/users');
            loginForm.get($scope.user, function(user){
                if(user.username == null){
                    alert("Username or password is not right")
                }
                else{
                    console.log('storing session:', user);
                    $localStorage.user = user;
                    $location.path('/');
                }
            });
            
        };
}}]);

app.controller('registerCtrl', ['$scope','$http', '$resource', '$location', '$routeParams', '$route',
function($scope, $http, $resource, $location, $routeParams, $route){
    $scope.submit = function(){
        var flag = 0;
        if($scope.user.name == null || $scope.user.username == null || $scope.user.password == null || $scope.user.confirmpassword == null){
            alert("Please fill all the fields on this page to register yourself");
            flag = 1;
        }

        if($scope.user.password != $scope.user.confirmpassword){
            alert("Passwords don't match");
            flag = 1
        }
        else{
            
            if(flag != 1){
                var data = {user: $scope.user};
                console.log("data:", data);
                $http.post('/users/register', data)
                .then(function(response) {
                    rsp = response.data;
                    console.log("response.data:", rsp);
                    if(rsp.error){
                        alert(rsp.error)
                    } else{
                        console.log("registration successful");
                        $location.path('/login');
                    }
                   
                    $location.replace();
                })
                .catch(function(response) {
                    console.error('Gists error', response.status, response.data);
                })
                .finally(function() {
                    console.log("finally finished gists");
                });
                
            }
        }
    }
}
]);

app.controller('DeletePostCtrl', ['$scope', '$resource', '$location', '$routeParams','$localStorage',
    function($scope, $resource, $location, $routeParams, $localStorage){
        var Post = $resource('/api/posts/:postid');
        console.log("213123123jibfgjbisufgpabsoudgipasb0dg");
        console.log("POost : " + Post);
        console.log("ID : " + $routeParams.postid);
        Post.query({author: $localStorage.user._id}, function(post){
            console.log("DNAKNDASNDA: " + post);
            for(i = 0; i <post.length; i++){
                console.log("HERE1");
                if(post[i]._id == $routeParams.postid ){
                    console.log("HERE2");
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
