'use strict';

angular.module('mgcrea.ngStrapDocs')

.controller('MainCtrl', function ($scope, $rootScope, $location, $anchorScroll, $plunkr) {

  $scope.$scrollTo = function(hash) {
    $location.hash(hash);
    $anchorScroll();
  };

  $scope.createPlunkr = function() {
    var myPlunkr = $plunkr();
  };

})
