
angular.module('$strap.directives')

.directive('bsModal', ['$parse', '$compile', '$http', '$timeout', '$q', '$templateCache', function($parse, $compile, $http, $timeout, $q, $templateCache) {
  'use strict';

  return {
    restrict: 'A',
    scope: true,
    link: function postLink(scope, element, attr, ctrl) {

      var getter = $parse(attr.bsModal),
        setter = getter.assign,
        value = getter(scope);

      $q.when($templateCache.get(value) || $http.get(value, {cache: true})).then(function onSuccess(template) {
        console.warn('template', template);
        // Handle response from $http promise
        if(angular.isObject(template)) {
          template = template.data;
        }

        // Provide scope display functions
        scope.dismiss = function() {
          $modal.modal('hide');
        };
        scope.show = function() {
          $modal.modal('show');
        };

        // Build modal object
        var id = getter(scope).replace('.html', '').replace(/\//g, '-').replace(/\./g, '-') + '-' + scope.$id;
        var $modal = $('<div></div>').attr('id', id).attr('tabindex', -1).addClass('modal hide fade').html(template);
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
