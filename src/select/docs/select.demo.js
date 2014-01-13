'use strict';

angular.module('mgcrea.ngStrapDocs')

.controller('SelectDemoCtrl', function($scope, $http) {

  $scope.selectedIcon = '';
  $scope.selectedIcons = ['Globe', 'Heart'];
  $scope.icons = [
    {value: 'Gear', label: '<i class="fa fa-gear"></i> Gear'},
    {value: 'Globe', label: '<i class="fa fa-globe"></i> Globe'},
    {value: 'Heart', label: '<i class="fa fa-heart"></i> Heart'},
    {value: 'Camera', label: '<i class="fa fa-camera"></i> Camera'}
  ];

});
