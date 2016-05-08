'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'ngMaterial',
  'ngSanitize',
  'myApp.types',
  'myApp.marketplace',
  'angular-underscore'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/types'});
}])
.config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
          .dark();
  $mdThemingProvider.alwaysWatchTheme(true);
  // other color intentions will be inherited
  // from default
})
.filter('to_trusted', ['$sce', function($sce){
  return function(text) {
    return $sce.trustAsHtml(text);
  };
}]);