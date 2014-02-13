'use strict';

angular.module('mgcrea.ngStrapDocs')

.controller('TimepickerDemoCtrl', function($scope, $http) {
  $scope.time = new Date(1970, 0, 1, 10, 30);
  $scope.selectedTimeAsNumber = 10 * 36e5;
  $scope.selectedTimeAsString = '10:00';
  $scope.sharedDate = new Date(new Date().setMinutes(0));
});
