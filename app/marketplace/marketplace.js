'use strict';

angular.module('myApp.marketplace', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/marketplace', {
    templateUrl: 'marketplace/marketplace.html',
    controller: 'marketplaceCtrl'
  });
}])

.controller('marketplaceCtrl', [function() {

}]);