//A single JavaScript file that contains all controllers
var app = angular.module('dopplerTwitter', ['ngResource','ngRoute']);
app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
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