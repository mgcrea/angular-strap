
angular.module('$strap.directives')

.directive('bsAlert', ['$parse', '$timeout', '$compile', function($parse, $timeout, $compile) {
  'use strict';

  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {

      scope.$watch(attrs.bsAlert, function(newValue, oldValue) {
        element.html((newValue.title ? '<strong>' + newValue.title + '</strong>&nbsp;' : '') + newValue.content || '');
        // Compile alert content
        $timeout(function(){
          $compile(element.contents())(scope);
        });
        if(newValue.type || oldValue.type) {
          oldValue.type && element.removeClass('alert-' + oldValue.type);
          newValue.type && element.addClass('alert-' + newValue.type);
        }
        if(newValue.close !== false) {
          element.prepend('<button type="button" class="close" data-dismiss="alert">&times;</button>');
        }
      }, true);

      element.alert();

      // element.on('close', function() {
      // });

    }
  };
}]);
