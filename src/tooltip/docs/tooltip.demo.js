'use strict';

angular.module('mgcrea.ngStrapDocs')

.config(function($tooltipProvider) {
  angular.extend($tooltipProvider.defaults, {
    html: true
  });
})

.controller('TooltipDemoCtrl', function($scope, $q, $tooltip) {

  $scope.tooltip = {title: 'Hello Tooltip<br />This is a multiline message!', checked: false};

  // Controller usage example
  /*
  var myTooltip = $tooltip(angular.element(document.querySelector('#test')), {title: 'Hello tooltip', placement: 'right', show: false});
  $scope.showTooltipOnClick = function() {
    $q.when(myTooltip.$promise).then(function() {
      myTooltip.show();
    });
  };
  */

});
