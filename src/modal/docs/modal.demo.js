'use strict';

angular.module('mgcrea.ngStrapDocs')

.config(function($modalProvider) {
  angular.extend($modalProvider.defaults, {
    html: true
  });
})

.controller('ModalDemoCtrl', function($scope, $modal) {
  $scope.modal = {title: 'Title', content: 'Hello Modal<br />This is a multiline message!'};

  // Controller usage example
  //
  // var myModal = $modal({title: 'Title', content: 'Hello Modal<br />This is a multiline message!', show: false});
  // $scope.showModal = function() {
  //   myModal.$promise.then(myModal.show);
  // };
  // $scope.hideModal = function() {
  //   myModal.$promise.then(myModal.hide);
  // };

});
