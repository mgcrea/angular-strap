'use strict';

angular.module('mgcrea.ngStrapDocs')

.controller('AlertDemoCtrl', function($scope, $templateCache, $timeout, $alert) {

  $scope.alert = {title: 'Holy guacamole!', content: 'Best check yo self, you\'re not looking too good.', type: 'info'};

  // $scope.showAlert = function() {
  //   $alert({title: 'Holy guacamole!', content: 'Best check yo self, you\'re not looking too good.', placement: 'top', type: 'info', keyboard: true, show: true});
  // };

});
