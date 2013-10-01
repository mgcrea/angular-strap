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

        var refresh = function(newValue, oldValue) {
          if (!angular.equals(newValue, oldValue)) {
            // Avoid closing the dropdown while selecting multiple options
            if (element.attr('multiple') &&
                element.data().selectpicker.button.parent().hasClass('open'))
              return true;
            
            element.selectpicker('refresh');
          }
        };

        // Watch for changes to the model value
        scope.$watch(attrs.ngModel, function(newValue, oldValue) {
          refresh(newValue, oldValue);
        });

        // Watch for changes to the options
        scope.$watch(attrs.bsSelect, function(newValue, oldValue) {
          refresh(newValue, oldValue);
        });

      }

    }

  };

});
