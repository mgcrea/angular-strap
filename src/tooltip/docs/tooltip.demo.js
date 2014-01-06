'use strict';

angular.module('mgcrea.ngStrapDocs')

.controller('TooltipDemoCtrl', function($scope) {
  $scope.tooltip = {title: 'Hello Tooltip<br />This is a multiline message!', checked: false};
});
