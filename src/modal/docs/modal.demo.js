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
  function MyModalController($scope) {
    $scope.title = 'Some Title';
    $scope.content = 'Hello Modal<br />This is a multiline message from a controller!';
  }
  MyModalController.$inject = ['$scope'];
  var myModal = $modal({controller: MyModalController, templateUrl: 'modal/docs/modal.demo.tpl.html', show: false});
  $scope.showModal = function() {
    myModal.$promise.then(myModal.show);
  };
  $scope.hideModal = function() {
    myModal.$promise.then(myModal.hide);
  };

});
