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
        var post = $resource('/api/posts');
        var mapFunction = function(){
            emit(this.author, this.content);
        };
        var reduce = function(author, content){
            return content.join();
        };
        db.posts.mapReduce(mapFunction, reduce, {out: "postResults"});
        $scope.Posts = out;
    }]);

 app.controller('createpostCtrl', ['$scope', '$resource', '$location'],
 function( $scope, $resource, $location){
    $scope.save = function(){
        var posts = $resource('/:id');
        posts.save({post:$scope.post, userMentions:$scope.userMentions})
        $location.path('/');
    };
 });   