'use strict';

angular.module('mgcrea.ngStrapDocs')

.config(function($datepickerProvider) {
  angular.extend($datepickerProvider.defaults, {
    dateFormat: 'dd/MM/yyyy',
    startWeek: 1
  });
})

.controller('DatepickerDemoCtrl', function($scope, $http) {

  $scope.selectedDate = new Date();
  $scope.selectedDateAsNumber = Date.UTC(1986, 1, 22);
  // $scope.fromDate = new Date();
  // $scope.untilDate = new Date();
  $scope.getType = function(key) {
    return Object.prototype.toString.call($scope[key]);
  };

  $scope.clearDates = function() {
    $scope.selectedDate = null;
  };

});
