'use strict';

angular.module('mgcrea.ngStrapDocs')

.config(function($modalProvider) {
  angular.extend($modalProvider.defaults, {
    html: true
  });
})

.controller('ModalDemoCtrl', function($scope) {
  $scope.modal = {title: 'Title', content: 'Hello Modal<br />This is a multiline message!'};
});
