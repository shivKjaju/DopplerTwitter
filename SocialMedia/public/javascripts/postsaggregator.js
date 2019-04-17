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
        .otherwise({
            redirectTo: '/'
        });

}]);

app.controller('HomeCtrl', ['$scope', '$resource', 
    function($scope, $resource){
        var Posts = $resource('/');
        //console.log(Posts.author);
        Posts.query(function(post){
            console.log(post.author);
            $scope.Posts = post.author;
        });
    }]);

 app.controller('createpostCtrl', ['$scope', '$resource', '$location',
 function( $scope, $resource, $location){
    $scope.save = function(){
        var posts = $resource('/:id');
        posts.save({post:$scope.posts}, function(){  
        $location.path('/#/');
    });
};
 }]);   