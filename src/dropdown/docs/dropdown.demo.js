'use strict';

angular.module('mgcrea.ngStrapDocs')

.controller('DropdownDemoCtrl', function($scope, $window) {

  $scope.dropdown = [
    {text: 'Another action', href: '#anotherAction'},
    {text: 'Something else here', click: '$alert(\'working ngClick!\')'},
    {divider: true},
    {text: 'Separated link', href: '#separatedLink'}
  ];

  $scope.$alert = function(txt) {
    $window.alert(txt);
  };

});
