'use strict';

angular.module('mgcrea.ngStrapDocs')

.config(function($tooltipProvider) {
  angular.extend($tooltipProvider.defaults, {
    html: true
  });
})

.controller('TooltipDemoCtrl', function($scope) {
  $scope.tooltip = {title: 'Hello Tooltip<br />This is a multiline message!', checked: false};
});
