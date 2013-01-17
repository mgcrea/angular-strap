
angular.module('$strap.directives')

.directive('bsAlert', ['$parse', '$timeout', '$compile', function($parse, $timeout, $compile) {
  'use strict';

  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {

      scope.$watch(attrs.bsAlert, function(newValue, oldValue) {

        if(typeof newValue === 'undefined') {
          if(typeof oldValue !== 'undefined') {
            element.remove();
          }
          return;
        }

        // Set alert content
        element.html((newValue.title ? '<strong>' + newValue.title + '</strong>&nbsp;' : '') + newValue.content || '');

        // Compile alert content
        $timeout(function(){
          $compile(element.contents())(scope);
        });

        // Add proper class
        if(newValue.type || oldValue.type) {
          oldValue.type && element.removeClass('alert-' + oldValue.type);
          newValue.type && element.addClass('alert-' + newValue.type);
        }

        // Setup close button
        if(newValue.close !== false) {
          element.prepend('<button type="button" class="close" data-dismiss="alert">&times;</button>');
        }

      }, true);

      // For basic alerts
      if(!attrs.bsAlert && attrs.close !== '0') {
        element.prepend('<button type="button" class="close" data-dismiss="alert">&times;</button>');
      }

      element.addClass('alert').alert();

      // element.on('close', function() {
      // });

    }
  };
}]);
