//A single JavaScript file that contains all controllers
var app = angular.module('MovieMania', ['ngResource','ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/add-movie', {
            templateUrl: 'partials/movie-form.html',
            controller: 'AddMovieCtrl'
        })
        .when('/movie/:id', {
            templateUrl: 'partials/movie-form.html',
            controller: 'EditMovieCtrl'
        })
        .when('/movie/delete/:id', {
            templateUrl: 'partials/movie-delete.html',
            controller: 'DeleteMovieCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);