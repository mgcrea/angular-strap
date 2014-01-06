'use strict';

angular.module('mgcrea.ngStrapDocs')

.controller('PopoverDemoCtrl', function($scope) {
  $scope.popover = {title: 'Title', content: 'Hello Popover<br />This is a multiline message!', saved: false};
});
