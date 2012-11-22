
angular.module('$strap.directives')

.directive('bsModal', ['$parse', '$compile', '$http', '$timeout',  function($parse, $compile, $http, $timeout) {

  return {
    restrict: 'A',
    scope: true,
    link: function postLink(scope, element, attr, ctrl) {

      var getter = $parse(attr.bsModal),
        setter = getter.assign;

      $http.get(getter(scope)).success(function(data) {

        // Provide scope display functions
        scope.dismiss = function() {
          $modal.modal('hide');
        };
        scope.show = function() {
          $modal.modal('show');
        };

        // Build modal object
        var id = getter(scope).replace(/\//g, '-').replace(/\./g, '-').replace('html', scope.$id);
        var $modal = $('<div></div>');
        $modal = $modal.attr('id', id).addClass('modal hide fade').html(data);
        $('body').append($modal);

        // Configure element
        element.attr('href', '#' + id).attr('data-toggle', 'modal');

        // Compile modal content
        $timeout(function(){
          $compile($modal)(scope);
        });

        // $modal.on('hidden', function() {
        // });

      });
    }
  };
}]);
