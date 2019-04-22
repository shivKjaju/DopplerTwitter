//A single JavaScript file that contains all controllers
var app = angular.module('dopplerTwitter', ['ngResource','ngRoute','ngStorage']);
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
        .otherwise({
            redirectTo: '/'
        });

}]);

app.controller('HomeCtrl', ['$scope','$localStorage', '$resource', '$routeParams', '$location',
    function($scope, $localStorage, $resource, $routeParams, $location){
        var Posts = $resource('/api/posts');
        //var PostsFollowing = $resource('/api/posts-following');
        var Users = $resource('/users');
        console.log("username is ", $localStorage.user)
        Posts.query({author: $localStorage.user._id}, function(post){
            $scope.Posts = post;
        });
        Users.query(function(user){
            $scope.Users = user;
        });

        // PostsFollowing.query({author: $localStorage.user._id}, function(post){
        //     $scope.PostsFollowing = post;
        // });
        
        $scope.like = function(postid){
            var curr_post = $resource('/api/posts/:postid', { postid: postid }, {
                update: { method: 'PUT' }
            });
            curr_post.update({postid: $routeParams.postid}, function(post){
                $scope.post = post;
                $location.path('/#/');
            });
        };
}]);

app.controller('createpostCtrl', ['$scope','$localStorage',  '$resource', '$location',
    function( $scope, $localStorage, $resource, $location){
        $scope.save = function(){
            var posts = $resource('/api/posts');
            var content = $scope.post;
            content.author = $localStorage.user._id;
            posts.save(content, function(){  
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
        var Posts = $resource('/api/posts/:postid', { postid: $routeParams.postid }, {
            update: { method: 'PUT' }
            
        });
        console.log($routeParams.postid);
        Posts.get({ postid: $routeParams.postid}, function(post){
            $scope.post = post;
        });
        console.log($scope.post);
        $scope.edit = function(postid){
            Posts.update($scope.post, function(){
                $location.path('/#/');
            });
        }
        console.log($scope.post);
    }]);
