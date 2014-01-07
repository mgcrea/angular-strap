'use strict';

angular.module('mgcrea.ngStrapDocs')

.controller('AsideDemoCtrl', function($scope) {
  $scope.aside = {title: 'Title', content: 'Hello Aside<br />This is a multiline message!'};
});
