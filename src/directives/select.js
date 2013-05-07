'use strict';

angular.module('$strap.directives')

.directive('bsSelect', function($timeout) {

  var NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w\d]*)|(?:\(\s*([\$\w][\$\w\d]*)\s*,\s*([\$\w][\$\w\d]*)\s*\)))\s+in\s+(.*)$/;

  return {
    restrict: 'A',
    require: '?ngModel',
    link: function postLink(scope, element, attrs, controller) {

      var options = scope.$eval(attrs.bsSelect) || {};

      $timeout(function() {
        element.selectpicker(options);
        element.next().removeClass('ng-scope');
      });

      // If we have a controller (i.e. ngModelController) then wire it up
      if(controller) {

        // Watch for changes to the model value
        scope.$watch(attrs.ngModel, function(newValue, oldValue) {
          if (newValue !== oldValue) {
            element.selectpicker('refresh');
          }
        });

      }

    }

  };

});
