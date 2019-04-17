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
        var Posts = $resource('/api/posts');
        var Users = $resource('/users')
        Posts.query(function(post){
            $scope.Posts = post;
        });
        Users.query(function(user){
            $scope.Users = user;
        });
}]);

 app.controller('createpostCtrl', ['$scope', '$resource', '$location',
 function( $scope, $resource, $location){
    $scope.save = function(){
        var posts = $resource('/api/posts');
        posts.save($scope.new_post, function(){  
        $location.path('/#/');
    });
};
 }]);   