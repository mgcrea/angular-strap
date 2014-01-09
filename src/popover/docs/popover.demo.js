'use strict';

angular.module('mgcrea.ngStrapDocs')

.config(function($popoverProvider) {
  angular.extend($popoverProvider.defaults, {
    html: true
  });
})

.controller('PopoverDemoCtrl', function($scope) {
  $scope.popover = {title: 'Title', content: 'Hello Popover<br />This is a multiline message!'};
});
