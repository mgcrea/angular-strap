'use strict';

angular.module('mgcrea.ngStrapDocs')

.config(function($popoverProvider) {
  angular.extend($popoverProvider.defaults, {
    html: true
  });
})

.controller('PopoverDemoCtrl', function($scope, $popover) {

  $scope.popover = {title: 'Title', content: 'Hello Popover<br />This is a multiline message!'};

  var asAServiceOptions = {
    title: $scope.popover.title,
    content: $scope.popover.content,
    trigger: 'manual'
  }

  var myPopover = $popover(angular.element(document.querySelector('#popover-as-service')), asAServiceOptions);
  $scope.togglePopover = function() {
    myPopover.$promise.then(myPopover.toggle);
  };
});
