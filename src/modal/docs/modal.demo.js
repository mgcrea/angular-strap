'use strict';

angular.module('mgcrea.ngStrapDocs')

.controller('ModalDemoCtrl', function($scope) {
  $scope.modal = {title: 'Title', content: 'Hello Modal<br />This is a multiline message!'};
});
