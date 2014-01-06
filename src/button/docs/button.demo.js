'use strict';

angular.module('mgcrea.ngStrapDocs')

.controller('ButtonDemoCtrl', function($scope) {
  $scope.button = {
    toggle: false,
    checkbox: {left: false, middle: true, right: false},
    radio: 'left'
  };
});
