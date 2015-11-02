'use strict';

angular.module('mgcrea.ngStrapDocs')

.config(function($dropdownProvider) {
  angular.extend($dropdownProvider.defaults, {
    html: true
  });
})

.controller('DropdownDemoCtrl', function($scope, $alert) {

  $scope.dropdown = [
    {text: '<i class="fa fa-download"></i>&nbsp;Another action', href: '#anotherAction', active: true},
    {text: '<i class="fa fa-globe"></i>&nbsp;Display an alert', click: '$alert("Holy guacamole!")'},
    {text: '<i class="fa fa-external-link"></i>&nbsp;External link', href: '/auth/facebook', target: '_self'},
    {divider: true},
    {text: 'Separated link', href: '#separatedLink'}
  ];

  $scope.$alert = function(title) {
    $alert({title: title, content: 'Best check yo self, you\'re not looking too good.', placement: 'top', type: 'info', keyboard: true, show: true});
  };

});
