'use strict';

angular.module('mgcrea.ngStrapDocs')

.controller('AlertDemoCtrl', function($scope, $templateCache, $timeout, $alert) {

  $scope.alert = {title: 'Holy guacamole!', content: 'Best check yo self, you\'re not looking too good.', type: 'info'};

  // Service usage
  var myAlert = $alert({title: 'Holy guacamole!', content: 'Best check yo self, you\'re not looking too good.', placement: 'top', type: 'info', keyboard: true, show: false});
  $scope.showAlert = function() {
    myAlert.show(); // or myAlert.$promise.then(myAlert.show) if you use an external html template
  };

});
