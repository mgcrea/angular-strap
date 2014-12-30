'use strict';

angular.module('mgcrea.ngStrapDocs')

.controller('ProgressbarDemoCtrl', function($scope, $interval) {
  $scope.value = 50;

    $interval(function (){
      if($scope.value < 100)
        $scope.value+=10;
      else
        $scope.value = 0;
    }, 2000);
});
