'use strict';

angular.module('mgcrea.ngStrapDocs')

.controller('DropdownDemoCtrl', function($scope, $window) {

  $scope.dropdown = [
    {text: 'Another action', href: '#anAction'},
    {text: 'Something else here', click: '#anotherAction'},
    {divider: true},
    {text: 'Separated link', href: '#separatedLink'}
  ];

  $scope.$alert = function(txt) {
    $window.alert(txt);
  };

});
