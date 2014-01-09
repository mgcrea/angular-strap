'use strict';

angular.module('mgcrea.ngStrapDocs')

.config(function($asideProvider) {
  angular.extend($asideProvider.defaults, {
    html: true
  });
})

.controller('AsideDemoCtrl', function($scope) {
  $scope.aside = {title: 'Title', content: 'Hello Aside<br />This is a multiline message!'};
});
